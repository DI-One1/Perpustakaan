import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { judul, penulis, penerbit, tahun_terbit, isbn, sinopsis, cover_url, kategori_id, jumlah_eksemplar } =
    await req.json();

  if (!judul || !penulis || !isbn || !kategori_id) {
    return problemResponse(400, "INPUT_TIDAK_LENGKAP", "Input Tidak Lengkap", "Judul, penulis, ISBN, dan kategori wajib diisi.");
  }

  const jumlah = Math.max(1, Math.min(20, Number(jumlah_eksemplar ?? 1)));

  const buku = await prisma.$transaction(async (tx) => {
    const created = await tx.buku.create({
      data: {
        judul,
        penulis,
        penerbit: penerbit || "Penerbit Umum",
        tahun_terbit: Number(tahun_terbit || 2025),
        isbn,
        sinopsis: sinopsis || "Koleksi perpustakaan SMK TI BAZMA.",
        cover_url: cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
        kategori_id,
      },
    });

    const totalEks = await tx.eksemplar.count();
    const barcodes = Array.from({ length: jumlah }, (_, i) => ({
      buku_id: created.id,
      kode_barcode: `BK-${String(totalEks + i + 1).padStart(4, "0")}`,
      lokasi_rak: "Rak Baru",
    }));

    await tx.eksemplar.createMany({ data: barcodes });

    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: "TAMBAH_BUKU",
      pesan_commit: `Menambahkan judul "${judul}" beserta ${jumlah} eksemplar baru.`,
      tabel: "buku",
      entitas_id: created.id,
      data_baru: { judul, jumlah_eksemplar: jumlah },
    });

    return created;
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ buku }, { status: 201 });
}
