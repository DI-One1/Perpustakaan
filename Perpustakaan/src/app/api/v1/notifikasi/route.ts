import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function PATCH() {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  await prisma.notifikasi.updateMany({
    where: { pengguna_id: sesi.pengguna_id, sudah_dibaca: false },
    data: { sudah_dibaca: true },
  });

  return NextResponse.json({ berhasil: true });
}
