import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { buatSesi } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nomor_induk = String(body.nomor_induk ?? "").trim();
    const password = String(body.password ?? "");

    if (!nomor_induk || !password) {
      return problemResponse(400, "INPUT_TIDAK_LENGKAP", "Input Tidak Lengkap", "Nomor induk dan kata sandi wajib diisi.");
    }

    const pengguna = await prisma.pengguna.findUnique({
      where: { nomor_induk },
    });

    if (!pengguna || pengguna.deleted_at) {
      return problemResponse(401, "KREDENSIAL_SALAH", "Gagal Masuk", "Nomor induk atau kata sandi tidak sesuai.");
    }

    const valid = await bcrypt.compare(password, pengguna.password_hash);
    if (!valid) {
      return problemResponse(401, "KREDENSIAL_SALAH", "Gagal Masuk", "Nomor induk atau kata sandi tidak sesuai.");
    }

    const konteksAwal = pengguna.peran.includes("admin_master")
      ? "admin_master"
      : pengguna.peran.includes("admin")
      ? "admin"
      : "warga";

    await buatSesi(pengguna.id, konteksAwal);

    return NextResponse.json({
      pengguna: {
        id: pengguna.id,
        nomor_induk: pengguna.nomor_induk,
        nama_lengkap: pengguna.nama_lengkap,
        email: pengguna.email,
        kelas_atau_jabatan: pengguna.kelas_atau_jabatan,
        peran: pengguna.peran,
        is_admin_master: pengguna.is_admin_master,
        konteks_peran_aktif: konteksAwal,
      },
    });
  } catch (err) {
    console.error(err);
    return problemResponse(500, "KESALAHAN_SERVER", "Kesalahan Server", "Terjadi kesalahan saat memproses login.");
  }
}
