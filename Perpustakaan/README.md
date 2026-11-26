# BILIK - Basis Informasi & Literasi Islam Terpadu Kejuruan (Demo Proyek Akhir)

Aplikasi Perpustakaan Digital Fullstack dengan Next.js 15, Tailwind CSS v4, TypeScript, Prisma ORM, dan Supabase PostgreSQL.

---

## 🚀 Panduan Menjalankan Aplikasi

1. Masuk ke direktori proyek demo:
   ```bash
   cd Perpustakaan
   ```
2. Pastikan file `.env` sudah memuat koneksi Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` (Port 6543 / Transaction Pooler dengan pgbouncer=true)
   - `DIRECT_URL` (Port 5432 / Session Pooler)

3. Jalankan server development:
   ```bash
   npm run dev
   ```
4. Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 👥 Akun Demo Siap Pakai (Kata Sandi: `Bilik2026!`)

Pada halaman login (`/masuk`), telah disediakan tombol **1-Click Isi Akun Demo**:

| Peran | Nama | Nomor Induk | Catatan Skenario Demo |
|---|---|---|---|
| **Admin Master** | Pak Ridwan Santoso | `ADMIN-001` | Akses penuh dashboard, kelola akun admin, audit log |
| **Admin** | Ibu Nurul Hidayah | `ADM-002` | Petugas meja sirkulasi, opname, konfirmasi pinjam |
| **Warga 1** | Muhammad Fadhil | `0061234567` | Memiliki pengajuan buku aktif berstatus `siap_diambil` (BK-0001) |
| **Warga 2** | Salma Zahira | `0061234569` | Memiliki pinjaman aktif BK-0006 (Stok 0, untuk demo Antre FIFO) |
| **Warga 3** | Rian Pratama | `0061234570` | Memiliki pinjaman terlambat (BK-0007) untuk demo kalkulasi denda otomatis |
| **Warga 4** | Ahmad Dahlan | `0061234568` | Warga bersih tanpa pinjaman aktif |

---

## 🔄 Skenario Alur Kerja Presentasi (Workflow)

### 1. Peminjaman Online (Ajukan Peminjaman)
- Masuk sebagai **Ahmad Dahlan** (`0061234568`).
- Pilih buku dari Katalog Homepage, klik **Detail Buku**.
- Klik **Ajukan Peminjaman** (1 eksemplar terkunci dengan tenggat 24 jam).
- Cek tab **Pengajuan & Antrean** di menu profil (`/saya`).

### 2. Antrean FIFO Otomatis (Saat Stok Habis)
- Buka buku yang dipinjam oleh Salma (stok 0).
- Klik **Masuk Antrean Buku**. Warga akan masuk ke antrean nomor urut #1.
- Begitu buku tersebut dikembalikan oleh admin di meja sirkulasi, sub-rutin backend otomatis mempromosikan warga #1 menjadi pemegang alokasi (`siap_diambil`).

### 3. Meja Sirkulasi Admin (Pengambilan & Pengembalian)
- Masuk atau Switch ke **Mode Admin** (`/admin`).
- Buka tab **Meja Sirkulasi**:
  - **Konfirmasi Pinjam:** Masukkan NIS dan Barcode fisik (`BK-0001`), klik serahkan buku.
  - **Pengembalian:** Masukkan barcode buku yang dikembalikan (`BK-0007` milik Rian). Sistem langsung menghitung denda keterlambatan secara otomatis.

### 4. Perpanjangan Pinjaman
- Warga mengajukan perpanjangan di halaman `/saya` pada buku yang dipinjam.
- Admin membuka tab **Perpanjangan** di `/admin`, memilih durasi tambahan hari (+7 hari) dan klik **Setujui**.

### 5. Stock Opname & Fast-Scan Barcode
- Admin membuka tab **Stock Opname**.
- Buat sesi opname baru (contoh: "Opname Semester Gasal").
- Gunakan input **Fast-Scan Barcode** untuk memverifikasi eksemplar fisik di rak.
- Klik **Commit & Selesaikan Opname** dengan pesan commit wajib audit.

### 6. Audit Log Transaksi (Immutable ala Git)
- Admin membuka tab **Log Audit**.
- Seluruh transaksi (sirkulasi, denda, perubahan peran, stock opname) tercatat rapi secara kronologis dengan kode hash acak 8 karakter.
