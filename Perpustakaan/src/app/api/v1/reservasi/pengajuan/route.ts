import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ambilSesiAktif } from "@/lib/auth";
import { problemResponse } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const sesi = await ambilSesiAktif();
  if (!sesi) {
    return problemResponse(401, "SESI_TIDAK_VALID", "Sesi Tidak Valid", "Silakan masuk terlebih dahulu.");
  }

  const { buku_id } = await req.json();
  if (!buku_id) {
    return problemResponse(400, "INPUT_TIDAK_LENGKAP", "Input Tidak Lengkap", "ID buku wajib disertakan.");
  }

  const p = sesi.pengguna;

  // 1. Cek blokir
  if (p.status_blokir === "blokir_permanen") {
    return problemResponse(403, "AKUN_TERBLOKIR_PERMANEN", "Akun Terblokir Permanen", "Akun Anda diblokir permanen akibat pelanggaran berulang. Hubungi Admin perpustakaan.");
  }
  if (p.status_blokir === "blokir_sementara" && p.blokir_hingga && p.blokir_hingga > new Date()) {
    return problemResponse(403, "AKUN_TERBLOKIR_SEMENTARA", "Akun Terblokir Sementara", "Akun Anda sedang dalam masa blokir sementara 7 hari.");
  }

  // 2. Cek denda belum lunas
  const dendaAktif = await prisma.denda.count({
    where: { pengguna_id: p.id, status: "belum_lunas", nominal: { gt: 0 } },
  });
  if (dendaAktif > 0) {
    return problemResponse(403, "DENDA_BELUM_LUNAS", "Denda Belum Lunas", "Harap lunasi denda keterlambatan di meja Admin sebelum mengajukan peminjaman.");
  }

  // 3. Cek Single-Item Rule (maks 1 pinjaman aktif atau reservasi aktif)
  const [pinjamAktif, resAktif] = await Promise.all([
    prisma.pinjaman.count({ where: { pengguna_id: p.id, status: { in: ["aktif", "terlambat"] } } }),
    prisma.reservasi.count({ where: { pengguna_id: p.id, status: { in: ["siap_diambil", "menunggu"] } } }),
  ]);
  if (pinjamAktif + resAktif >= 1) {
    return problemResponse(409, "KUOTA_PINJAM_PENUH", "Kuota Peminjaman Penuh", "Anda sudah memiliki 1 buku aktif, pengajuan, atau antrean berjalan.");
  }

  try {
    const hasil = await prisma.$transaction(async (tx) => {
      const eksRows = await tx.$queryRaw<{ id: string; kode_barcode: string }[]>`
        SELECT id, kode_barcode FROM eksemplar
        WHERE buku_id = ${buku_id} AND status = 'tersedia' AND deleted_at IS NULL
        ORDER BY kode_barcode ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `;

      if (eksRows.length === 0) {
        throw new Error("STOK_TIDAK_TERSEDIA");
      }

      const eks = eksRows[0];
      await tx.eksemplar.update({
        where: { id: eks.id },
        data: { status: "direservasi" },
      });

      const kode_reservasi = `RSV-${Math.floor(1000 + Math.random() * 9000)}`;
      const waktu_tenggat = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const reservasi = await tx.reservasi.create({
        data: {
          kode_reservasi,
          pengguna_id: p.id,
          buku_id,
          eksemplar_id: eks.id,
          jenis: "pengajuan",
          status: "siap_diambil",
          waktu_tenggat,
        },
        include: { buku: true, eksemplar: true },
      });

      await tx.notifikasi.create({
        data: {
          pengguna_id: p.id,
          target_peran: "warga",
          judul: "Pengajuan Peminjaman Berhasil",
          pesan: `Eksemplar ${eks.kode_barcode} (${reservasi.buku.judul}) telah dialokasikan (${kode_reservasi}). Ambil dalam 24 jam.`,
          tautan: "/antrean",
        },
      });

      // Notif untuk semua Admin
      const admins = await tx.pengguna.findMany({
        where: { peran: { has: "admin" }, deleted_at: null },
        select: { id: true },
      });
      if (admins.length > 0) {
        await tx.notifikasi.createMany({
          data: admins.map((a) => ({
            pengguna_id: a.id,
            target_peran: "admin",
            judul: "Pengajuan Peminjaman Baru",
            pesan: `${p.nama_lengkap} mengajukan peminjaman ${reservasi.buku.judul} (${eks.kode_barcode}).`,
            tautan: "/admin",
          })),
        });
      }

      return reservasi;
    }, { maxWait: 15000, timeout: 30000 });

    return NextResponse.json({ reservasi: hasil }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "STOK_TIDAK_TERSEDIA") {
      return problemResponse(409, "STOK_TIDAK_TERSEDIA", "Stok Eksemplar Habis", "Semua eksemplar sedang dipinjam atau direservasi. Silakan gunakan tombol Antre Buku.");
    }
    console.error(err);
    return problemResponse(500, "KESALAHAN_SERVER", "Kesalahan Server", "Gagal memproses pengajuan peminjaman.");
  }
}
