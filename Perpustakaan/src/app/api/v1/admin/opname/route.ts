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

  const body = await req.json();

  if (body.aksi === "buat_sesi") {
    const semuaEks = await prisma.eksemplar.findMany({ where: { deleted_at: null } });
    const kode_sesi = `OPN-${Math.floor(1000 + Math.random() * 9000)}`;

    const opname = await prisma.$transaction(async (tx) => {
      const created = await tx.opnameSesi.create({
        data: {
          kode_sesi,
          judul: String(body.judul ?? "Stock Opname Harian"),
          cakupan: "semua",
          status: "berjalan",
          petugas_id: sesi.pengguna_id,
        },
      });
      if (semuaEks.length > 0) {
        await tx.opnameDetail.createMany({
          data: semuaEks.map((e) => ({
            sesi_id: created.id,
            eksemplar_id: e.id,
            status_sistem_awal: e.status,
          })),
        });
      }
      return created;
    });

    return NextResponse.json({ opname }, { status: 201 });
  }

  if (body.aksi === "pindai") {
    const eks = await prisma.eksemplar.findUnique({
      where: { kode_barcode: String(body.kode_barcode ?? "").trim().toUpperCase() },
    });
    if (!eks) {
      return problemResponse(404, "BARCODE_TIDAK_DITEMUKAN", "Barcode Tidak Ditemukan", "Barcode tidak terdaftar.");
    }

    await prisma.opnameDetail.updateMany({
      where: { sesi_id: body.sesi_id, eksemplar_id: eks.id },
      data: {
        sudah_dipindai: true,
        status_fisik_temuan: body.temuan ?? "cocok",
        dipindai_pada: new Date(),
      },
    });
    return NextResponse.json({ berhasil: true });
  }

  if (body.aksi === "commit") {
    const pesan = String(body.pesan_commit ?? "").trim();
    if (!pesan) {
      return problemResponse(422, "PESAN_COMMIT_WAJIB", "Pesan Commit Wajib", "Sertakan pesan commit untuk mengesahkan Stock Opname.");
    }

    await prisma.$transaction(async (tx) => {
      const details = await tx.opnameDetail.findMany({ where: { sesi_id: body.sesi_id } });
      for (const d of details) {
        if (!d.sudah_dipindai && d.status_sistem_awal === "tersedia") {
          await tx.eksemplar.update({ where: { id: d.eksemplar_id }, data: { status: "hilang" } });
        } else if (d.sudah_dipindai && d.status_fisik_temuan === "rusak") {
          await tx.eksemplar.update({ where: { id: d.eksemplar_id }, data: { status: "rusak" } });
        }
      }

      await tx.opnameSesi.update({
        where: { id: body.sesi_id },
        data: { status: "selesai_commit", pesan_commit: pesan, disahkan_pada: new Date() },
      });

      await catatAuditCommit(tx, {
        pengguna_id: sesi.pengguna_id,
        konteks_peran: sesi.pengguna.is_admin_master ? "admin_master" : "admin",
        aksi: "COMMIT_OPNAME",
        pesan_commit: pesan,
        tabel: "opname_sesi",
        entitas_id: body.sesi_id,
        data_baru: { status: "selesai_commit" },
      });
    }, { maxWait: 15000, timeout: 30000 });

    return NextResponse.json({ berhasil: true });
  }

  return problemResponse(400, "AKSI_TIDAK_DIKENAL", "Aksi Tidak Dikenal", "Aksi opname tidak valid.");
}
