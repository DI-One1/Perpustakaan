import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Hanya Admin yang dapat mengonfirmasi peminjaman.");
  }

  const { nomor_induk, kode_barcode, durasi_hari } = await req.json();
  const durasi = Math.max(1, Math.min(30, Number(durasi_hari ?? 7)));

  const warga = await prisma.pengguna.findUnique({
    where: { nomor_induk: String(nomor_induk ?? "").trim() },
  });
  if (!warga || warga.deleted_at) {
    return problemResponse(404, "WARGA_TIDAK_DITEMUKAN", "Anggota Tidak Ditemukan", "Nomor induk anggota tidak terdaftar.");
  }

  const eksemplar = await prisma.eksemplar.findUnique({
    where: { kode_barcode: String(kode_barcode ?? "").trim().toUpperCase() },
    include: { buku: true },
  });
  if (!eksemplar || eksemplar.deleted_at) {
    return problemResponse(404, "EKSEMPLAR_TIDAK_DITEMUKAN", "Barcode Tidak Ditemukan", "Kode barcode eksemplar tidak terdaftar.");
  }

  if (eksemplar.status === "dipinjam" || eksemplar.status === "rusak" || eksemplar.status === "hilang") {
    return problemResponse(409, "EKSEMPLAR_TIDAK_LAYAK", "Eksemplar Tidak Tersedia", `Eksemplar ${eksemplar.kode_barcode} sedang berstatus ${eksemplar.status}.`);
  }

  // Proteksi Tabrakan Eksemplar
  if (eksemplar.status === "direservasi") {
    const resPemilik = await prisma.reservasi.findFirst({
      where: { eksemplar_id: eksemplar.id, status: "siap_diambil" },
    });

    if (!resPemilik || resPemilik.pengguna_id !== warga.id) {
      return problemResponse(
        409,
        "EKSEMPLAR_DIRESERVASI_ORANG_LAIN",
        "Eksemplar Direservasi Warga Lain",
        "Eksemplar buku tidak dapat dipinjam. Buku ini sedang dialokasikan untuk pengajuan peminjaman warga lain. Silakan pilih eksemplar buku lain yang tersedia."
      );
    }

    // Klaim Pengajuan Online
    const pinjaman = await prisma.$transaction(async (tx) => {
      await tx.reservasi.update({
        where: { id: resPemilik.id },
        data: { status: "selesai" },
      });
      await tx.eksemplar.update({
        where: { id: eksemplar.id },
        data: { status: "dipinjam" },
      });

      const jatuhTempo = new Date(Date.now() + durasi * 86400000);
      const created = await tx.pinjaman.create({
        data: {
          pengguna_id: warga.id,
          eksemplar_id: eksemplar.id,
          reservasi_id: resPemilik.id,
          jalur: "reservasi_online",
          tanggal_jatuh_tempo: jatuhTempo,
          status: "aktif",
          petugas_id: sesi.pengguna_id,
        },
      });

      await catatAuditCommit(tx, {
        pengguna_id: sesi.pengguna_id,
        konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
        aksi: "KONFIRMASI_PINJAM_ONLINE",
        pesan_commit: `Serah terima klaim ${resPemilik.kode_reservasi} (${eksemplar.kode_barcode}) ke ${warga.nama_lengkap} selama ${durasi} hari.`,
        tabel: "pinjaman",
        entitas_id: created.id,
        data_baru: { kode_barcode: eksemplar.kode_barcode, durasi_hari: durasi },
      });

      return created;
    }, { maxWait: 15000, timeout: 30000 });

    return NextResponse.json({ pinjaman, jalur: "reservasi_online" });
  }

  // Jalur Pinjam Langsung Offline (status === 'tersedia')
  if (warga.status_blokir !== "normal") {
    return problemResponse(403, "AKUN_TERBLOKIR", "Anggota Terblokir", "Anggota sedang terkena sanksi blokir.");
  }
  const dendaAktif = await prisma.denda.count({
    where: { pengguna_id: warga.id, status: "belum_lunas", nominal: { gt: 0 } },
  });
  if (dendaAktif > 0) {
    return problemResponse(403, "DENDA_BELUM_LUNAS", "Denda Belum Lunas", "Anggota memiliki denda yang belum dilunasi.");
  }
  const [pAktif, rAktif] = await Promise.all([
    prisma.pinjaman.count({ where: { pengguna_id: warga.id, status: { in: ["aktif", "terlambat"] } } }),
    prisma.reservasi.count({ where: { pengguna_id: warga.id, status: { in: ["siap_diambil", "menunggu"] } } }),
  ]);
  if (pAktif + rAktif >= 1) {
    return problemResponse(409, "KUOTA_PINJAM_PENUH", "Kuota Penuh", "Anggota sudah memiliki 1 buku aktif atau pengajuan berjalan.");
  }

  const pinjaman = await prisma.$transaction(async (tx) => {
    await tx.eksemplar.update({
      where: { id: eksemplar.id },
      data: { status: "dipinjam" },
    });

    const jatuhTempo = new Date(Date.now() + durasi * 86400000);
    const created = await tx.pinjaman.create({
      data: {
        pengguna_id: warga.id,
        eksemplar_id: eksemplar.id,
        jalur: "langsung_offline",
        tanggal_jatuh_tempo: jatuhTempo,
        status: "aktif",
        petugas_id: sesi.pengguna_id,
      },
    });

    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: "KONFIRMASI_PINJAM_LANGSUNG",
      pesan_commit: `Peminjaman langsung ${eksemplar.kode_barcode} ke ${warga.nama_lengkap} selama ${durasi} hari.`,
      tabel: "pinjaman",
      entitas_id: created.id,
      data_baru: { kode_barcode: eksemplar.kode_barcode, durasi_hari: durasi },
    });

    return created;
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ pinjaman, jalur: "langsung_offline" });
}
