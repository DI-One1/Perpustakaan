import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { keputusan, durasi_hari_disetujui, pesan_commit } = await req.json();
  if (!String(pesan_commit ?? "").trim()) {
    return problemResponse(422, "PESAN_COMMIT_WAJIB", "Pesan Commit Wajib", "Sertakan pesan commit.");
  }

  const ajuan = await prisma.ajuanPerpanjangan.findUnique({
    where: { id },
    include: { pinjaman: { include: { eksemplar: { include: { buku: true } } } } },
  });
  if (!ajuan || ajuan.status !== "menunggu") {
    return problemResponse(404, "AJUAN_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Ajuan perpanjangan tidak tersedia.");
  }

  const hari = Math.max(1, Number(durasi_hari_disetujui ?? ajuan.durasi_hari_diminta));

  await prisma.$transaction(async (tx) => {
    if (keputusan === "disetujui") {
      const jatuhTempoBaru = new Date(ajuan.pinjaman.tanggal_jatuh_tempo.getTime() + hari * 86400000);
      await tx.ajuanPerpanjangan.update({
        where: { id },
        data: {
          status: "disetujui",
          durasi_hari_disetujui: hari,
          catatan_admin: String(pesan_commit).trim(),
          diproses_oleh: sesi.pengguna_id,
        },
      });
      await tx.pinjaman.update({
        where: { id: ajuan.pinjaman_id },
        data: { tanggal_jatuh_tempo: jatuhTempoBaru },
      });
      await catatAuditCommit(tx, {
        pengguna_id: sesi.pengguna_id,
        konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
        aksi: "KONFIRMASI_PERPANJANGAN",
        pesan_commit: String(pesan_commit).trim(),
        tabel: "pinjaman",
        entitas_id: ajuan.pinjaman_id,
        data_lama: { tanggal_jatuh_tempo: ajuan.pinjaman.tanggal_jatuh_tempo },
        data_baru: { tanggal_jatuh_tempo: jatuhTempoBaru, tambahan_hari: hari },
      });
      await tx.notifikasi.create({
        data: {
          pengguna_id: ajuan.pengguna_id,
          target_peran: "warga",
          judul: "Perpanjangan Disetujui",
          pesan: `Perpanjangan "${ajuan.pinjaman.eksemplar.buku.judul}" disetujui +${hari} hari.`,
          tautan: "/pinjaman",
        },
      });
    } else {
      await tx.ajuanPerpanjangan.update({
        where: { id },
        data: {
          status: "ditolak",
          catatan_admin: String(pesan_commit).trim(),
          diproses_oleh: sesi.pengguna_id,
        },
      });
      await catatAuditCommit(tx, {
        pengguna_id: sesi.pengguna_id,
        konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
        aksi: "TOLAK_PERPANJANGAN",
        pesan_commit: String(pesan_commit).trim(),
        tabel: "ajuan_perpanjangan",
        entitas_id: id,
        data_lama: { status: "menunggu" },
        data_baru: { status: "ditolak" },
      });
      await tx.notifikasi.create({
        data: {
          pengguna_id: ajuan.pengguna_id,
          target_peran: "warga",
          judul: "Perpanjangan Ditolak",
          pesan: `Perpanjangan "${ajuan.pinjaman.eksemplar.buku.judul}" ditolak: ${String(pesan_commit).trim()}`,
          tautan: "/pinjaman",
        },
      });
    }
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ berhasil: true });
}
