// SEMENTARA: Route Handler ini menyediakan endpoint pencarian katalog
// Akan digantikan oleh backend permanen Laravel / .NET

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/server/db";
import { createProblemResponse } from "@/server/problem";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const kategori = searchParams.get("kategori") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") || "20", 10)));
    const offset = (page - 1) * perPage;

    // Filter query SQL dinamis
    const books = await sql`
      SELECT 
        b.id,
        b.judul,
        b.penulis,
        b.isbn,
        b.nomor_panggil,
        k.nama as kategori_nama,
        b.cover_path,
        b.total_eksemplar,
        COUNT(CASE WHEN e.status = 'tersedia' THEN 1 END)::int as eksemplar_tersedia,
        COUNT(CASE WHEN e.status = 'dibooking' THEN 1 END)::int as eksemplar_dibooking,
        (SELECT COUNT(*)::int FROM reservasi r WHERE r.buku_id = b.id AND r.jenis = 'antre' AND r.status = 'menunggu') as jumlah_antrean
      FROM buku b
      JOIN kategori k ON k.id = b.kategori_id
      LEFT JOIN eksemplar e ON e.buku_id = b.id
      WHERE 1=1
        ${q ? sql`AND (b.judul ILIKE ${"%" + q + "%"} OR b.penulis ILIKE ${"%" + q + "%"} OR b.isbn ILIKE ${"%" + q + "%"})` : sql``}
        ${kategori && kategori !== "semua" ? sql`AND k.slug = ${kategori}` : sql``}
      GROUP BY b.id, k.nama
      ORDER BY b.created_at DESC
      LIMIT ${perPage} OFFSET ${offset};
    `;

    const mapped = books.map((b) => ({
      id: b.id,
      judul: b.judul,
      penulis: b.penulis,
      isbn: b.isbn,
      nomor_panggil: b.nomor_panggil,
      kategori_nama: b.kategori_nama,
      cover_url: b.cover_path ? `/images/${b.cover_path}` : null,
      total_eksemplar: b.total_eksemplar,
      eksemplar_tersedia: b.eksemplar_tersedia,
      eksemplar_dibooking: b.eksemplar_dibooking,
      jumlah_antrean: b.jumlah_antrean,
      maks_antrean: b.total_eksemplar <= 5 ? 3 : 5,
    }));

    return NextResponse.json({
      total: mapped.length,
      page,
      per_page: perPage,
      data: mapped,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal saat memuat katalog.";
    return createProblemResponse({
      type: "https://bilik.smktibazma.sch.id/problems/server-error",
      title: "Kesalahan Server",
      status: 500,
      code: "VALIDATION_ERROR",
      detail: errorMsg,
    });
  }
}
