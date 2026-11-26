import { sql } from "@/server/db";
import { DomainError, type ProblemDetails } from "@/server/problem";
import { cekKelayakanWarga } from "@/server/domain/kelayakan";

export interface KonfirmasiPinjamParams {
  pengguna_id: string;
  eksemplar_id: string;
  jalur: "booking_online" | "langsung_offline";
  durasi_hari?: number;
  petugas_id: string;
}

export interface TransaksiPinjamResult {
  pinjaman_id: string;
  buku_judul: string;
  nomor_induk_eksemplar: string;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  durasi_hari: number;
}

export interface PengembalianBukuResult {
  pinjaman_id: string;
  hari_terlambat: number;
  denda_nominal: number;
  denda_id: string | null;
  antrean_berikutnya_dinaikkan: boolean;
}

/**
 * 1. KONFIRMASI PEMINJAMAN BUKU DI MEJA PUSTAKAWAN
 * Mendukung dua jalur:
 * - 'booking_online': Eksemplar berstatus 'dibooking', diverifikasi dengan pemilik booking
 * - 'langsung_offline': Eksemplar berstatus 'tersedia', dipinjam langsung di tempat
 * Pustakawan dapat menyesuaikan durasi pinjam hari (default 7 hari)
 */
export async function konfirmasiPeminjaman(
  params: KonfirmasiPinjamParams
): Promise<TransaksiPinjamResult> {
  const { pengguna_id, eksemplar_id, jalur, durasi_hari = 7, petugas_id } = params;

  if (durasi_hari <= 0 || durasi_hari > 30) {
    throw new DomainError({
      type: "https://bilik.smktibazma.sch.id/problems/durasi-tidak-valid",
      title: "Durasi Pinjam Tidak Valid",
      status: 400,
      code: "DURASI_TIDAK_VALID",
      detail: "Durasi peminjaman harus antara 1 sampai 30 hari kalender.",
    });
  }

  return await sql.begin(async (trx) => {
    // 1. Ambil data eksemplar dan buku dengan lock
    const [eksemplar] = await trx`
      SELECT e.id, e.nomor_induk, e.status, e.buku_id, b.judul
      FROM eksemplar e
      JOIN buku b ON b.id = e.buku_id
      WHERE e.id = ${eksemplar_id}
      LIMIT 1
      FOR UPDATE;
    `;

    if (!eksemplar) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/eksemplar-tidak-ditemukan",
        title: "Eksemplar Tidak Ditemukan",
        status: 404,
        code: "NOT_FOUND",
        detail: "Barcode eksemplar tidak terdaftar di basis data perpustakaan.",
      });
    }

    // 2. Validasi Jalur Peminjaman
    if (jalur === "booking_online") {
      // Pastikan ada reservasi booking berstatus 'siap_diambil' untuk warga ini
      const [booking] = await trx`
        SELECT id FROM reservasi
        WHERE pengguna_id = ${pengguna_id}
          AND eksemplar_id = ${eksemplar_id}
          AND status = 'siap_diambil'
        LIMIT 1;
      `;
      if (!booking) {
        throw new DomainError({
          type: "https://bilik.smktibazma.sch.id/problems/booking-tidak-cocok",
          title: "Tiket Booking Tidak Cocok",
          status: 409,
          code: "EKSEMPLAR_DIBOOKING_ORANG_LAIN",
          detail: "Eksemplar ini tidak terdaftar atas ajuan booking online warga tersebut.",
        });
      }
      // Ubah status reservasi booking menjadi 'selesai'
      await trx`
        UPDATE reservasi
        SET status = 'selesai', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${booking.id};
      `;
    } else {
      // Jalur langsung_offline: Eksemplar wajib berstatus 'tersedia'
      if (eksemplar.status !== "tersedia") {
        throw new DomainError({
          type: "https://bilik.smktibazma.sch.id/problems/eksemplar-tidak-tersedia",
          title: "Eksemplar Tidak Tersedia untuk Pinjam Langsung",
          status: 409,
          code:
            eksemplar.status === "dibooking"
              ? "EKSEMPLAR_DIBOOKING_ORANG_LAIN"
              : "STOK_HABIS",
          detail:
            eksemplar.status === "dibooking"
              ? "Eksemplar buku tidak dapat dipinjam. Buku ini sedang dialokasikan untuk pengajuan booking warga lain. Silakan pilih eksemplar buku lain yang tersedia."
              : `Eksemplar buku ini sedang berstatus '${eksemplar.status}'. Tidak dapat dipinjam langsung secara offline.`,
        });
      }

      // Cek kelayakan warga (bebas denda, bebas pinjaman aktif, bebas blokir)
      const kelayakan = await cekKelayakanWarga(pengguna_id, trx);
      if (!kelayakan.is_eligible) {
        throw new DomainError({
          type: "https://bilik.smktibazma.sch.id/problems/aturan-sirkulasi",
          title: "Peminjaman Meja Ditolak",
          status: 409,
          code: kelayakan.kode_alasan as ProblemDetails["code"],
          detail: kelayakan.alasan_penolakan!,
        });
      }
    }

    // 3. Hitung Tanggal Jatuh Tempo Kalender
    // Tanggal pinjam = hari ini, jatuh tempo = +durasi_hari
    const [calcDates] = await trx`
      SELECT 
        CURRENT_DATE as tgl_pinjam,
        (CURRENT_DATE + ${durasi_hari} * INTERVAL '1 day')::date as tgl_jatuh_tempo;
    `;

    // 4. Catat Transaksi Pinjaman Baru
    const [pinjaman] = await trx`
      INSERT INTO pinjaman (
        pengguna_id, eksemplar_id, jalur, tanggal_pinjam, durasi_hari,
        tanggal_jatuh_tempo, status, petugas_pinjam_id
      )
      VALUES (
        ${pengguna_id}, ${eksemplar_id}, ${jalur}, ${calcDates.tgl_pinjam}, ${durasi_hari},
        ${calcDates.tgl_jatuh_tempo}, 'aktif', ${petugas_id}
      )
      RETURNING id;
    `;

    // 5. Update Status Eksemplar Menjadi 'dipinjam'
    await trx`
      UPDATE eksemplar
      SET status = 'dipinjam', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${eksemplar_id};
    `;

    // Catat Audit Log
    await trx`
      INSERT INTO audit_log (pengguna_id, aksi, tabel, entitas_id, data_baru)
      VALUES (
        ${petugas_id}, 'KONFIRMASI_PINJAM', 'pinjaman', ${pinjaman.id},
        ${JSON.stringify({
          peminjam_id: pengguna_id,
          eksemplar_id,
          jalur,
          durasi_hari,
          tanggal_jatuh_tempo: calcDates.tgl_jatuh_tempo,
        })}
      );
    `;

    return {
      pinjaman_id: pinjaman.id,
      buku_judul: eksemplar.judul,
      nomor_induk_eksemplar: eksemplar.nomor_induk,
      tanggal_pinjam: calcDates.tgl_pinjam,
      tanggal_jatuh_tempo: calcDates.tgl_jatuh_tempo,
      durasi_hari,
    };
  });
}

/**
 * 2. PROSES PENGEMBALIAN BUKU FISIK & KALKULASI DENDA
 * - Menghitung selisih hari tanggal pengembalian vs tanggal jatuh tempo kalender
 * - Jika terlambat > 0 hari: Menerbitkan tagihan denda otomatis (Rp500/hari)
 * - Jika ada antrean online FIFO untuk buku ini: Antrean #1 otomatis dinaikkan menjadi booking 'siap_diambil'
 */
export async function kembalikanBuku(
  nomorIndukEksemplar: string,
  petugasId: string,
  _kondisi = "baik"
): Promise<PengembalianBukuResult> {
  return await sql.begin(async (trx) => {
    // 1. Cari pinjaman aktif untuk eksemplar ini
    const [pinjaman] = await trx`
      SELECT p.id, p.pengguna_id, p.eksemplar_id, p.tanggal_jatuh_tempo, e.buku_id
      FROM pinjaman p
      JOIN eksemplar e ON e.id = p.eksemplar_id
      WHERE e.nomor_induk = ${nomorIndukEksemplar} AND p.status IN ('aktif', 'terlambat')
      LIMIT 1
      FOR UPDATE;
    `;

    if (!pinjaman) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/pinjaman-tidak-ditemukan",
        title: "Tidak Ada Pinjaman Aktif",
        status: 404,
        code: "NOT_FOUND",
        detail: `Tidak ada riwayat pinjaman aktif yang tercatat untuk eksemplar '${nomorIndukEksemplar}'.`,
      });
    }

    // 2. Hitung keterlambatan berdasarkan kalender Asia/Jakarta
    const [calcLate] = await trx`
      SELECT 
        CURRENT_DATE as tgl_kembali,
        GREATEST(0, (CURRENT_DATE - ${pinjaman.tanggal_jatuh_tempo}::date))::int as hari_terlambat;
    `;

    const hariTerlambat = calcLate.hari_terlambat;
    let dendaNominal = 0;
    let dendaId: string | null = null;

    // 3. Jika terlambat, ambil tarif denda dan terbitkan data denda
    if (hariTerlambat > 0) {
      const [cfgDenda] = await trx`
        SELECT nilai FROM pengaturan WHERE kunci = 'denda_per_hari' LIMIT 1;
      `;
      const tarifPerHari = parseInt(cfgDenda?.nilai || "500", 10);
      dendaNominal = hariTerlambat * tarifPerHari;

      const [denda] = await trx`
        INSERT INTO denda (
          pinjaman_id, pengguna_id, hari_terlambat, tarif_per_hari, total_nominal, status
        )
        VALUES (
          ${pinjaman.id}, ${pinjaman.pengguna_id}, ${hariTerlambat}, ${tarifPerHari}, ${dendaNominal}, 'belum_lunas'
        )
        RETURNING id;
      `;
      dendaId = denda.id;
    }

    // 4. Update status pinjaman menjadi 'selesai'
    await trx`
      UPDATE pinjaman
      SET status = 'selesai', tanggal_kembali = ${calcLate.tgl_kembali},
          petugas_kembali_id = ${petugasId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${pinjaman.id};
    `;

    // 5. Cek apakah ada antrean FIFO untuk buku ini
    let antreanDinaikkan = false;
    const [antreanDepan] = await trx`
      SELECT id, pengguna_id
      FROM reservasi
      WHERE buku_id = ${pinjaman.buku_id} AND jenis = 'antre' AND status = 'menunggu'
      ORDER BY posisi_antrean ASC, created_at ASC
      LIMIT 1
      FOR UPDATE;
    `;

    if (antreanDepan) {
      // Otomatis naikkan antrean #1 menjadi booking siap_diambil
      const [cfgBooking] = await trx`
        SELECT nilai FROM pengaturan WHERE kunci = 'booking_jam' LIMIT 1;
      `;
      const bookingJam = parseInt(cfgBooking?.nilai || "24", 10);
      const tenggat = new Date(Date.now() + bookingJam * 60 * 60 * 1000).toISOString();
      const randSuffix = Math.floor(1000 + Math.random() * 9000);
      const kodeBooking = `BKG-${new Date().getFullYear()}${randSuffix}`;

      await trx`
        UPDATE reservasi
        SET jenis = 'booking', status = 'siap_diambil', eksemplar_id = ${pinjaman.eksemplar_id},
            kode_booking = ${kodeBooking}, waktu_tenggat = ${tenggat}, posisi_antrean = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${antreanDepan.id};
      `;

      // Geser nomor antrean yang tersisa
      await trx`
        UPDATE reservasi
        SET posisi_antrean = posisi_antrean - 1
        WHERE buku_id = ${pinjaman.buku_id} AND jenis = 'antre' AND status = 'menunggu';
      `;

      // Eksemplar diberi status 'dibooking'
      await trx`
        UPDATE eksemplar
        SET status = 'dibooking', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${pinjaman.eksemplar_id};
      `;
      antreanDinaikkan = true;
    } else {
      // Tidak ada antrean, eksemplar kembali 'tersedia'
      await trx`
        UPDATE eksemplar
        SET status = 'tersedia', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${pinjaman.eksemplar_id};
      `;
    }

    return {
      pinjaman_id: pinjaman.id,
      hari_terlambat: hariTerlambat,
      denda_nominal: dendaNominal,
      denda_id: dendaId,
      antrean_berikutnya_dinaikkan: antreanDinaikkan,
    };
  });
}
