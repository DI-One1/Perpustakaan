# Panduan Eksekusi Basis Data & Migrasi BILIK

Panduan ini menjelaskan cara menjalankan basis data PostgreSQL lokal (atau Supabase cloud), menjalankan migrasi skema murni dengan **dbmate**, serta menanam data seed pengujian.

---

## 1. Menjalankan PostgreSQL

### Opsi A: Menggunakan Docker Lokal (Rekomendasi Utama)
Jika Docker Desktop telah terpasang dan aktif di komputer:
```powershell
docker compose -f infra/docker-compose.dev.yml up -d
```
Periksa status kontainer:
```powershell
docker compose -f infra/docker-compose.dev.yml ps
```

### Opsi B: Menggunakan Supabase Cloud Free Tier (Alternatif Tanpa Docker)
1. Buat project gratis di [supabase.com](https://supabase.com).
2. Salin string koneksi **Transaction Pooler** (port 6543) atau **Session** (port 5432).
3. Salin ke file `frontend/.env`:
   ```env
   DATABASE_URL="postgres://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&prepare=false"
   ```

---

## 2. Menjalankan Migrasi Skema (`dbmate`)

Seluruh skema dikelola secara terpusat oleh **dbmate** di `infra/db/migrations/`:

* **Menerapkan Migrasi (Up):**
  ```powershell
  npm --prefix frontend run db:up
  ```
* **Membatalkan Migrasi (Down / Rollback):**
  ```powershell
  npm --prefix frontend run db:down
  ```

### Catatan Pembaruan Skema Lanjutan untuk Tim Backend
Sesuai [Spesifikasi Teknis Backend](spesifikasi-backend.md) dan [Standar Penamaan & Bahasa](penamaan-dan-bahasa.md), migrasi lanjutan sebelum produksi perlu menyelaraskan:
1. Penambahan tabel multi-role (`peran`, `pengguna_peran`) dan penanda eksklusif `is_admin_master`.
2. Penambahan kolom `deleted_at` (soft delete) dan `email_verified_at` pada tabel `pengguna`.
3. Penyesuaian enum `status_eksemplar` (`dibooking` $\rightarrow$ `direservasi`) dan `status_reservasi` (menambah `ditolak`).
4. Penambahan kolom `kode_commit`, `konteks_peran`, dan `pesan_commit` pada `audit_log` serta trigger proteksi *immutable*.
5. Pembuatan tabel modul **Stock Opname** (`opname_sesi`, `opname_detail`) dan **Antrean Email** (`antrean_email`).
6. Penambahan `CREATE POLICY` yang tepat untuk tabel yang mengaktifkan Row Level Security (RLS).

---

## 3. Menanam Data Seed Pengujian (`seed.js`)

Untuk mengisi database dengan master buku, eksemplar ber-barcode, admin, pustakawan, dan persona pengujian aturan sirkulasi:
```powershell
npm --prefix frontend run db:seed
```

### Persona Pengujian yang Dihasilkan:
1. **Pak Ridwan Santoso** (`usr-admin` / `ADMIN-001`): Admin Master sistem.
2. **Ibu Nurul Hidayah** (`usr-pustakawan-1` / `PUST-001`): Pustakawan operasional.
3. **Muhammad Fadhil** (`usr-warga-1` / `0061234567`): Warga dengan status pengajuan peminjaman siap diambil.
4. **Ahmad Dahlan** (`usr-warga-2` / `0061234568`): Warga bersih tanpa pinjaman maupun denda.
5. **Salma Zahira** (`usr-warga-3` / `0061234569`): Warga dengan pinjaman aktif sisa 2 hari jatuh tempo.
6. **Rian Pratama** (`usr-warga-4` / `0061234570`): Warga terlambat 3 hari dengan denda aktif Rp1.500.
7. **Bayu Saputra** (`usr-warga-5` / `0061234571`): Warga terblokir sementara (3x *no-show* pengajuan).
8. **Farhan Alamsyah** (`usr-warga-6` / `0061234572`): Warga dalam antrean daring FIFO.

*Password default akun simulasi:* `Bilik2026!`
