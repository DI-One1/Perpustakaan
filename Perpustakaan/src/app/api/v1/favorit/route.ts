import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const { buku_id } = await req.json();
  const existing = await prisma.favorit.findUnique({
    where: { pengguna_id_buku_id: { pengguna_id: sesi.pengguna_id, buku_id } },
  });

  if (existing) {
    await prisma.favorit.delete({ where: { id: existing.id } });
    return NextResponse.json({ is_favorit: false });
  }

  await prisma.favorit.create({
    data: { pengguna_id: sesi.pengguna_id, buku_id },
  });
  return NextResponse.json({ is_favorit: true });
}
