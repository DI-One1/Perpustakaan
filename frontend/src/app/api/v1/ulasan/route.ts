import { NextRequest, NextResponse } from "next/server";
import { MOCK_REVIEWS, type MockReview } from "@/mocks";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bukuId = searchParams.get("buku_id");

    let reviews = MOCK_REVIEWS;
    if (bukuId) {
      reviews = reviews.filter((r) => r.buku_id === bukuId);
    }

    return NextResponse.json({
      total: reviews.length,
      data: reviews,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memuat daftar ulasan.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buku_id, rating, isi, pengguna_nama } = body;

    if (!buku_id || !isi || !rating) {
      return NextResponse.json(
        { error: "Data ulasan tidak lengkap: buku_id, rating, dan isi wajib diisi." },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating harus berupa angka antara 1 sampai 5." },
        { status: 400 }
      );
    }

    const newReview: MockReview = {
      id: `rev-${Date.now()}`,
      buku_id,
      pengguna_id: "usr-current",
      pengguna_nama: pengguna_nama || "Warga SMK TI Bazma",
      pengguna_avatar: "/images/avatars/.png",
      rating: ratingNum,
      tanggal: "Hari ini, 20 November 2026",
      isi: String(isi).trim(),
      foto_url: null,
      berguna_count: 0,
      user_voted: null,
    };

    return NextResponse.json(
      {
        message: "Ulasan berhasil dikirimkan.",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan ulasan.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
