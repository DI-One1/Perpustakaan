import { NextRequest, NextResponse } from "next/server";
import { ambilSesiAktif } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { problemResponse } from "@/lib/errors";
import { KodePeran } from "@prisma/client";

export async function GET() {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return NextResponse.json({ pengguna: null });
  }

  const p = sesi.pengguna;
  return NextResponse.json({
    pengguna: {
      id: p.id,
      nomor_induk: p.nomor_induk,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      kelas_atau_jabatan: p.kelas_atau_jabatan,
      peran: p.peran,
      is_admin_master: p.is_admin_master,
      status_blokir: p.status_blokir,
      blokir_hingga: p.blokir_hingga,
      konteks_peran_aktif: sesi.konteks_peran_aktif,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const body = await req.json();
  const target = body.konteks_peran_aktif as KodePeran;

  if (!sesi.pengguna.peran.includes(target)) {
    return problemResponse(403, "AKSES_DITOLAK", "Akses Ditolak", "Anda tidak memiliki peran tersebut.");
  }

  await prisma.sesi.update({
    where: { id: sesi.id },
    data: { konteks_peran_aktif: target },
  });

  return NextResponse.json({ konteks_peran_aktif: target });
}
