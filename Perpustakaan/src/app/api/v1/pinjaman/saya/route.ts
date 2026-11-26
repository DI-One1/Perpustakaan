import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function GET() {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const uid = sesi.pengguna_id;

  const [reservasi, pinjaman, denda, favorit, notifikasi] = await Promise.all([
    prisma.reservasi.findMany({
      where: { pengguna_id: uid },
      include: { buku: true, eksemplar: true },
      orderBy: { created_at: "desc" },
    }),
    prisma.pinjaman.findMany({
      where: { pengguna_id: uid },
      include: {
        eksemplar: { include: { buku: true } },
        perpanjangan: { orderBy: { created_at: "desc" } },
      },
      orderBy: { tanggal_pinjam: "desc" },
    }),
    prisma.denda.findMany({
      where: { pengguna_id: uid },
      include: { pinjaman: { include: { eksemplar: { include: { buku: true } } } } },
      orderBy: { created_at: "desc" },
    }),
    prisma.favorit.findMany({
      where: { pengguna_id: uid },
      include: { buku: { include: { kategori: true, eksemplar: true } } },
      orderBy: { created_at: "desc" },
    }),
    prisma.notifikasi.findMany({
      where: { pengguna_id: uid },
      orderBy: { created_at: "desc" },
      take: 25,
    }),
  ]);

  return NextResponse.json({ reservasi, pinjaman, denda, favorit, notifikasi });
}
