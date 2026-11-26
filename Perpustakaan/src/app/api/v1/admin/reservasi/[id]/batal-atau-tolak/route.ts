import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";
import { promosikanAntreanFIFO } from "@/lib/fifo";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { aksi, alasan_kode, pesan_commit } = await req.json();
  if (!String(pesan_commit ?? "").trim()) {
    return problemResponse(422, "PESAN_COMMIT_WAJIB", "Pesan Commit Wajib", "Sertakan pesan commit alasan pembatalan/penolakan.");
  }

  const res = await prisma.reservasi.findUnique({ where: { id }, include: { buku: true } });
  if (!res) {
    return problemResponse(404, "RESERVASI_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Reservasi tidak ditemukan.");
  }

  await prisma.$transaction(async (tx) => {
    const statusBaru = aksi === "ditolak" ? "ditolak" : "batal";
    await tx.reservasi.update({
      where: { id },
      data: { status: statusBaru, alasan_batal: String(alasan_kode ?? "lainnya") },
    });

    if (res.eksemplar_id) {
      if (alasan_kode === "rusak") {
        await tx.eksemplar.update({
          where: { id: res.eksemplar_id },
          data: { status: "rusak" },
        });
      } else {
        await promosikanAntreanFIFO(tx, res.buku_id, res.eksemplar_id);
      }
    }

    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: statusBaru === "ditolak" ? "TOLAK_PENGAJUAN" : "BATAL_PENGAJUAN_ADMIN",
      pesan_commit: String(pesan_commit).trim(),
      tabel: "reservasi",
      entitas_id: id,
      data_lama: { status: res.status },
      data_baru: { status: statusBaru, alasan_kode },
    });

    await tx.notifikasi.create({
      data: {
        pengguna_id: res.pengguna_id,
        target_peran: "warga",
        judul: statusBaru === "ditolak" ? "Pengajuan Ditolak" : "Pengajuan Dibatalkan Admin",
        pesan: `Pengajuan ${res.kode_reservasi} (${res.buku.judul}): ${String(pesan_commit).trim()}`,
        tautan: "/antrean",
      },
    });
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ berhasil: true });
}
