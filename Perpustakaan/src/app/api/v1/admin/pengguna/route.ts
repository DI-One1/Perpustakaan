import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";
import { catatAuditCommit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { nomor_induk, nama_lengkap, email, kelas_atau_jabatan } = await req.json();
  if (!nomor_induk || !nama_lengkap || !email) {
    return problemResponse(400, "INPUT_TIDAK_LENGKAP", "Input Tidak Lengkap", "Nomor induk, nama, dan email wajib diisi.");
  }

  const hash = await bcrypt.hash("Bilik2026!", 10);
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.pengguna.create({
      data: {
        nomor_induk,
        nama_lengkap,
        email,
        kelas_atau_jabatan: kelas_atau_jabatan || "Siswa",
        password_hash: hash,
        peran: ["warga"],
      },
    });
    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: "TAMBAH_WARGA",
      pesan_commit: `Registrasi warga baru ${nama_lengkap} (${nomor_induk}).`,
      tabel: "pengguna",
      entitas_id: created.id,
    });
    return created;
  });

  return NextResponse.json({ pengguna: user }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { pengguna_id, aksi, pesan_commit } = await req.json();
  const target = await prisma.pengguna.findUnique({ where: { id: pengguna_id } });
  if (!target) {
    return problemResponse(404, "PENGGUNA_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Pengguna tidak ditemukan.");
  }

  if (aksi === "toggle_admin") {
    if (!sesi.pengguna.is_admin_master) {
      return problemResponse(403, "KHUSUS_ADMIN_MASTER", "Khusus Admin Master", "Hanya Admin Master yang berhak memberi atau mencabut peran Admin.");
    }
    if (target.is_admin_master) {
      return problemResponse(403, "ADMIN_MASTER_KEBAL", "Admin Master Kebal", "Akun Admin Master tidak dapat diturunkan perannya.");
    }

    const punyaAdmin = target.peran.includes("admin");
    const peranBaru = punyaAdmin ? (["warga"] as ("warga" | "admin")[]) : (["warga", "admin"] as ("warga" | "admin")[]);

    await prisma.$transaction(async (tx) => {
      await tx.pengguna.update({ where: { id: target.id }, data: { peran: peranBaru } });
      await catatAuditCommit(tx, {
        pengguna_id: sesi.pengguna_id,
        konteks_peran: "admin_master",
        aksi: punyaAdmin ? "CABUT_PERAN_ADMIN" : "BERI_PERAN_ADMIN",
        pesan_commit: String(pesan_commit || "Pembaruan peran admin oleh Admin Master"),
        tabel: "pengguna",
        entitas_id: target.id,
        data_lama: { peran: target.peran },
        data_baru: { peran: peranBaru },
      });
    });

    return NextResponse.json({ berhasil: true, peran: peranBaru });
  }

  if (aksi === "buka_blokir") {
    await prisma.$transaction(async (tx) => {
      await tx.pengguna.update({
        where: { id: target.id },
        data: { status_blokir: "normal", blokir_hingga: null, no_show_count: 0 },
      });
      await catatAuditCommit(tx, {
        pengguna_id: sesi.pengguna_id,
        konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
        aksi: "BUKA_BLOKIR_WARGA",
        pesan_commit: String(pesan_commit || "Pembukaan blokir akun oleh Admin"),
        tabel: "pengguna",
        entitas_id: target.id,
      });
    });
    return NextResponse.json({ berhasil: true });
  }

  return problemResponse(400, "AKSI_TIDAK_VALID", "Aksi Tidak Valid", "Aksi tidak dikenal.");
}

export async function DELETE(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi || (!sesi.pengguna.peran.includes("admin") && !sesi.pengguna.peran.includes("admin_master"))) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Khusus Admin.");
  }

  const { pengguna_id, pesan_commit } = await req.json();
  const target = await prisma.pengguna.findUnique({ where: { id: pengguna_id } });
  if (!target) {
    return problemResponse(404, "PENGGUNA_TIDAK_DITEMUKAN", "Tidak Ditemukan", "Pengguna tidak ditemukan.");
  }
  if (target.is_admin_master) {
    return problemResponse(403, "ADMIN_MASTER_KEBAL", "Admin Master Kebal", "Akun Admin Master kebal dari penghapusan.");
  }
  if (target.peran.includes("admin") && !sesi.pengguna.is_admin_master) {
    return problemResponse(403, "KHUSUS_ADMIN_MASTER", "Khusus Admin Master", "Hanya Admin Master yang dapat menghapus akun Admin.");
  }

  const [pCount, rCount, dCount] = await Promise.all([
    prisma.pinjaman.count({ where: { pengguna_id } }),
    prisma.reservasi.count({ where: { pengguna_id } }),
    prisma.denda.count({ where: { pengguna_id } }),
  ]);

  const punyaHistori = pCount + rCount + dCount > 0;

  await prisma.$transaction(async (tx) => {
    if (punyaHistori) {
      await tx.pengguna.update({ where: { id: pengguna_id }, data: { deleted_at: new Date() } });
    } else {
      await tx.pengguna.delete({ where: { id: pengguna_id } });
    }
    await catatAuditCommit(tx, {
      pengguna_id: sesi.pengguna_id,
      konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
      aksi: punyaHistori ? "SOFT_DELETE_PENGGUNA" : "HARD_DELETE_PENGGUNA",
      pesan_commit: String(pesan_commit || (punyaHistori ? "Soft delete akun berhistori" : "Hard delete akun salah buat")),
      tabel: "pengguna",
      entitas_id: pengguna_id,
    });
  }, { maxWait: 15000, timeout: 30000 });

  return NextResponse.json({ berhasil: true, metode: punyaHistori ? "soft_delete" : "hard_delete" });
}
