# Konteks SMK TI BAZMA dan Ruang Lingkup Proyek BILIK

Terakhir diperbarui: 25 November 2026

## 1. Ringkasan Proyek

- **Nama Platform:** BILIK (Basis Informasi & Literasi Islam Terpadu Kejuruan)
- **Klien:** Yayasan BAZMA Pertamina
- **Tujuan:** Membangun platform perpustakaan digital modern yang menggabungkan pengalaman pemustaka ala e-commerce dengan sistem operasional meja sirkulasi fisik berbasis barcode, antrean FIFO, denda terukur, stock opname, dan audit log transparan.
- **Pengguna:** ±500 Siswa, Guru, Staf, Pustakawan, dan Administrator di lingkungan SMK TI BAZMA.
- **Tahap Implementasi (V1):** Berfokus penuh pada **satu institusi (SMK TI BAZMA)**. Fitur multi-tenant / billing SaaS antar-sekolah berada di luar cakupan V1.

---

## 2. Profil Sekolah (SMK TI BAZMA)

- **Status:** Sekolah Teknologi Informasi berasrama (*boarding school*) bebas biaya untuk dhuafa.
- **Kompetensi Keahlian:** SIJA (Sistem Informatika, Jaringan, dan Aplikasi) — Program 4 Tahun.
- **Lokasi:** Ciampea, Bogor, Jawa Barat.
- **Filosofi:** *"Menebar Manfaat"*
- **Implikasi Desain & Teknis:**
  - Mayoritas siswa mengakses layanan lewat perangkat mobile/tablet di asrama, sehingga antarmuka wajib *mobile-first*, ringan, dan bebas *overflow*.
  - Desain visual bersih, profesional, dan menggunakan identitas resmi Navy Institutional BAZMA (`#132B6D`).

---

## 3. Ruang Lingkup Fitur Utama V1

1. **Pengalaman Warga (Pemustaka):**
   - Beranda, katalog buku, pencarian, filter kategori, detail buku, favorit, rating, dan ulasan.
   - **Pengajuan Peminjaman** daring (mengunci 1 eksemplar fisik spesifik selama 24 jam dengan *countdown* real-time).
   - **Antre Buku (FIFO)** saat seluruh eksemplar habis/direservasi.
   - **Perpanjangan Pinjaman Mandiri** (diajukan kapan saja dengan alasan wajib; disetujui, diubah harinya, atau ditolak oleh petugas via tautan notifikasi/email).
   - Pemantauan pinjaman aktif, jatuh tempo, denda, serta kartu anggota digital (NISN/NIP).
2. **Workspace Pustakawan (Operasional Luas):**
   - Meja Sirkulasi Terpadu (validasi ganda kartu anggota + scan barcode buku fisik `BK-xxxx`).
   - Proteksi tabrakan alokasi (menolak mutlak jika eksemplar sedang direservasi warga lain).
   - Pengembalian buku, pemeriksaan kondisi fisik, konfirmasi pelunasan denda manual, dan koreksi denda dengan pesan commit.
   - CRUD penuh data master buku, kategori, dan eksemplar.
   - **Stock Opname Fast-Scan** (Scan $\rightarrow$ Tinjau Selisih $\rightarrow$ Commit).
3. **Workspace Admin & Admin Master:**
   - Akses penuh operasional Pustakawan ditambah CRUD seluruh data sistem (pengguna, denda, pengaturan kebijakan).
   - **Admin Master** memiliki hak eksklusif mengelola akun Admin lainnya dan kebal dihapus.
   - Pemantauan **Audit Log & Commit History** yang bersifat *immutable* (tidak dapat diedit/dihapus siapa pun).
4. **Sistem Notifikasi & Otomasi:**
   - Warga: Notifikasi *in-app* dan *email* (dengan preferensi & verifikasi email).
   - Pustakawan & Admin: Notifikasi *in-app* saja (tanpa email).
   - Otomasi latar belakang (*Cron Job*) untuk kedaluwarsa 24 jam, promosi antrean FIFO, penghitungan denda harian Rp500, dan pengiriman pengingat.
