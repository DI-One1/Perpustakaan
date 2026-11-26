import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sesi = await ambilSesiAktif();

  const buku = await prisma.buku.findUnique({
    where: { id },
    include: {
      kategori: true,
      eksemplar: { where: { deleted_at: null }, orderBy: { kode_barcode: "asc" } },
      ulasan: {
        include: { pengguna: { select: { nama_lengkap: true, kelas_atau_jabatan: true } } },
        orderBy: { created_at: "desc" },
      },
      reservasi: {
        where: { jenis: "antre", status: "menunggu" },
        orderBy: { created_at: "asc" },
      },
    },
  });

  if (!buku) {
    return problemResponse(404, "BUKU_TIDAK_DITEMUKAN", "Buku Tidak Ditemukan", "Judul buku tidak tersedia.");
  }

  const isFavorit = sesi
    ? Boolean(
        await prisma.favorit.findUnique({
          where: { pengguna_id_buku_id: { pengguna_id: sesi.pengguna_id, buku_id: id } },
        })
      )
    : false;

  const tersedia = buku.eksemplar.filter((e) => e.status === "tersedia").length;
  const layak = buku.eksemplar.filter((e) => ["tersedia", "direservasi", "dipinjam"].includes(e.status)).length;
  const maksAntrean = layak <= 5 ? 3 : 5;

  return NextResponse.json({
    buku: {
      ...buku,
      stok_tersedia: tersedia,
      jumlah_antrean: buku.reservasi.length,
      maks_antrean: maksAntrean,
      is_favorit: isFavorit,
    },
  });
}
