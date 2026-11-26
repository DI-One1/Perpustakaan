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
  const p = sesi.pengguna;

  if (p.status_blokir === "blokir_permanen" || (p.status_blokir === "blokir_sementara" && p.blokir_hingga && p.blokir_hingga > new Date())) {
    return problemResponse(403, "AKUN_TERBLOKIR", "Akun Terblokir", "Akun Anda sedang diblokir.");
  }

  const dendaAktif = await prisma.denda.count({
    where: { pengguna_id: p.id, status: "belum_lunas", nominal: { gt: 0 } },
  });
  if (dendaAktif > 0) {
    return problemResponse(403, "DENDA_BELUM_LUNAS", "Denda Belum Lunas", "Lunasi denda terlebih dahulu sebelum masuk antrean.");
  }

  const [pinjamAktif, resAktif] = await Promise.all([
    prisma.pinjaman.count({ where: { pengguna_id: p.id, status: { in: ["aktif", "terlambat"] } } }),
    prisma.reservasi.count({ where: { pengguna_id: p.id, status: { in: ["siap_diambil", "menunggu"] } } }),
  ]);
  if (pinjamAktif + resAktif >= 1) {
    return problemResponse(409, "KUOTA_PINJAM_PENUH", "Kuota Peminjaman Penuh", "Anda sudah memiliki 1 buku aktif, pengajuan, atau antrean berjalan.");
  }

  const tersedia = await prisma.eksemplar.count({
    where: { buku_id, status: "tersedia", deleted_at: null },
  });
  if (tersedia > 0) {
    return problemResponse(409, "STOK_MASIH_TERSEDIA", "Stok Masih Tersedia", "Eksemplar tersedia! Silakan klik Ajukan Peminjaman.");
  }

  const totalLayak = await prisma.eksemplar.count({
    where: { buku_id, status: { in: ["tersedia", "direservasi", "dipinjam"] }, deleted_at: null },
  });
  const maksAntrean = totalLayak <= 5 ? 3 : 5;
  const antreanAktif = await prisma.reservasi.count({
    where: { buku_id, jenis: "antre", status: "menunggu" },
  });

  if (antreanAktif >= maksAntrean) {
    return problemResponse(409, "ANTREAN_PENUH", "Antrean Penuh", `Kapasitas antrean maksimal (${maksAntrean} orang) sudah penuh.`);
  }

  const kode_reservasi = `ANT-${Math.floor(1000 + Math.random() * 9000)}`;
  const antrean = await prisma.reservasi.create({
    data: {
      kode_reservasi,
      pengguna_id: p.id,
      buku_id,
      jenis: "antre",
      status: "menunggu",
    },
    include: { buku: true },
  });

  return NextResponse.json({ reservasi: antrean, urutan: antreanAktif + 1 }, { status: 201 });
}
