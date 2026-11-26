# Spesifikasi Teknis Backend BILIK (Backend Technical Specification)

**Status:** P1 — Acuan Resmi Tim Backend (Framework-Agnostic)  
**Terakhir diperbarui:** 25 November 2026

Dokumen ini merupakan pedoman teknis lengkap untuk implementasi backend permanen BILIK (terlepas dari framework atau bahasa backend yang dipilih, serta menjadi acuan penyelarasan prototipe Next.js). Tim Backend tidak perlu menebak aturan bisnis, struktur role, transisi status, maupun standar audit log.

---

## 1. Arsitektur Identitas, Role, & Permission Matrix

### 1.1 Prinsip Identitas Tunggal (*One Identity, Multiple Workspaces*)
- Setiap pengguna hanya memiliki **1 akun tunggal** di tabel `pengguna`.
- Seorang pengguna dapat memiliki lebih dari satu peran (*multi-role* via tabel relasi `pengguna_peran`).
- Seluruh staf (`admin`, `admin_master`) otomatis memiliki akses **Mode Warga** dan tunduk pada aturan kelayakan peminjaman yang sama saat meminjam buku sebagai anggota.
- Backend wajib memvalidasi izin (*permission*) di setiap endpoint berdasarkan role pengguna yang sedang aktif pada sesi, bukan sekadar mengandalkan penyembunyian tombol di UI.

### 1.2 Peran Resmi Sistem (Disederhanakan: Warga & Admin)

> **Keputusan Arsitektur:** Peran `pustakawan` resmi dihapus/digabungkan ke dalam peran `admin` agar tata kelola sekolah lebih ringkas tanpa duplikasi. Seluruh tugas operasional meja sirkulasi, katalog, denda, dan stock opname dijalankan oleh `admin`.

| Peran (`kode_peran`) | Ruang Lingkup & Kewenangan | Batasan Kritis |
|---|---|---|
| **`warga`** | Katalog, favorit, rating/ulasan, pengajuan peminjaman, antrean FIFO, perpanjangan mandiri, profil & notifikasi pribadi. | Tidak dapat mengakses endpoint admin/manajemen. |
| **`admin`** | *Full Operational & Data CRUD*: CRUD master buku, kategori, eksemplar & barcode, seluruh layanan meja sirkulasi (pinjam, kembali, pembatalan, perpanjangan), koreksi/pelunasan denda, Stock Opname, CRUD akun warga, buka blokir sanksi, pengaturan kebijakan sistem, lihat seluruh audit log & commit history. | **TIDAK DAPAT** mengelola, mengubah role, atau menghapus akun `admin` lain maupun `admin_master`. **TIDAK DAPAT** mengubah/menghapus `log_audit` dan `commit`. |
| **`admin_master`** | *Highest Authority*: 1 akun utama bawaan sistem. Memiliki seluruh wewenang `admin` + **halaman/endpoint eksklusif CRUD & pencabutan hak akun `admin` lainnya**. | Kebal terhadap penghapusan/penurunan role oleh akun mana pun. Tetap **TIDAK DAPAT** mengubah/menghapus `log_audit` dan `commit`. |

### 1.3 Matriks Permission Granular

| Area / Resource | `warga` | `admin` | `admin_master` |
|---|---|---|---|
| Katalog, Detail, Favorit, Rating, Ulasan | ✅ | ✅ (Mode Warga) | ✅ (Mode Warga) |
| Pengajuan Pinjam, Antrean, Perpanjangan Pribadi | ✅ | ✅ (Mode Warga) | ✅ (Mode Warga) |
| CRUD Buku, Kategori, Eksemplar, Barcode | ❌ | ✅ | ✅ |
| Sirkulasi Meja (Pinjam, Kembali, Pembatalan, Perpanjangan) | ❌ | ✅ | ✅ |
| CRUD / Koreksi / Pelunasan / Pembebasan Denda | ❌ | ✅ | ✅ |
| Stock Opname (Sesi, Fast-Scan, Commit) | ❌ | ✅ | ✅ |
| CRUD Akun Warga & Buka Blokir Sanksi | ❌ | ✅ | ✅ |
| Pengaturan Kebijakan Sistem (Tarif, Kuota, Jam) | ❌ | ✅ | ✅ |
| Audit Log & Commit History (Seluruh Sistem) | ❌ | ✅ | ✅ |
| CRUD Akun `admin` & Pemberian/Pencabutan Role Admin | ❌ | ❌ | ✅ (Eksklusif) |
| Ubah / Hapus Baris `log_audit` & `commit` | ❌ | ❌ | ❌ (Dilarang Mutlak) |

---

## 2. Kebijakan Penghapusan Akun (Hybrid Delete)

- **Soft Delete (`deleted_at` diisi timestamp):** Wajib digunakan untuk akun warga yang sudah lulus/keluar atau akun yang **sudah pernah memiliki histori transaksi** (pinjaman, reservasi, denda, atau audit log). Menjaga integritas `FOREIGN KEY` dan jejak historis.
- **Hard Delete (Hapus Permanen):** Diperbolehkan **hanya** untuk akun yang salah dibuat (typo/duplikat) dan **belum pernah** memiliki transaksi atau jejak operasional apa pun.
- Seluruh aksi penghapusan wajib dicatat dalam `log_audit` lengkap dengan alasan commit.

---

## 3. State Machine & Transisi Status Resmi (Bahasa Indonesia)

Seluruh status wajib menggunakan enum Bahasa Indonesia `snake_case` yang konsisten.

### 3.1 Eksemplar Fisik (`status_eksemplar`)
- `tersedia` $\rightarrow$ `direservasi` (saat dialokasikan ke pengajuan daring atau promosi antrean)
- `tersedia` $\rightarrow$ `dipinjam` (saat peminjaman langsung di meja)
- `direservasi` $\rightarrow$ `dipinjam` (saat warga mengklaim di meja sirkulasi)
- `direservasi` $\rightarrow$ `tersedia` (saat batal/kedaluwarsa & tidak ada antrean)
- `direservasi` $\rightarrow$ `rusak` (saat petugas membatalkan karena fisik rusak)
- `dipinjam` $\rightarrow$ `tersedia` / `rusak` / `hilang` (saat pengembalian atau opname)
- `tersedia` / `rusak` / `hilang` $\leftrightarrow$ diperbarui melalui **Stock Opname Commit** atau manajemen inventaris.

### 3.2 Pengajuan & Antrean (`status_reservasi`)
- Jenis `pengajuan`:
  - `siap_diambil` (otomatis mengunci 1 eksemplar `direservasi` + tenggat 24 jam)
  - `siap_diambil` $\rightarrow$ `selesai` (dikonfirmasi menjadi pinjaman di meja)
  - `siap_diambil` $\rightarrow$ `batal` (dibatalkan warga atau petugas dengan alasan `rusak`/`lainnya`)
  - `siap_diambil` $\rightarrow$ `ditolak` (ditolak petugas dengan alasan resmi)
  - `siap_diambil` $\rightarrow$ `kedaluwarsa` (melewati 24 jam via Cron Job $\rightarrow$ catat poin *no-show*)
- Jenis `antre`:
  - `menunggu` (urutan antrean FIFO)
  - `menunggu` $\rightarrow$ `siap_diambil` (dipromosikan otomatis secara atomik saat ada eksemplar layak bebas)
  - `menunggu` $\rightarrow$ `batal` (dibatalkan warga)

### 3.3 Pinjaman (`status_pinjaman`)
- `aktif` $\rightarrow$ `terlambat` (otomatis oleh Cron Job harian saat `CURRENT_DATE > tanggal_jatuh_tempo`)
- `aktif` / `terlambat` $\rightarrow$ `selesai` (saat dikembalikan fisik di meja petugas; jika `terlambat`, otomatis terbitkan baris di tabel `denda`).

### 3.4 Ajuan Perpanjangan (`status_ajuan_perpanjangan`)
- `menunggu` $\rightarrow$ `disetujui` (oleh petugas; `durasi_hari_disetujui` bisa sama atau diubah manual oleh petugas $\rightarrow$ otomatis menambah `tanggal_jatuh_tempo` pinjaman)
- `menunggu` $\rightarrow$ `ditolak` (oleh petugas dengan alasan catatan).

---

## 4. Standar Audit Log & Sistem Commit (Ala Git)

Seluruh perubahan data sensitif, koreksi transaksi, pembatalan petugas, persetujuan/penolakan perpanjangan, perubahan denda (termasuk batch multi-warga), perubahan role, dan pengesahan Stock Opname **wajib** menggunakan mekanisme **Commit**:

### 4.1 Struktur Tabel `log_audit` / `log_commit`
Setiap baris commit wajib menyimpan:
1. `id` (UUID) & `kode_commit` (misal hash pendek 8 karakter unik seperti `7a8f1c2d`).
2. `pengguna_id` (aktor yang melakukan eksekusi).
3. `konteks_peran` (`warga`, `admin`, `admin_master`, atau `sistem_cron`).
4. `aksi` (kode aksi standar, misal: `KONFIRMASI_PERPANJANGAN`, `KOREKSI_DENDA_MASSAL`, `COMMIT_OPNAME`, `CABUT_PERAN`).
5. `pesan_commit` (teks wajib dari petugas/sistem yang menjelaskan alasan perubahan).
6. `tabel` & `entitas_id` (objek target perubahan).
7. `data_lama` (JSONB) & `data_baru` (JSONB) sebagai *Diff Record*.
8. `created_at` (timestamp server).

### 4.2 Prinsip Konsistensi & Atomisitas Transaksi
- Setiap endpoint yang mengubah status lintas tabel (contoh: serah terima buku, pengembalian + denda + promosi antrean, atau commit opname) **WAJIB** dibungkus dalam satu `DATABASE TRANSACTION` (`BEGIN ... COMMIT / ROLLBACK`).
- Gunakan penguncian baris pesimis (`SELECT ... FOR UPDATE SKIP LOCKED` atau `FOR UPDATE`) saat mengalokasikan eksemplar atau mempromosikan antrean #1 agar bebas dari *race condition*.
- **Immutability:** Berikan proteksi trigger atau pencabutan hak akses SQL (`REVOKE UPDATE, DELETE ON log_audit`) agar tidak ada satu pun user atau aplikasi yang bisa menghapus atau mengubah catatan sejarah audit.

---

## 5. Standar Modul Stock Opname (*Fast-Scan & Commit*)

Untuk mendukung Stock Opname yang nyaman dan akurat:
1. **Tabel `opname_sesi`**: `id`, `kode_sesi`, `judul`, `cakupan` (`semua` / `kategori`), `kategori_id`, `status` (`draf`, `berjalan`, `selesai_commit`, `dibatalkan`), `petugas_id`, `pesan_commit`, `dibuat_pada`, `disahkan_pada`.
2. **Tabel `opname_detail`**: `id`, `sesi_id`, `eksemplar_id`, `status_sistem_awal`, `status_fisik_temuan` (`cocok`, `rusak`, `hilang`, `salah_lokasi`), `sudah_dipindai` (boolean), `dipindai_pada`.
3. **Alur Kerja Backend:**
   - Buka Sesi $\rightarrow$ Mengambil snapshot seluruh eksemplar sesuai cakupan.
   - Fast-Scan Barcode (`POST /api/v1/staf/opname/{id}/pindai`) $\rightarrow$ Menandai `sudah_dipindai = true` secara cepat per barcode.
   - Tinjau Selisih (*Diff*) $\rightarrow$ Mengembalikan 3 kelompok: Sesuai, Kondisi Berubah (Rusak), dan Tidak Ditemukan (Hilang).
   - Pengesahan (*Commit Opname*) $\rightarrow$ Memperbarui status tabel `eksemplar` secara massal dalam 1 transaksi database + menulis 1 entri `log_audit` lengkap dengan `pesan_commit`.

---

## 6. Sistem Notifikasi & Cron Job Otomatis

### 6.1 Kebijakan Saluran
- **Warga:** Notifikasi *In-App* + *Email* (hanya dikirim ke alamat email terverifikasi dan menghormati preferensi kategori notifikasi di profil warga).
- **Admin:** Notifikasi *In-App* saja (tanpa email).

### 6.2 Idempotensi & Ketahanan Email
- Kegagalan pengiriman email SMTP/API **tidak boleh membatalkan transaksi bisnis utama**.
- Catat status pengiriman email di tabel `antrean_email` (`antre_kirim`, `terkirim`, `gagal`, `coba_ulang`) dengan `kunci_idempoten` (misal `event_type:entity_id`) agar tidak terjadi pengiriman ganda.

### 6.3 Tugas Latar Belakang (*Scheduled Cron Jobs*)
1. **Job Kedaluwarsa Pengajuan (tiap 5 menit):** Cek `reservasi` `siap_diambil` yang melewati `waktu_tenggat` $\rightarrow$ ubah ke `kedaluwarsa` $\rightarrow$ tambah counter `no_show` $\rightarrow$ terapkan blokir 7 hari bila mencapai 3x dalam 30 hari $\rightarrow$ lepas eksemplar & promosikan antrean `#1`.
2. **Job Keterlambatan & Denda Harian (tiap hari pukul 00:05 WIB):** Cek pinjaman `aktif` yang lewat `tanggal_jatuh_tempo` $\rightarrow$ ubah status menjadi `terlambat` $\rightarrow$ kirim notifikasi. Nominal denda dihitung dinamis `selisih_hari * 500` dan dikunci ke tabel `denda` saat buku dikembalikan.
3. **Job Pengingat (tiap 1 jam):** Kirim pengingat 6 jam sebelum batas pengambilan 24 jam berakhir, dan H-1 sebelum tanggal jatuh tempo pengembalian.

---

## 7. Catatan Teknis Keamanan Database (RLS & Auth)

1. **Verifikasi Sesi Wajib:** Seluruh endpoint non-publik wajib memvalidasi token sesi `httpOnly` dari tabel `sesi` di backend. Dilarang memercayai header `x-user-id` dari klien di lingkungan produksi.
2. **Kebijakan Row Level Security (RLS):** Jika migrasi database mengaktifkan `ENABLE ROW LEVEL SECURITY`, pastikan setiap tabel memiliki `CREATE POLICY` yang eksplisit atau koneksi backend menggunakan peran database dengan hak `BYPASSRLS` yang terkontrol ketat di server.
