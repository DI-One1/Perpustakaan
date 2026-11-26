import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { promosikanAntreanFIFO } from "@/lib/fifo";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const res = await prisma.reservasi.findUnique({ where: { id } });
  if (!res || res.pengguna_id !== sesi.pengguna_id) {
    return problemResponse(404, "RESERVASI_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Pengajuan atau antrean tidak ditemukan.");
  }

  if (!["siap_diambil", "menunggu"].includes(res.status)) {
    return problemResponse(409, "STATUS_TIDAK_VALID", "Tidak Dapat Dibatalkan", "Status pengajuan sudah tidak aktif.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.reservasi.update({
      where: { id },
      data: { status: "batal", alasan_batal: "batal_warga" },
    });

    if (res.status === "siap_diambil" && res.eksemplar_id) {
      await promosikanAntreanFIFO(tx, res.buku_id, res.eksemplar_id);
    }
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ berhasil: true });
}
