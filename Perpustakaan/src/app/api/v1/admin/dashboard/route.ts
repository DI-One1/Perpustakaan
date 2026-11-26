import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function GET() {
  const sesi = await ambilSesiAktif();
  if (
    !sesi ||
    (!sesi.pengguna.peran.includes("admin") &&
      !sesi.pengguna.peran.includes("admin_master"))
  ) {
    return problemResponse(
      403,
      "AKSES_DITOLAK",
      "Akses Ditolak",
      "Endpoint ini khusus Admin perpustakaan."
    );
  }

  const [
    totalBuku,
    totalEksemplar,
    totalAnggota,
    reservasiAktif,
    pinjamanAktif,
    ajuanPerpanjangan,
    dendaList,
    opnameSesiList,
    auditLogList,
    penggunaList,
    bukuList,
    kategoriList,
  ] = await Promise.all([
    prisma.buku.count(),
    prisma.eksemplar.count({ where: { deleted_at: null } }),
    prisma.pengguna.count({ where: { deleted_at: null } }),
    prisma.reservasi.findMany({
      where: { status: { in: ["siap_diambil", "menunggu"] } },
      include: {
        pengguna: {
          select: { id: true, nomor_induk: true, nama_lengkap: true },
        },
        buku: true,
        eksemplar: true,
      },
      orderBy: { created_at: "asc" },
    }),
    prisma.pinjaman.findMany({
      where: { status: { in: ["aktif", "terlambat"] } },
      include: {
        pengguna: {
          select: { id: true, nomor_induk: true, nama_lengkap: true },
        },
        eksemplar: { include: { buku: true } },
      },
      orderBy: { tanggal_jatuh_tempo: "asc" },
    }),
    prisma.ajuanPerpanjangan.findMany({
      where: { status: "menunggu" },
      include: {
        pengguna: {
          select: { id: true, nomor_induk: true, nama_lengkap: true },
        },
        pinjaman: { include: { eksemplar: { include: { buku: true } } } },
      },
      orderBy: { created_at: "asc" },
    }),
    prisma.denda.findMany({
      include: {
        pengguna: {
          select: { id: true, nomor_induk: true, nama_lengkap: true },
        },
        pinjaman: { include: { eksemplar: { include: { buku: true } } } },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    }),
    prisma.opnameSesi.findMany({
      include: {
        detail: { include: { eksemplar: { include: { buku: true } } } },
        petugas: { select: { nama_lengkap: true } },
      },
      orderBy: { dibuat_pada: "desc" },
      take: 10,
    }),
    prisma.logAudit.findMany({
      include: {
        pengguna: {
          select: { nama_lengkap: true, nomor_induk: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    }),
    prisma.pengguna.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        nomor_induk: true,
        nama_lengkap: true,
        email: true,
        kelas_atau_jabatan: true,
        peran: true,
        is_admin_master: true,
        status_blokir: true,
        blokir_hingga: true,
        no_show_count: true,
      },
      orderBy: { created_at: "asc" },
    }),
    prisma.buku.findMany({
      include: {
        kategori: true,
        eksemplar: {
          where: { deleted_at: null },
          orderBy: { kode_barcode: "asc" },
        },
      },
      orderBy: { judul: "asc" },
    }),
    prisma.kategori.findMany({ orderBy: { nama: "asc" } }),
  ]);

  const sesiOpnameAktif =
    opnameSesiList.find((s) => s.status === "berjalan") || null;

  const dendaBelumLunas = dendaList.filter((d) => d.status === "belum_lunas");

  const formattedAuditLogs = auditLogList.map((log) => ({
    ...log,
    commit_hash: log.kode_commit,
    dibuat_pada: log.created_at,
    aktor: log.pengguna,
    entitas: log.tabel,
  }));

  const formattedPenggunaList = penggunaList.map((u) => ({
    ...u,
    is_terblokir:
      u.status_blokir === "blokir_permanen" ||
      (u.status_blokir === "blokir_sementara" &&
        Boolean(u.blokir_hingga && u.blokir_hingga > new Date())),
  }));

  return NextResponse.json({
    pengguna: {
      id: sesi.pengguna.id,
      nomor_induk: sesi.pengguna.nomor_induk,
      nama_lengkap: sesi.pengguna.nama_lengkap,
      peran: sesi.pengguna.peran,
      is_admin_master: sesi.pengguna.is_admin_master,
    },
    kpi: {
      total_katalog: totalBuku,
      total_buku: totalBuku,
      total_eksemplar: totalEksemplar,
      total_anggota: totalAnggota,
      pinjaman_aktif: pinjamanAktif.length,
      pinjaman_berjalan: pinjamanAktif.length,
      pengajuan_menunggu: reservasiAktif.filter((r) => r.status === "siap_diambil").length,
    },
    pengajuan_aktif: reservasiAktif,
    reservasi_aktif: reservasiAktif,
    pinjaman_aktif_list: pinjamanAktif,
    pinjaman_aktif: pinjamanAktif,
    perpanjangan_menunggu: ajuanPerpanjangan,
    ajuan_perpanjangan: ajuanPerpanjangan,
    denda_belum_lunas: dendaBelumLunas,
    denda: dendaList,
    buku_list: bukuList,
    pengguna_list: formattedPenggunaList,
    pengguna_raw: formattedPenggunaList,
    sesi_opname_aktif: sesiOpnameAktif,
    opname_sesi: opnameSesiList,
    audit_logs: formattedAuditLogs,
    audit_log: formattedAuditLogs,
    kategori: kategoriList,
  });
}
