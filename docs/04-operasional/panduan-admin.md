# Panduan Operasional Admin

**Status:** P1 - SOP Pengelola Perpustakaan & Sistem  
**Terakhir diperbarui:** 25 November 2026

Dokumen ini menggabungkan seluruh panduan operasional harian (Meja Sirkulasi, Stock Opname *Fast-Scan*, Denda) dan tugas manajerial Admin (CRUD Warga, Buka Blokir, Pengaturan Kebijakan, serta Audit Log) dalam satu peran terpadu **Admin** (dan **Admin Master**).

---

## 1. Meja Sirkulasi (`/admin/sirkulasi`)
1. **Klaim Pengajuan Daring (`reservasi_online`):**
   - Pindai/pilih kartu anggota warga dan pindai barcode fisik buku (`BK-xxxx`).
   - Pastikan barcode cocok dengan eksemplar yang direservasi untuk warga tersebut. Jika sistem menolak (`EKSEMPLAR_DIRESERVASI_ORANG_LAIN`), ambil unit lain yang `tersedia`.
2. **Peminjaman Langsung (`langsung_offline`):**
   - Pindai kartu anggota + barcode fisik buku berstatus `tersedia`.
   - Sistem otomatis memvalidasi bebas denda, tidak diblokir, dan kuota maksimal 1 buku aktif.
3. **Pengembalian Buku:**
   - Pindai barcode buku dan pilih kondisi fisik (`baik`, `rusak`, `hilang`).
   - Jika terlambat, denda Rp500/hari/buku diterbitkan otomatis ke akun warga.
4. **Konfirmasi Perpanjangan:**
   - Buka daftar ajuan perpanjangan, tinjau alasan warga, setujui sesuai ajuan atau ubah jumlah hari dengan stepper `-`/`+`, atau tolak dengan alasan wajib + `pesan_commit`.

---

## 2. Stock Opname *Fast-Scan & Commit* (`/admin/opname`)
1. Buat sesi opname baru (`semua` atau per `kategori`).
2. Gunakan mode *Fast-Scan* untuk memindai barcode seluruh buku di rak secara beruntun.
3. Tinjau daftar selisih (*Diff*): **Sesuai**, **Rusak/Salah Lokasi**, dan **Hilang**.
4. Klik **Commit Opname** dan isi `pesan_commit` (misal: `"Opname akhir semester ganjil 2026"`) untuk memperbarui status eksemplar secara atomik.

---

## 3. Denda, Anggota, Kebijakan, & Audit Log
- **Denda:** Terima pelunasan penuh tunai di meja, atau lakukan koreksi/pembebasan tunggal maupun *batch* multi-warga dengan `pesan_commit`.
- **Anggota & Hybrid Delete:** Gunakan *Soft Delete* untuk warga yang sudah lulus/pindah atau punya riwayat pinjam/denda; gunakan *Hard Delete* hanya untuk akun salah buat yang belum punya transaksi sama sekali.
- **Admin Master:** Pengelolaan akun `admin` lain (tambah/cabut peran `admin`) hanya tersedia di menu eksklusif **Kelola Admin**.
- **Audit Log:** Bersifat *immutable* (hanya baca); tidak dapat diubah atau dihapus oleh siapa pun.
