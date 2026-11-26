import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { status, pesan_commit } = await req.json();
  const statusTarget = status === "dibebaskan" ? "dibebaskan" : "lunas";

  const denda = await prisma.denda.findUnique({ where: { id } });
  if (!denda || denda.status !== "belum_lunas") {
    return problemResponse(404, "DENDA_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Denda aktif tidak ditemukan.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.denda.update({
      where: { id },
      data: { status: statusTarget, dilunasi_pada: new Date() },
    });

    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: statusTarget === "dibebaskan" ? "BEBASKAN_DENDA" : "LUNASI_DENDA",
      pesan_commit: String(pesan_commit ?? "Pelunasan tunai di meja Admin").trim(),
      tabel: "denda",
      entitas_id: id,
      data_lama: { status: "belum_lunas", nominal: denda.nominal },
      data_baru: { status: statusTarget },
    });
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ berhasil: true });
}
