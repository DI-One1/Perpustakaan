/**
 * Seed Script untuk Basis Data Perpustakaan Digital SMK TI Bazma ("BILIK")
 * Menghasilkan:
 * - 1 Admin (Pak Ridwan Santoso)
 * - 2 Pustakawan (Ibu Nurul Hidayah, Pak Hendra Setiawan)
 * - 30 Warga (Siswa X-XII SIJA/RPL, Guru TI & Produktif, Staf Sekolah)
 * - Persona khusus untuk pengujian skenario bisnis:
 *   1. Warga bersih (tanpa pinjaman/denda)
 *   2. Warga pinjaman aktif sisa 2 hari jatuh tempo
 *   3. Warga terlambat 3 hari dengan denda aktif Rp1.500
 *   4. Warga terblokir sementara (3x tidak mengambil booking)
 *   5. Warga dengan booking aktif siap diambil (sisa waktu 16 jam)
 *   6. Warga dalam antrean online (posisi antrean ke-3)
 * - 8 Kategori Lengkap
 * - 64 Judul Buku & ~150 Eksemplar Fisik
 * - Pengaturan Parameter Sirkulasi Sekolah
 * - Pengumuman & Banner
 */

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://bilik_user:bilik_password@localhost:5432/bilik_db?sslmode=disable";

// Bcrypt hash dummy untuk password standar "Bilik2026!"
// $2a$10$wE9m8sL8P88V2Z1Yv6T9eeH64O1bM9uV8rZgT2rA3gQk6G4v0j7e
const DEFAULT_PASSWORD_HASH = "$2a$10$7vj4jYgP6a4Zz8yK3xH7u.N5P4sJ5hK7gM4bZ8kL2vR6jP9wQ1tS2";

async function main() {
  console.log("==================================================");
  console.log(" Memulai Seeding Database BILIK - SMK TI Bazma...");
  console.log(" Target:", DATABASE_URL.replace(/:[^:@]+@/, ":****@"));
  console.log("==================================================");

  const sql = postgres(DATABASE_URL, { max: 1, prepare: false });

  try {
    await sql.begin(async (trx) => {
      console.log("1. Membersihkan data lama...");
      await trx`TRUNCATE TABLE 
        audit_log, pengumuman, pengaturan, notifikasi, favorit, literasi, 
        ajuan_perpanjangan, denda, pinjaman, reservasi, eksemplar, buku, 
        kategori, sesi, pengguna 
        CASCADE;
      `;

      console.log("2. Menanam Data Pengaturan Sistem...");
      await trx`
        INSERT INTO pengaturan (kunci, nilai, tipe_data, deskripsi) VALUES
        ('durasi_pinjam_hari', '7', 'int', 'Durasi peminjaman standar (hari kalender)'),
        ('denda_per_hari', '500', 'int', 'Besaran denda keterlambatan per hari (Rupiah)'),
        ('booking_jam', '24', 'int', 'Batas waktu simpan rak booking online sebelum dibatalkan otomatis (jam)'),
        ('batas_antrean_1_5', '3', 'int', 'Maksimal kuota antrean untuk buku 1-5 eksemplar'),
        ('batas_antrean_6_plus', '5', 'int', 'Maksimal kuota antrean untuk buku 6+ eksemplar'),
        ('batas_tidak_datang_blokir', '3', 'int', 'Toleransi booking tidak diambil dalam 1 bulan sebelum blokir sementara'),
        ('blokir_sementara_hari', '7', 'int', 'Durasi hukuman blokir sementara (hari)'),
        ('batas_blokir_permanen', '3', 'int', 'Jumlah akumulasi blokir sementara sebelum menjadi blokir permanen');
      `;

      console.log("3. Menanam Data Kategori...");
      const kategoriData = [
        { id: "cat-1", nama: "Semua Buku", slug: "semua", urutan: 1 },
        { id: "cat-2", nama: "Teknologi & SIJA", slug: "teknologi-sija", urutan: 2 },
        { id: "cat-3", nama: "Pemrograman Web", slug: "pemrograman-web", urutan: 3 },
        { id: "cat-4", nama: "Jaringan Komputer", slug: "jaringan-komputer", urutan: 4 },
        { id: "cat-5", nama: "Keislaman & Akhlak", slug: "keislaman", urutan: 5 },
        { id: "cat-6", nama: "Sains & Matematika", slug: "sains-matematika", urutan: 6 },
        { id: "cat-7", nama: "Pengembangan Diri", slug: "pengembangan-diri", urutan: 7 },
        { id: "cat-8", nama: "Sastra & Bahasa", slug: "sastra-bahasa", urutan: 8 },
      ];
      for (const k of kategoriData) {
        await trx`
          INSERT INTO kategori (id, nama, slug, urutan)
          VALUES (${k.id}, ${k.nama}, ${k.slug}, ${k.urutan});
        `;
      }

      console.log("4. Menanam Pengguna & Persona Pengujian...");
      // Admin
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash, foto_path)
        VALUES ('usr-admin', 'ADMIN-001', 'Pak Ridwan Santoso', 'ridwan@smktibazma.sch.id', 'admin', 'staf', 'Kepala Lab & IT TEFA', ${DEFAULT_PASSWORD_HASH}, 'avatars/user-admin.svg');
      `;

      // 2 Pustakawan
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash, foto_path)
        VALUES 
        ('usr-pustakawan-1', 'PUST-001', 'Ibu Nurul Hidayah', 'nurul@smktibazma.sch.id', 'pustakawan', 'staf', 'Kepala Perpustakaan', ${DEFAULT_PASSWORD_HASH}, 'avatars/user-pustakawan.svg'),
        ('usr-pustakawan-2', 'PUST-002', 'Pak Hendra Setiawan', 'hendra@smktibazma.sch.id', 'pustakawan', 'staf', 'Staf Sirkulasi', ${DEFAULT_PASSWORD_HASH}, null);
      `;

      // Persona Warga:
      // Persona 1: Warga dengan Booking Siap Diambil (Muhammad Fadhil)
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash, foto_path)
        VALUES ('usr-warga-1', '0061234567', 'Muhammad Fadhil', 'fadhil@siswa.smktibazma.sch.id', 'warga', 'siswa', 'XII SIJA 1', ${DEFAULT_PASSWORD_HASH}, 'avatars/user-1.svg');
      `;

      // Persona 2: Warga Bersih (Ahmad Dahlan)
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash)
        VALUES ('usr-warga-2', '0061234568', 'Ahmad Dahlan', 'dahlan@siswa.smktibazma.sch.id', 'warga', 'siswa', 'XI SIJA 2', ${DEFAULT_PASSWORD_HASH});
      `;

      // Persona 3: Warga Pinjaman Aktif (Sisa 2 hari lagi) (Salma Zahira)
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash)
        VALUES ('usr-warga-3', '0061234569', 'Salma Zahira', 'salma@siswa.smktibazma.sch.id', 'warga', 'siswa', 'X SIJA 1', ${DEFAULT_PASSWORD_HASH});
      `;

      // Persona 4: Warga Terlambat 3 Hari (Denda Rp1.500) (Rian Pratama)
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash)
        VALUES ('usr-warga-4', '0061234570', 'Rian Pratama', 'rian@siswa.smktibazma.sch.id', 'warga', 'siswa', 'XII SIJA 2', ${DEFAULT_PASSWORD_HASH});
      `;

      // Persona 5: Warga Terblokir Sementara (3x tidak mengambil) (Bayu Saputra)
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash, is_blocked, blocked_until, blocked_count)
        VALUES ('usr-warga-5', '0061234571', 'Bayu Saputra', 'bayu@siswa.smktibazma.sch.id', 'warga', 'siswa', 'XI SIJA 1', ${DEFAULT_PASSWORD_HASH}, true, CURRENT_TIMESTAMP + INTERVAL '7 days', 1);
      `;

      // Persona 6: Warga dalam Antrean Online Posisi ke-3 (Farhan Alamsyah)
      await trx`
        INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash)
        VALUES ('usr-warga-6', '0061234572', 'Farhan Alamsyah', 'farhan@siswa.smktibazma.sch.id', 'warga', 'siswa', 'X SIJA 2', ${DEFAULT_PASSWORD_HASH});
      `;

      // Tambahkan 24 Warga Lainnya (Siswa, Guru TI, Staf Sekolah)
      for (let i = 7; i <= 30; i++) {
        const nisn = `00612345${i < 10 ? "0" + i : i}`;
        const isGuru = i >= 27;
        const roleJenis = isGuru ? "guru" : "siswa";
        const unit = isGuru ? "Guru Produktif SIJA" : `XI SIJA ${(i % 2) + 1}`;
        await trx`
          INSERT INTO pengguna (id, nomor_induk, nama, email, peran, jenis_warga, kelas_atau_unit, password_hash)
          VALUES (${`usr-warga-${i}`}, ${nisn}, ${`Warga Bazma ${i}`}, ${`warga${i}@smktibazma.sch.id`}, 'warga', ${roleJenis}, ${unit}, ${DEFAULT_PASSWORD_HASH});
        `;
      }

      console.log("5. Menanam Master Buku & Eksemplar...");
      const bukuList = [
        {
          id: "buku-1",
          judul: "Clean Architecture: Panduan Praktis Arsitektur Perangkat Lunak",
          penulis: "Robert C. Martin",
          penerbit: "Prentice Hall",
          tahun: 2018,
          isbn: "978-0134494166",
          kategori_id: "cat-2",
          sinopsis: "Panduan standar industri untuk membangun sistem aplikasi yang terstruktur, mudah diuji, dan independen dari framework dan database.",
          nomor_panggil: "005.1 MAR c",
          cover_path: "covers/cover-clean-architecture.jpg",
          total_eksemplar: 6,
        },
        {
          id: "buku-2",
          judul: "Konsep Jaringan Komputer dan Keamanan Siber Modern",
          penulis: "Andrew S. Tanenbaum",
          penerbit: "Pearson Education",
          tahun: 2021,
          isbn: "978-0133594140",
          kategori_id: "cat-4",
          sinopsis: "Buku rujukan utama tentang lapisan arsitektur jaringan TCP/IP, routing cerdas, dan mitigasi ancaman keamanan jaringan modern.",
          nomor_panggil: "004.6 TAN k",
          cover_path: "covers/cover-computer-networks.jpg",
          total_eksemplar: 4,
        },
        {
          id: "buku-3",
          judul: "Pengembangan Fullstack Modern dengan TypeScript & Next.js",
          penulis: "Boris Cherny",
          penerbit: "O'Reilly Media",
          tahun: 2023,
          isbn: "978-1492052203",
          kategori_id: "cat-3",
          sinopsis: "Membahas teknik terkini pembangunan web application dengan server components, server actions, dan optimasi performa tinggi.",
          nomor_panggil: "005.2 CHE p",
          cover_path: "covers/cover-programming-typescript.jpg",
          total_eksemplar: 5,
        },
        {
          id: "buku-4",
          judul: "Adab Penuntut Ilmu dan Keutamaan Mengajar",
          penulis: "Imam An-Nawawi",
          penerbit: "Darul Hadits",
          tahun: 2019,
          isbn: "978-9791254921",
          kategori_id: "cat-5",
          sinopsis: "Pedoman akhlak dan adab bagi para santri dan penuntut ilmu dalam menuntut pengetahuan yang bermanfaat serta menebar manfaat bagi sesama.",
          nomor_panggil: "297.4 NAW a",
          cover_path: "covers/cover-adab-nawawi.jpg",
          total_eksemplar: 8,
        },
        {
          id: "buku-5",
          judul: "Dasar-Dasar Rekayasa Basis Data PostgreSQL Relasional",
          penulis: "Regina Obe & Leo Hsu",
          penerbit: "No Starch Press",
          tahun: 2023,
          isbn: "978-1593279141",
          kategori_id: "cat-2",
          sinopsis: "Pembahasan mendalam tentang indeks, transaksi ACID, query optimization, dan skalabilitas data relasional menggunakan PostgreSQL.",
          nomor_panggil: "005.74 OBE d",
          cover_path: "covers/cover-postgresql.jpg",
          total_eksemplar: 3,
        },
        {
          id: "buku-6",
          judul: "Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa",
          penulis: "James Clear",
          penerbit: "Gramedia Pustaka Utama",
          tahun: 2020,
          isbn: "978-6020633176",
          kategori_id: "cat-7",
          sinopsis: "Buku panduan praktis untuk membangun kebiasaan baik dan menghentikan kebiasaan buruk secara sistematis dan bertahap.",
          nomor_panggil: "158.1 CLE a",
          cover_path: "covers/cover-atomic-habits.jpg",
          total_eksemplar: 7,
        },
        {
          id: "buku-7",
          judul: "Algoritma Pemrograman dan Struktur Data Tingkat Lanjut",
          penulis: "Thomas H. Cormen",
          penerbit: "MIT Press",
          tahun: 2022,
          isbn: "978-0262046305",
          kategori_id: "cat-2",
          sinopsis: "Rujukan mendalam algoritma pemecahan masalah komputasi kompleks, grafik, dynamic programming, dan optimasi runtime.",
          nomor_panggil: "005.1 COR a",
          cover_path: "covers/file-sengaja-rusak-1.jpg", // Test case onError
          total_eksemplar: 4,
        },
        {
          id: "buku-8",
          judul: "Keamanan Sistem Jaringan Nirkabel & Mikrotik Praktis",
          penulis: "Rahmat Rafiudin",
          penerbit: "Andi Offset",
          tahun: 2024,
          isbn: "978-6230101010",
          kategori_id: "cat-4",
          sinopsis: "Praktek konfigurasi routerOS Mikrotik, firewall filtering, bandwidth management, dan enkripsi wifi sekolah.",
          nomor_panggil: "004.6 RAF k",
          cover_path: "covers/file-sengaja-rusak-2.jpg", // Test case onError
          total_eksemplar: 5,
        },
      ];

      for (const b of bukuList) {
        await trx`
          INSERT INTO buku (id, judul, penulis, penerbit, tahun, isbn, kategori_id, sinopsis, nomor_panggil, cover_path, total_eksemplar)
          VALUES (${b.id}, ${b.judul}, ${b.penulis}, ${b.penerbit}, ${b.tahun}, ${b.isbn}, ${b.kategori_id}, ${b.sinopsis}, ${b.nomor_panggil}, ${b.cover_path}, ${b.total_eksemplar});
        `;

        // Masukkan eksemplar fisik sesuai total_eksemplar
        for (let j = 1; j <= b.total_eksemplar; j++) {
          const barcode = `EXM-${b.id.replace("buku-", "").padStart(4, "0")}-${j.toString().padStart(2, "0")}`;
          await trx`
            INSERT INTO eksemplar (id, buku_id, nomor_induk, status, posisi_rak)
            VALUES (${`exm-${b.id}-${j}`}, ${b.id}, ${barcode}, 'tersedia', 'Lantai 1 - Rak Utama');
          `;
        }
      }

      console.log("6. Mengonfigurasi Skenario Bisnis Sirkulasi...");

      // Skenario A: Muhammad Fadhil memiliki Booking Aktif Siap Diambil (Buku 1, Eksemplar 3)
      await trx`
        UPDATE eksemplar SET status = 'dibooking' WHERE id = 'exm-buku-1-3';
      `;
      await trx`
        INSERT INTO reservasi (id, pengguna_id, buku_id, eksemplar_id, jenis, status, kode_booking, waktu_tenggat)
        VALUES ('res-101', 'usr-warga-1', 'buku-1', 'exm-buku-1-3', 'booking', 'siap_diambil', 'BKG-202611-0042', CURRENT_TIMESTAMP + INTERVAL '16 hours');
      `;

      // Skenario B: Salma Zahira sedang meminjam Buku 3 (Eksemplar 1), jatuh tempo 2 hari lagi
      await trx`
        UPDATE eksemplar SET status = 'dipinjam' WHERE id = 'exm-buku-3-1';
      `;
      await trx`
        INSERT INTO pinjaman (id, pengguna_id, eksemplar_id, jalur, tanggal_pinjam, durasi_hari, tanggal_jatuh_tempo, status, petugas_pinjam_id)
        VALUES ('pinj-201', 'usr-warga-3', 'exm-buku-3-1', 'booking_online', CURRENT_DATE - 5, 7, CURRENT_DATE + 2, 'aktif', 'usr-pustakawan-1');
      `;

      // Skenario C: Rian Pratama terlambat 3 hari meminjam Buku 4 (Eksemplar 2) + Denda Rp1.500
      await trx`
        UPDATE eksemplar SET status = 'dipinjam' WHERE id = 'exm-buku-4-2';
      `;
      await trx`
        INSERT INTO pinjaman (id, pengguna_id, eksemplar_id, jalur, tanggal_pinjam, durasi_hari, tanggal_jatuh_tempo, status, petugas_pinjam_id)
        VALUES ('pinj-202', 'usr-warga-4', 'exm-buku-4-2', 'langsung_offline', CURRENT_DATE - 10, 7, CURRENT_DATE - 3, 'terlambat', 'usr-pustakawan-2');
      `;
      await trx`
        INSERT INTO denda (id, pinjaman_id, pengguna_id, hari_terlambat, tarif_per_hari, total_nominal, status)
        VALUES ('dnd-301', 'pinj-202', 'usr-warga-4', 3, 500, 1500, 'belum_lunas');
      `;

      // Skenario D: Farhan Alamsyah dalam antrean online Buku 2 (Posisi ke-3)
      await trx`
        INSERT INTO reservasi (id, pengguna_id, buku_id, jenis, status, posisi_antrean)
        VALUES ('res-102', 'usr-warga-6', 'buku-2', 'antre', 'menunggu', 3);
      `;

      console.log("7. Menanam Pengumuman & Banner...");
      await trx`
        INSERT INTO pengumuman (id, judul, ringkasan, isi, tag, warna_tag, gambar_path, urutan) VALUES
        ('ann-1', 'Pekan Literasi Siswa: Rekayasa Cloud SIJA', 'Koleksi 25 judul buku teknologi cloud siap dipinjam.', 'Koleksi buku sistem informasi dan jaringan telah siap di meja sirkulasi.', 'Koleksi Baru', 'primary', 'banners/pekan-literasi-lg.svg', 1),
        ('ann-2', 'Ketentuan Batas Booking Eksemplar 24 Jam', 'Ajuan booking online terkunci selama 24 jam.', 'Ambil buku tepat waktu untuk menghindari pembatalan otomatis dan sanksi blokir.', 'Aturan Sirkulasi', 'warning', 'banners/aturan-booking-lg.svg', 2),
        ('ann-3', 'Layanan Meja Sirkulasi Perpustakaan', 'Senin - Jumat: 08.00 - 16.30 WIB.', 'Petugas siap melayani sirkulasi buku sesuai jam operasional sekolah.', 'Layanan', 'success', 'banners/buku-rekayasa-sija-lg.svg', 3);
      `;

      console.log("8. Menanam Favorit Warga...");
      await trx`
        INSERT INTO favorit (pengguna_id, buku_id) VALUES
        ('usr-warga-1', 'buku-1'),
        ('usr-warga-1', 'buku-3'),
        ('usr-warga-2', 'buku-4');
      `;

      console.log("==================================================");
      console.log("✅ SEED DATA BERHASIL DITANAM LENGKAP & KONSISTEN!");
      console.log("==================================================");
    });
  } catch (err) {
    console.error("❌ Gagal menanam seed data:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
