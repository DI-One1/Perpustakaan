import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const kategoriSlug = searchParams.get("kategori")?.trim() ?? "";

  const kategori = await prisma.kategori.findMany({ orderBy: { nama: "asc" } });

  const buku = await prisma.buku.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { judul: { contains: q, mode: "insensitive" } },
                { penulis: { contains: q, mode: "insensitive" } },
                { isbn: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        kategoriSlug ? { kategori: { slug: kategoriSlug } } : {},
      ],
    },
    include: {
      kategori: true,
      eksemplar: { where: { deleted_at: null } },
      ulasan: { select: { rating: true } },
    },
    orderBy: { created_at: "desc" },
  });

  const data = buku.map((b) => {
    const tersedia = b.eksemplar.filter((e) => e.status === "tersedia").length;
    const direservasi = b.eksemplar.filter((e) => e.status === "direservasi").length;
    const dipinjam = b.eksemplar.filter((e) => e.status === "dipinjam").length;
    const total = b.eksemplar.length;
    const ratingRata =
      b.ulasan.length > 0
        ? Number((b.ulasan.reduce((acc, u) => acc + u.rating, 0) / b.ulasan.length).toFixed(1))
        : 0;

    return {
      id: b.id,
      judul: b.judul,
      penulis: b.penulis,
      penerbit: b.penerbit,
      tahun_terbit: b.tahun_terbit,
      isbn: b.isbn,
      sinopsis: b.sinopsis,
      cover_url: b.cover_url,
      kategori: b.kategori,
      stok_tersedia: tersedia,
      stok_direservasi: direservasi,
      stok_dipinjam: dipinjam,
      total_eksemplar: total,
      rating_rata_rata: ratingRata,
      jumlah_ulasan: b.ulasan.length,
    };
  });

  return NextResponse.json({ buku: data, kategori });
}
