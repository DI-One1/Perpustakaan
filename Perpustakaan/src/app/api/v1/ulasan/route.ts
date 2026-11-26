import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const { buku_id, rating, komentar } = await req.json();
  const r = Number(rating);
  if (!buku_id || r < 1 || r > 5 || !String(komentar ?? "").trim()) {
    return problemResponse(400, "INPUT_TIDAK_VALID", "Input Tidak Valid", "Rating (1-5) dan ulasan wajib diisi.");
  }

  const ulasan = await prisma.ulasan.upsert({
    where: { pengguna_id_buku_id: { pengguna_id: sesi.pengguna_id, buku_id } },
    update: { rating: r, komentar: String(komentar).trim() },
    create: {
      pengguna_id: sesi.pengguna_id,
      buku_id,
      rating: r,
      komentar: String(komentar).trim(),
    },
    include: { pengguna: { select: { nama_lengkap: true, kelas_atau_jabatan: true } } },
  });

  return NextResponse.json({ ulasan });
}
