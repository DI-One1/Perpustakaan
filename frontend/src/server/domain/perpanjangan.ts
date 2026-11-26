import { sql } from "@/server/db";
import { DomainError } from "@/server/problem";

export interface AjuanPerpanjanganParams {
  pinjaman_id: string;
  pengguna_id: string;
  alasan: string;
  durasi_hari_diminta?: number;
}

export interface ProsesPerpanjanganParams {
  ajuan_id: string;
  status: "disetujui" | "ditolak";
  durasi_hari_disetujui?: number;
  catatan_petugas?: string;
  petugas_id: string;
}

/**
 * 1. WARGA MENGAJUKAN PERPANJANGAN PINJAMAN ONLINE
 * Aturan Bisnis:
 * - Alasan wajib diisi
 * - Tidak boleh sedang memiliki denda aktif
 * - Tidak boleh sedang dalam status 'terlambat'
 */
export async function ajukanPerpanjangan(
  params: AjuanPerpanjanganParams
): Promise<{ ajuan_id: string; status: string }> {
  const { pinjaman_id, pengguna_id, alasan, durasi_hari_diminta = 7 } = params;

  if (!alasan || alasan.trim().length < 5) {
    throw new DomainError({
      type: "https://bilik.smktibazma.sch.id/problems/alasan-wajib",
      title: "Alasan Perpanjangan Wajib Diisi",
      status: 422,
      code: "VALIDATION_ERROR",
      detail: "Mohon sertakan alasan yang jelas mengapa Anda membutuhkan perpanjangan pinjaman (minimal 5 karakter).",
    });
  }

  return await sql.begin(async (trx) => {
    // 1. Cek pinjaman aktif milik warga ini
    const [pinjaman] = await trx`
      SELECT id, status, tanggal_jatuh_tempo
      FROM pinjaman
      WHERE id = ${pinjaman_id} AND pengguna_id = ${pengguna_id}
      LIMIT 1
      FOR UPDATE;
    `;

    if (!pinjaman) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/pinjaman-tidak-ditemukan",
        title: "Pinjaman Tidak Ditemukan",
        status: 404,
        code: "NOT_FOUND",
        detail: "Data pinjaman tidak ditemukan atau bukan milik Anda.",
      });
    }

    if (pinjaman.status === "terlambat") {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/pinjaman-terlambat",
        title: "Tidak Dapat Memperpanjang Pinjaman Terlambat",
        status: 409,
        code: "DENDA_AKTIF",
        detail: "Buku yang sudah melewati tanggal jatuh tempo tidak dapat diperpanjang secara online. Harap bawa buku ke meja pustakawan.",
      });
    }

    // 2. Cek apakah ada denda aktif lain yang belum lunas
    const [denda] = await trx`
      SELECT id FROM denda WHERE pengguna_id = ${pengguna_id} AND status = 'belum_lunas' LIMIT 1;
    `;
    if (denda) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/denda-aktif",
        title: "Perpanjangan Ditolak Karena Denda",
        status: 409,
        code: "DENDA_AKTIF",
        detail: "Anda memiliki denda yang belum dilunasi. Pelunasan denda wajib diselesaikan terlebih dahulu.",
      });
    }

    // 3. Masukkan ajuan perpanjangan
    const [ajuan] = await trx`
      INSERT INTO ajuan_perpanjangan (
        pinjaman_id, pengguna_id, alasan, durasi_hari_diminta, status
      )
      VALUES (
        ${pinjaman_id}, ${pengguna_id}, ${alasan.trim()}, ${durasi_hari_diminta}, 'menunggu'
      )
      RETURNING id;
    `;

    return {
      ajuan_id: ajuan.id,
      status: "menunggu",
    };
  });
}

/**
 * 2. PUSTAKAWAN MEMPROSES AJUAN PERPANJANGAN DI MEJA SIRKULASI
 * Pustakawan dapat menyesuaikan durasi hari yang disetujui (default 7 hari via stepper -/+)
 */
export async function prosesPerpanjangan(
  params: ProsesPerpanjanganParams
): Promise<{ sukses: boolean; tanggal_jatuh_tempo_baru?: string }> {
  const { ajuan_id, status, durasi_hari_disetujui = 7, catatan_petugas, petugas_id } = params;

  return await sql.begin(async (trx) => {
    const [ajuan] = await trx`
      SELECT a.id, a.pinjaman_id, p.tanggal_jatuh_tempo
      FROM ajuan_perpanjangan a
      JOIN pinjaman p ON p.id = a.pinjaman_id
      WHERE a.id = ${ajuan_id} AND a.status = 'menunggu'
      LIMIT 1
      FOR UPDATE;
    `;

    if (!ajuan) {
      throw new DomainError({
        type: "https://bilik.smktibazma.sch.id/problems/ajuan-tidak-ditemukan",
        title: "Ajuan Tidak Ditemukan",
        status: 404,
        code: "NOT_FOUND",
        detail: "Ajuan perpanjangan tidak ditemukan atau sudah pernah diproses.",
      });
    }

    let tglJatuhTempoBaru: string | undefined;

    if (status === "disetujui") {
      // Perpanjang tanggal jatuh tempo dari tanggal jatuh tempo sebelumnya + durasi disetujui
      const [calcNewDate] = await trx`
        SELECT (${ajuan.tanggal_jatuh_tempo}::date + ${durasi_hari_disetujui} * INTERVAL '1 day')::date as tgl_baru;
      `;
      tglJatuhTempoBaru = calcNewDate.tgl_baru;

      // Update tanggal jatuh tempo pinjaman
      await trx`
        UPDATE pinjaman
        SET tanggal_jatuh_tempo = ${tglJatuhTempoBaru!}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${ajuan.pinjaman_id};
      `;
    }

    // Update status ajuan
    await trx`
      UPDATE ajuan_perpanjangan
      SET status = ${status}, durasi_hari_disetujui = ${status === "disetujui" ? durasi_hari_disetujui : null},
          catatan_petugas = ${catatan_petugas || null}, diproses_oleh = ${petugas_id},
          diproses_pada = CURRENT_TIMESTAMP
      WHERE id = ${ajuan.id};
    `;

    return {
      sukses: true,
      tanggal_jatuh_tempo_baru: tglJatuhTempoBaru,
    };
  });
}
