import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Bilik2026!", 10);

  await prisma.kebijakanSistem.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      durasi_pinjam_hari: 7,
      denda_per_hari: 500,
      batas_pengambilan_jam: 24,
      kuota_aktif_maks: 1,
    },
  });

  const users = [
    {
      nomor_induk: "ADMIN-001",
      nama_lengkap: "Pak Ridwan Santoso",
      email: "ridwan@smktibazma.sch.id",
      kelas_atau_jabatan: "Kepala Perpustakaan (Admin Master)",
      peran: ["warga", "admin", "admin_master"] as ("warga" | "admin" | "admin_master")[],
      is_admin_master: true,
    },
    {
      nomor_induk: "ADM-002",
      nama_lengkap: "Ibu Nurul Hidayah",
      email: "nurul@smktibazma.sch.id",
      kelas_atau_jabatan: "Admin Perpustakaan",
      peran: ["warga", "admin"] as ("warga" | "admin")[],
      is_admin_master: false,
    },
    {
      nomor_induk: "0061234567",
      nama_lengkap: "Muhammad Fadhil",
      email: "fadhil@siswa.smktibazma.sch.id",
      kelas_atau_jabatan: "XII SIJA",
      peran: ["warga"] as ("warga")[],
      is_admin_master: false,
    },
    {
      nomor_induk: "0061234568",
      nama_lengkap: "Ahmad Dahlan",
      email: "ahmad@siswa.smktibazma.sch.id",
      kelas_atau_jabatan: "XI SIJA",
      peran: ["warga"] as ("warga")[],
      is_admin_master: false,
    },
    {
      nomor_induk: "0061234569",
      nama_lengkap: "Salma Zahira",
      email: "salma@siswa.smktibazma.sch.id",
      kelas_atau_jabatan: "XII SIJA",
      peran: ["warga"] as ("warga")[],
      is_admin_master: false,
    },
    {
      nomor_induk: "0061234570",
      nama_lengkap: "Rian Pratama",
      email: "rian@siswa.smktibazma.sch.id",
      kelas_atau_jabatan: "X SIJA",
      peran: ["warga"] as ("warga")[],
      is_admin_master: false,
    },
  ];

  const userMap: Record<string, string> = {};
  for (const u of users) {
    const record = await prisma.pengguna.upsert({
      where: { nomor_induk: u.nomor_induk },
      update: { nama_lengkap: u.nama_lengkap, peran: u.peran, is_admin_master: u.is_admin_master },
      create: {
        ...u,
        password_hash: passwordHash,
      },
    });
    userMap[u.nomor_induk] = record.id;
  }

  const kategoriList = [
    { nama: "Rekayasa Perangkat Lunak", slug: "rekayasa-perangkat-lunak" },
    { nama: "Keislaman & Akhlak", slug: "keislaman-akhlak" },
    { nama: "Jaringan & Cloud", slug: "jaringan-cloud" },
    { nama: "Desain & UI/UX", slug: "desain-ui-ux" },
    { nama: "Literasi & Pengembangan Diri", slug: "literasi-pengembangan-diri" },
  ];

  const katMap: Record<string, string> = {};
  for (const k of kategoriList) {
    const rec = await prisma.kategori.upsert({
      where: { slug: k.slug },
      update: { nama: k.nama },
      create: k,
    });
    katMap[k.slug] = rec.id;
  }

  const bukuList = [
    {
      isbn: "978-602-001-001",
      judul: "Clean Code: Panduan Menulis Kode Rapi",
      penulis: "Robert C. Martin",
      penerbit: "Informatika Bandung",
      tahun_terbit: 2023,
      sinopsis: "Panduan praktis membangun arsitektur kode yang mudah dibaca, diuji, dan dipelihara untuk pengembang perangkat lunak modern.",
      cover_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      kategori_slug: "rekayasa-perangkat-lunak",
      barcodes: ["BK-0001", "BK-0002", "BK-0003"],
    },
    {
      isbn: "978-602-001-002",
      judul: "Fiqih Prioritas untuk Pelajar Muslim",
      penulis: "Dr. Yusuf Al-Qaradawi",
      penerbit: "Pustaka Al-Kautsar",
      tahun_terbit: 2022,
      sinopsis: "Membahas keseimbangan antara ilmu agama, adab menuntut ilmu, dan kontribusi nyata di era teknologi digital.",
      cover_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      kategori_slug: "keislaman-akhlak",
      barcodes: ["BK-0004", "BK-0005"],
    },
    {
      isbn: "978-602-001-003",
      judul: "Arsitektur Fullstack Next.js & PostgreSQL",
      penulis: "Muhammad Choerul",
      penerbit: "BAZMA Press",
      tahun_terbit: 2025,
      sinopsis: "Referensi membangun aplikasi web terukur dengan TypeScript, App Router, Prisma ORM, dan transaksi database atomik.",
      cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      kategori_slug: "rekayasa-perangkat-lunak",
      barcodes: ["BK-0006"], // Sengaja 1 eksemplar untuk demo Antrean FIFO
    },
    {
      isbn: "978-602-001-004",
      judul: "Administrasi Sistem Linux & Docker",
      penulis: "Onno W. Purbo",
      penerbit: "Andi Publisher",
      tahun_terbit: 2024,
      sinopsis: "Panduan lengkap pengelolaan server Linux, container Docker, dan keamanan jaringan untuk siswa SIJA.",
      cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      kategori_slug: "jaringan-cloud",
      barcodes: ["BK-0007", "BK-0008"],
    },
    {
      isbn: "978-602-001-005",
      judul: "Prinsip Desain Antarmuka Material 3",
      penulis: "Don Norman",
      penerbit: "Gramedia Pustaka",
      tahun_terbit: 2023,
      sinopsis: "Memahami psikologi pengguna, aksesibilitas web modern, dan sistem token desain yang konsisten.",
      cover_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      kategori_slug: "desain-ui-ux",
      barcodes: ["BK-0009", "BK-0010"],
    },
    {
      isbn: "978-602-001-006",
      judul: "Atomic Habits: Membangun Kebiasaan Kecil",
      penulis: "James Clear",
      penerbit: "Gramedia Pustaka",
      tahun_terbit: 2021,
      sinopsis: "Strategi praktis membentuk rutinitas belajar dan literasi harian yang konsisten dengan perubahan kecil.",
      cover_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
      kategori_slug: "literasi-pengembangan-diri",
      barcodes: ["BK-0011", "BK-0012"],
    },
  ];

  const bukuMap: Record<string, string> = {};
  const eksMap: Record<string, string> = {};

  for (const b of bukuList) {
    const buku = await prisma.buku.upsert({
      where: { isbn: b.isbn },
      update: { judul: b.judul },
      create: {
        isbn: b.isbn,
        judul: b.judul,
        penulis: b.penulis,
        penerbit: b.penerbit,
        tahun_terbit: b.tahun_terbit,
        sinopsis: b.sinopsis,
        cover_url: b.cover_url,
        kategori_id: katMap[b.kategori_slug],
      },
    });
    bukuMap[b.isbn] = buku.id;

    for (const bc of b.barcodes) {
      const eks = await prisma.eksemplar.upsert({
        where: { kode_barcode: bc },
        update: {},
        create: {
          buku_id: buku.id,
          kode_barcode: bc,
          lokasi_rak: "Rak A1",
          status: "tersedia",
        },
      });
      eksMap[bc] = eks.id;
    }
  }

  // Skenario 1: Muhammad Fadhil punya pengajuan siap_diambil (BK-0001)
  const existingRsv = await prisma.reservasi.findUnique({ where: { kode_reservasi: "RSV-1001" } });
  if (!existingRsv) {
    await prisma.eksemplar.update({ where: { id: eksMap["BK-0001"] }, data: { status: "direservasi" } });
    await prisma.reservasi.create({
      data: {
        kode_reservasi: "RSV-1001",
        pengguna_id: userMap["0061234567"],
        buku_id: bukuMap["978-602-001-001"],
        eksemplar_id: eksMap["BK-0001"],
        jenis: "pengajuan",
        status: "siap_diambil",
        waktu_tenggat: new Date(Date.now() + 20 * 3600 * 1000),
      },
    });
  }

  // Skenario 2: Salma Zahira punya pinjaman aktif pada BK-0006 (sehingga stok BK-0006 = 0 -> bisa didemo Antre FIFO!)
  const salmaPinjam = await prisma.pinjaman.findFirst({ where: { pengguna_id: userMap["0061234569"] } });
  if (!salmaPinjam) {
    await prisma.eksemplar.update({ where: { id: eksMap["BK-0006"] }, data: { status: "dipinjam" } });
    await prisma.pinjaman.create({
      data: {
        pengguna_id: userMap["0061234569"],
        eksemplar_id: eksMap["BK-0006"],
        jalur: "langsung_offline",
        tanggal_pinjam: new Date(Date.now() - 3 * 86400000),
        tanggal_jatuh_tempo: new Date(Date.now() + 4 * 86400000),
        status: "aktif",
        petugas_id: userMap["ADM-002"],
      },
    });
  }

  // Skenario 3: Rian Pratama terlambat 3 hari pada BK-0007
  const rianPinjam = await prisma.pinjaman.findFirst({ where: { pengguna_id: userMap["0061234570"] } });
  if (!rianPinjam) {
    await prisma.eksemplar.update({ where: { id: eksMap["BK-0007"] }, data: { status: "dipinjam" } });
    await prisma.pinjaman.create({
      data: {
        pengguna_id: userMap["0061234570"],
        eksemplar_id: eksMap["BK-0007"],
        jalur: "langsung_offline",
        tanggal_pinjam: new Date(Date.now() - 10 * 86400000),
        tanggal_jatuh_tempo: new Date(Date.now() - 3 * 86400000),
        status: "terlambat",
        petugas_id: userMap["ADM-002"],
      },
    });
  }

  // Ulasan awal
  await prisma.ulasan.upsert({
    where: { pengguna_id_buku_id: { pengguna_id: userMap["0061234568"], buku_id: bukuMap["978-602-001-001"] } },
    update: {},
    create: {
      pengguna_id: userMap["0061234568"],
      buku_id: bukuMap["978-602-001-001"],
      rating: 5,
      komentar: "Sangat membantu memahami clean architecture untuk proyek akhir semester!",
    },
  });

  console.log("Seed BILIK selesai! Akun siap pakai (Password: Bilik2026!)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
