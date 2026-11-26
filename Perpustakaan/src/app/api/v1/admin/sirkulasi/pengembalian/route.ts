import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";
import { promosikanAntreanFIFO } from "@/lib/fifo";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Hanya Admin yang dapat memproses pengembalian.");
  }

  const { kode_barcode, kondisi_kembali } = await req.json();
  const kondisi = (kondisi_kembali ?? "baik") as "baik" | "rusak" | "hilang";

  const eksemplar = await prisma.eksemplar.findUnique({
    where: { kode_barcode: String(kode_barcode ?? "").trim().toUpperCase() },
    include: { buku: true },
  });

  if (!eksemplar) {
    return problemResponse(404, "EKSEMPLAR_TIDAK_DITEMUKAN", "Barcode Tidak Ditemukan", "Kode barcode eksemplar tidak terdaftar.");
  }

  const pinjaman = await prisma.pinjaman.findFirst({
    where: { eksemplar_id: eksemplar.id, status: { in: ["aktif", "terlambat"] } },
    include: { pengguna: true },
  });

  if (!pinjaman) {
    return problemResponse(404, "PINJAMAN_TIDAK_DITEMUKAN", "Tidak Sedang Dipinjam", `Eksemplar ${eksemplar.kode_barcode} tidak memiliki pinjaman aktif.`);
  }

  const now = new Date();
  const diffMs = now.getTime() - pinjaman.tanggal_jatuh_tempo.getTime();
  const selisihHari = diffMs > 0 ? Math.ceil(diffMs / 86400000) : 0;
  const nominalDenda = selisihHari * 500;

  const hasil = await prisma.$transaction(async (tx) => {
    await tx.pinjaman.update({
      where: { id: pinjaman.id },
      data: { status: "selesai", tanggal_kembali: now },
    });

    let denda = null;
    if (nominalDenda > 0) {
      denda = await tx.denda.create({
        data: {
          pengguna_id: pinjaman.pengguna_id,
          pinjaman_id: pinjaman.id,
          jumlah_hari_terlambat: selisihHari,
          nominal: nominalDenda,
          status: "belum_lunas",
        },
      });
    }

    let dipromosikan = null;
    if (kondisi === "baik") {
      dipromosikan = await promosikanAntreanFIFO(tx, eksemplar.buku_id, eksemplar.id);
    } else {
      await tx.eksemplar.update({
        where: { id: eksemplar.id },
        data: { status: kondisi },
      });
    }

    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: "PENGEMBALIAN_BUKU",
      pesan_commit: `Pengembalian ${eksemplar.kode_barcode} dari ${pinjaman.pengguna.nama_lengkap} (kondisi: ${kondisi}, denda: Rp${nominalDenda}).`,
      tabel: "pinjaman",
      entitas_id: pinjaman.id,
      data_lama: { status: pinjaman.status },
      data_baru: { status: "selesai", kondisi, nominal_denda: nominalDenda },
    });

    return { denda, dipromosikan };
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({
    berhasil: true,
    selisih_hari: selisihHari,
    nominal_denda: nominalDenda,
    antrean_dipromosikan: Boolean(hasil.dipromosikan),
  });
}
