import { sql } from "@/server/db";
import { DomainError, type ProblemDetails } from "@/server/problem";
import { cekKelayakanWarga } from "@/server/domain/kelayakan";

export interface BookingResult {
  reservasi_id: string;
  kode_booking: string;
  eksemplar_id: string;
  nomor_induk_eksemplar: string;
  waktu_tenggat: string;
  sisa_waktu_teks: string;
}

export interface AntreanResult {
  reservasi_id: string;
  posisi_antrean: number;
  maks_antrean: number;
}

/**
 * 1. AJUKAN BOOKING ONLINE
 * - Memeriksa kelayakan warga
 * - Mengambil 1 eksemplar 'tersedia' dengan locking FOR UPDATE SKIP LOCKED
 * - Mengubah status eksemplar menjadi 'dibooking'
 * - Menerbitkan reservasi berstatus 'siap_diambil' dengan tenggat default 24 jam
 */
export async function ajukanBooking(
  penggunaId: string,
  bukuId: string
): Promise<BookingResult> {
  return await sql.begin(async (trx) => {
    // 1. Cek Kelayakan Warga
    const kelayakan = await cekKelayakanWarga(penggunaId, trx);
    if (!kelayakan.is_eligible) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/aturan-sirkulasi",
        title: "Peminjaman Tidak Memenuhi Syarat",
        status: 409,
        code: kelayakan.kode_alasan as ProblemDetails["code"],
        detail: kelayakan.alasan_penolakan!,
      });
    }

    // 2. Lock 1 eksemplar berstatus 'tersedia' secara aman dari race-condition
    const [eksemplar] = await trx`
      SELECT id, nomor_induk
      FROM eksemplar
      WHERE buku_id = ${bukuId} AND status = 'tersedia'
      LIMIT 1
      FOR UPDATE SKIP LOCKED;
    `;

    if (!eksemplar) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/stok-habis",
        title: "Eksemplar Tidak Tersedia untuk Booking",
        status: 409,
        code: "STOK_HABIS",
        detail:
          "Seluruh eksemplar fisik buku ini sedang dipinjam atau dibooking warga lain. Anda dapat memilih masuk ke antrean online (FIFO).",
      });
    }

    // 3. Ambil pengaturan durasi booking (default 24 jam)
    const [cfg] = await trx`
      SELECT nilai FROM pengaturan WHERE kunci = 'booking_jam' LIMIT 1;
    `;
    const bookingJam = parseInt(cfg?.nilai || "24", 10);

    // Hitung tenggat waktu (Asia/Jakarta)
    const waktuTenggatDate = new Date(Date.now() + bookingJam * 60 * 60 * 1000);
    const waktuTenggatIso = waktuTenggatDate.toISOString();

    // Generate kode booking unik, misal: BKG-202611-xxxx
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const kodeBooking = `BKG-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}-${randSuffix}`;

    // 4. Update status eksemplar menjadi 'dibooking'
    await trx`
      UPDATE eksemplar
      SET status = 'dibooking', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${eksemplar.id};
    `;

    // 5. Masukkan data ke tabel reservasi
    const [reservasi] = await trx`
      INSERT INTO reservasi (
        pengguna_id, buku_id, eksemplar_id, jenis, status, kode_booking, waktu_tenggat
      )
      VALUES (
        ${penggunaId}, ${bukuId}, ${eksemplar.id}, 'booking', 'siap_diambil', ${kodeBooking}, ${waktuTenggatIso}
      )
      RETURNING id;
    `;

    // Catat audit log
    await trx`
      INSERT INTO audit_log (pengguna_id, aksi, tabel, entitas_id, data_baru)
      VALUES (
        ${penggunaId}, 'BOOKING_ONLINE', 'reservasi', ${reservasi.id},
        ${JSON.stringify({ kode_booking: kodeBooking, eksemplar_id: eksemplar.id, waktu_tenggat: waktuTenggatIso })}
      );
    `;

    return {
      reservasi_id: reservasi.id,
      kode_booking: kodeBooking,
      eksemplar_id: eksemplar.id,
      nomor_induk_eksemplar: eksemplar.nomor_induk,
      waktu_tenggat: waktuTenggatIso,
      sisa_waktu_teks: `${bookingJam} jam tersisa`,
    };
  });
}

/**
 * 2. MASUK ANTREAN ONLINE (FIFO)
 * - Memeriksa kelayakan warga
 * - Menghitung batas maksimal antrean dinamis (1-5 eksemplar = maks 3 antrean; 6+ = maks 5 antrean)
 * - Memastikan kuota antrean belum penuh
 * - Menerbitkan tiket antrean berurutan
 */
export async function ajukanAntrean(
  penggunaId: string,
  bukuId: string
): Promise<AntreanResult> {
  return await sql.begin(async (trx) => {
    // 1. Cek Kelayakan Warga
    const kelayakan = await cekKelayakanWarga(penggunaId, trx);
    if (!kelayakan.is_eligible) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/aturan-sirkulasi",
        title: "Peminjaman Tidak Memenuhi Syarat",
        status: 409,
        code: kelayakan.kode_alasan as ProblemDetails["code"],
        detail: kelayakan.alasan_penolakan!,
      });
    }

    // 2. Hitung jumlah total eksemplar dan antrean saat ini
    const [bukuInfo] = await trx`
      SELECT 
        b.id,
        b.total_eksemplar,
        COUNT(r.id)::int as antrean_saat_ini
      FROM buku b
      LEFT JOIN reservasi r ON r.buku_id = b.id AND r.jenis = 'antre' AND r.status = 'menunggu'
      WHERE b.id = ${bukuId}
      GROUP BY b.id, b.total_eksemplar;
    `;

    if (!bukuInfo) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/buku-tidak-ditemukan",
        title: "Buku Tidak Ditemukan",
        status: 404,
        code: "NOT_FOUND",
        detail: `Buku dengan ID ${bukuId} tidak terdaftar.`,
      });
    }

    // Rumus Batas Antrean Sesuai Aturan Bisnis Resmi:
    // 1 - 5 eksemplar: maksimal 3 antrean
    // 6 - 10+ eksemplar: maksimal 5 antrean
    const maksAntrean = bukuInfo.total_eksemplar <= 5 ? 3 : 5;

    if (bukuInfo.antrean_saat_ini >= maksAntrean) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/antrean-penuh",
        title: "Batas Kuota Antrean Tercapai",
        status: 409,
        code: "ANTREAN_PENUH",
        detail: `Kuota antrean untuk judul ini sudah penuh (maksimal ${maksAntrean} antrean). Silakan cek kembali beberapa hari ke depan.`,
      });
    }

    const posisiBaru = bukuInfo.antrean_saat_ini + 1;

    // 3. Masukkan antrean baru
    const [antrean] = await trx`
      INSERT INTO reservasi (
        pengguna_id, buku_id, jenis, status, posisi_antrean
      )
      VALUES (
        ${penggunaId}, ${bukuId}, 'antre', 'menunggu', ${posisiBaru}
      )
      RETURNING id;
    `;

    // Catat audit log
    await trx`
      INSERT INTO audit_log (pengguna_id, aksi, tabel, entitas_id, data_baru)
      VALUES (
        ${penggunaId}, 'MASUK_ANTREAN_ONLINE', 'reservasi', ${antrean.id},
        ${JSON.stringify({ posisi_antrean: posisiBaru, maks_antrean: maksAntrean })}
      );
    `;

    return {
      reservasi_id: antrean.id,
      posisi_antrean: posisiBaru,
      maks_antrean: maksAntrean,
    };
  });
}

/**
 * 3. BATALKAN RESERVASI (BOOKING ATAU ANTREAN)
 * - Jika membatalkan booking 'siap_diambil', eksemplar otomatis dialihkan ke antrean FIFO berikutnya
 *   atau dikembalikan ke status 'tersedia'.
 */
export async function batalkanReservasi(
  penggunaId: string,
  reservasiId: string
): Promise<{ sukses: boolean }> {
  return await sql.begin(async (trx) => {
    const [res] = await trx`
      SELECT id, buku_id, eksemplar_id, jenis, status
      FROM reservasi
      WHERE id = ${reservasiId} AND pengguna_id = ${penggunaId}
      LIMIT 1
      FOR UPDATE;
    `;

    if (!res) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/reservasi-tidak-ditemukan",
        title: "Reservasi Tidak Ditemukan",
        status: 404,
        code: "NOT_FOUND",
        detail: "Tiket reservasi tidak ditemukan atau bukan milik Anda.",
      });
    }

    // Ubah status reservasi menjadi 'batal'
    await trx`
      UPDATE reservasi
      SET status = 'batal', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${res.id};
    `;

    // Jika yang dibatalkan adalah booking dengan eksemplar terkait
    if (res.jenis === "booking" && res.eksemplar_id) {
      // Cek apakah ada antrean FIFO berikutnya
      const [antreanDepan] = await trx`
        SELECT id, pengguna_id
        FROM reservasi
        WHERE buku_id = ${res.buku_id} AND jenis = 'antre' AND status = 'menunggu'
        ORDER BY posisi_antrean ASC, created_at ASC
        LIMIT 1
        FOR UPDATE;
      `;

      if (antreanDepan) {
        // Otomatis naikkan antrean #1 menjadi booking siap_diambil
        const [cfg] = await trx`
          SELECT nilai FROM pengaturan WHERE kunci = 'booking_jam' LIMIT 1;
        `;
        const bookingJam = parseInt(cfg?.nilai || "24", 10);
        const tenggat = new Date(Date.now() + bookingJam * 60 * 60 * 1000).toISOString();
        const randSuffix = Math.floor(1000 + Math.random() * 9000);
        const kodeBooking = `BKG-${new Date().getFullYear()}${randSuffix}`;

        await trx`
          UPDATE reservasi
          SET jenis = 'booking', status = 'siap_diambil', eksemplar_id = ${res.eksemplar_id},
              kode_booking = ${kodeBooking}, waktu_tenggat = ${tenggat}, posisi_antrean = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${antreanDepan.id};
        `;

        // Susutkan posisi antrean lainnya
        await trx`
          UPDATE reservasi
          SET posisi_antrean = posisi_antrean - 1
          WHERE buku_id = ${res.buku_id} AND jenis = 'antre' AND status = 'menunggu';
        `;
      } else {
        // Tidak ada antrean, kembalikan eksemplar ke status 'tersedia'
        await trx`
          UPDATE eksemplar
          SET status = 'tersedia', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${res.eksemplar_id};
        `;
      }
    }

    return { sukses: true };
  });
}
