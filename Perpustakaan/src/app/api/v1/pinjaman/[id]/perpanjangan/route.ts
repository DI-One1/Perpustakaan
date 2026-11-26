import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const { durasi_hari_diminta, alasan } = await req.json();
  const hari = Number(durasi_hari_diminta);
  if (!hari || hari < 1 || hari > 14 || !String(alasan ?? "").trim()) {
    return problemResponse(400, "INPUT_TIDAK_VALID", "Input Tidak Valid", "Jumlah hari (1-14) dan alasan wajib diisi.");
  }

  const pinjaman = await prisma.pinjaman.findUnique({
    where: { id },
    include: { eksemplar: { include: { buku: true } } },
  });

  if (!pinjaman || pinjaman.pengguna_id !== sesi.pengguna_id) {
    return problemResponse(404, "PINJAMAN_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Data pinjaman tidak ditemukan.");
  }
  if (pinjaman.status !== "aktif") {
    return problemResponse(409, "PINJAMAN_TIDAK_AKTIF", "Tidak Dapat Diperpanjang", "Hanya pinjaman aktif (belum terlambat) yang dapat diajukan perpanjangan.");
  }

  const dendaAktif = await prisma.denda.count({
    where: { pengguna_id: sesi.pengguna_id, status: "belum_lunas", nominal: { gt: 0 } },
  });
  if (dendaAktif > 0) {
    return problemResponse(403, "DENDA_BELUM_LUNAS", "Denda Belum Lunas", "Bebas denda mutlak diperlukan untuk mengajukan perpanjangan.");
  }

  const sudahMenunggu = await prisma.ajuanPerpanjangan.count({
    where: { pinjaman_id: id, status: "menunggu" },
  });
  if (sudahMenunggu > 0) {
    return problemResponse(409, "AJUAN_SUDAH_ADA", "Ajuan Masih Menunggu", "Anda sudah memiliki ajuan perpanjangan yang sedang diproses Admin.");
  }

  const ajuan = await prisma.$transaction(async (tx) => {
    const created = await tx.ajuanPerpanjangan.create({
      data: {
        pinjaman_id: id,
        pengguna_id: sesi.pengguna_id,
        durasi_hari_diminta: hari,
        alasan: String(alasan).trim(),
      },
    });

    const admins = await tx.pengguna.findMany({
      where: { peran: { has: "admin" }, deleted_at: null },
      select: { id: true },
    });
    if (admins.length > 0) {
      await tx.notifikasi.createMany({
        data: admins.map((a) => ({
          pengguna_id: a.id,
          target_peran: "admin",
          judul: "Ajuan Perpanjangan Baru",
          pesan: `${sesi.pengguna.nama_lengkap} mengajukan perpanjangan ${hari} hari untuk "${pinjaman.eksemplar.buku.judul}".`,
          tautan: "/admin",
        })),
      });
    }

    return created;
  });

  return NextResponse.json({ ajuan }, { status: 201 });
}
