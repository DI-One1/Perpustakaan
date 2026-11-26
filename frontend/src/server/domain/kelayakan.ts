import { sql } from "@/server/db";
import { DomainError } from "@/server/problem";
import type postgres from "postgres";

export type DatabaseExecutor = postgres.Sql<Record<string, unknown>> | postgres.TransactionSql<Record<string, unknown>>;

export interface StatusKelayakanWarga {
  is_eligible: boolean;
  alasan_penolakan: string | null;
  kode_alasan: string | null;
  has_active_loan: boolean;
  has_active_reservation: boolean;
  has_active_fine: boolean;
  is_blocked: boolean;
  total_denda: number;
}

export async function cekKelayakanWarga(
  penggunaId: string,
  tx: DatabaseExecutor = sql
): Promise<StatusKelayakanWarga> {
  // 1. Ambil data profil warga
  const [pengguna] = await tx`
    SELECT id, nama, peran, is_blocked, blocked_until, blocked_count
    FROM pengguna
    WHERE id = ${penggunaId}
    LIMIT 1;
  `;

  if (!pengguna) {
    throw new DomainError({
      type: "https://bilik.smktibazma.sch.id/problems/pengguna-tidak-ditemukan",
      title: "Pengguna Tidak Ditemukan",
      status: 404,
      code: "NOT_FOUND",
      detail: `Data pengguna dengan ID ${penggunaId} tidak terdaftar di sistem.`,
    });
  }

  // Cek masa blokir sementara
  let isBlocked = pengguna.is_blocked;
  if (isBlocked && pengguna.blocked_until) {
    const now = new Date();
    const blockedUntil = new Date(pengguna.blocked_until);
    // Jika masa hukuman 7 hari sudah lewat, sistem otomatis menganggap blokir selesai
    if (now > blockedUntil && pengguna.blocked_count < 3) {
      isBlocked = false;
    }
  }

  // 2. Cek Pinjaman Aktif (status: 'aktif' atau 'terlambat')
  const [pinjamanAktif] = await tx`
    SELECT id, tanggal_jatuh_tempo
    FROM pinjaman
    WHERE pengguna_id = ${penggunaId} AND status IN ('aktif', 'terlambat')
    LIMIT 1;
  `;

  // 3. Cek Reservasi Aktif (status: 'menunggu' atau 'siap_diambil')
  const [reservasiAktif] = await tx`
    SELECT id, jenis, status, waktu_tenggat
    FROM reservasi
    WHERE pengguna_id = ${penggunaId} AND status IN ('menunggu', 'siap_diambil')
    LIMIT 1;
  `;

  // 4. Cek Denda Belum Lunas
  const dendaRows = await tx`
    SELECT COALESCE(SUM(total_nominal), 0)::int as total
    FROM denda
    WHERE pengguna_id = ${penggunaId} AND status = 'belum_lunas';
  `;
  const totalDenda = dendaRows[0]?.total || 0;

  const hasActiveLoan = Boolean(pinjamanAktif);
  const hasActiveReservation = Boolean(reservasiAktif);
  const hasActiveFine = totalDenda > 0;

  // Evaluasi Kelayakan & Prioritas Alasan Penolakan
  let alasanPenolakan: string | null = null;
  let kodeAlasan: string | null = null;

  if (isBlocked) {
    if (pengguna.blocked_count >= 3) {
      alasanPenolakan =
        "Akun Anda diblokir permanen oleh sistem karena 3 kali akumulasi pelanggaran. Hubungi Admin untuk pembukaan blokir.";
      kodeAlasan = "DIBLOKIR_PERMANEN";
    } else {
      alasanPenolakan =
        "Akun Anda sedang dalam masa pemblokiran sementara (7 hari) karena tidak mengambil buku booking 3 kali.";
      kodeAlasan = "DIBLOKIR_SEMENTARA";
    }
  } else if (hasActiveFine) {
    alasanPenolakan = `Anda memiliki tagihan denda belum lunas sebesar Rp${totalDenda.toLocaleString(
      "id-ID"
    )}. Harap selesaikan pelunasan di meja pustakawan terlebih dahulu.`;
    kodeAlasan = "DENDA_AKTIF";
  } else if (hasActiveLoan) {
    alasanPenolakan =
      "Anda masih memiliki 1 pinjaman buku aktif. Harap kembalikan buku terlebih dahulu sebelum meminjam atau booking buku lain.";
    kodeAlasan = "PINJAMAN_AKTIF";
  } else if (hasActiveReservation) {
    alasanPenolakan =
      "Anda sudah memiliki 1 antrean atau booking aktif. Selesaikan atau batalkan reservasi sebelumnya terlebih dahulu.";
    kodeAlasan = "RESERVASI_AKTIF";
  }

  return {
    is_eligible: !alasanPenolakan,
    alasan_penolakan: alasanPenolakan,
    kode_alasan: kodeAlasan,
    has_active_loan: hasActiveLoan,
    has_active_reservation: hasActiveReservation,
    has_active_fine: hasActiveFine,
    is_blocked: isBlocked,
    total_denda: totalDenda,
  };
}
