# Workflow Peran & Arsitektur Backend Super Detail (BILIK)

**Status:** P1 - Acuan Resmi Tim Backend (Framework-Agnostic)  
**Terakhir diperbarui:** 25 November 2026  
**Model Peran Resmi:** **2 Peran Utama (`warga` dan `admin`)** + 1 Otoritas Tertinggi (`admin_master`)  
*(Catatan Arsitektur: Peran `pustakawan` resmi dihapus dan seluruh fungsi operasionalnya digabungkan ke dalam peran `admin` untuk menyederhanakan tata kelola sekolah).*

Dokumen ini memetakan secara rinci seluruh alur kerja (*workflow*), batasan kewenangan, validasi backend, transisi status (*state machine*), transaksi database atomik, hingga pencatatan *audit log* ala Git bagi Tim Backend agar tidak ada satu pun aturan bisnis yang perlu ditebak saat implementasi.

---

## 1. Arsitektur Identitas, Peran, & Perpindahan Mode

### 1.1 Prinsip Identitas Tunggal (*One Identity, Multiple Contexts*)
1. Setiap pengguna hanya memiliki **1 akun tunggal** di tabel `pengguna` (tidak ada akun ganda antara staf dan pemustaka).
2. Hubungan akun dan peran disimpan pada tabel relasi `pengguna_peran` (`pengguna_id`, `peran_id`).
3. Daftar kode peran resmi (`peran.kode_peran`):
   - `warga`: Siswa, guru, dan staf sekolah sebagai pemustaka.
   - `admin`: Pengelola operasional dan manajerial perpustakaan (mengambil alih seluruh tugas sirkulasi, katalog, denda, stock opname, manajemen warga, kebijakan sistem, dan audit log).
   - `admin_master`: 1 akun pemilik sistem bawaan. Memiliki seluruh kewenangan `admin` ditambah hak eksklusif mengelola akun `admin` lain (tambah, edit, cabut peran).
4. **Aturan Mode Warga untuk Admin:**
   - Setiap akun `admin` dan `admin_master` otomatis memiliki akses **Mode Warga**.
   - Ketika seorang `admin` ingin meminjam buku untuk kebutuhan pribadi, ia **wajib** menggunakan endpoint/konteks **Mode Warga** dan tunduk pada seluruh aturan kelayakan Warga (maksimal 1 buku aktif, denda Rp500/hari, dan sanksi *no-show* 24 jam).
   - Admin **dilarang** melakukan *self-approval* atau mengesahkan transaksi pinjam/kembali/perpanjangan/bebas denda untuk dirinya sendiri di meja sirkulasi jika tersedia admin lain, dan setiap transaksi tetap tercatat lengkap di `log_audit`.

### 1.2 Mekanisme Autentikasi & Otorisasi Endpoint
1. **Verifikasi Sesi Wajib:**
   - Autentikasi menggunakan sesi berbasis cookie `httpOnly` (misal `bilik_session`) yang diverifikasi terhadap tabel `sesi` di backend.
   - **Dilarang keras** memercayai header `x-user-id` atau parameter role dari klien di lingkungan produksi.
2. **Alur Middleware Otorisasi Backend (Setiap Request Non-Publik):**
   1. Validasi token cookie `httpOnly` di tabel `sesi` (`kedaluwarsa_pada > NOW()`). Jika tidak valid/kedaluwarsa $\rightarrow$ HTTP `401 Unauthorized` (`SESI_TIDAK_VALID`).
   2. Ambil data `pengguna` beserta daftar `kode_peran` aktif.
   3. Pastikan `pengguna.deleted_at IS NULL`. Jika akun sudah di-*soft delete* $\rightarrow$ HTTP `403 Forbidden` (`AKUN_DINONAKTIFKAN`).
   4. Cek prefix rute dan izin peran:
      - Rute `/api/v1/warga/*` atau `/api/v1/reservasi/*` atau `/api/v1/pinjaman/*`: Terbuka untuk semua pengguna terautentikasi (dalam kapasitas **Mode Warga**).
      - Rute `/api/v1/admin/*`: Wajib memiliki peran `admin` atau `admin_master`. Jika hanya `warga` $\rightarrow$ HTTP `403 Forbidden` (`AKSES_DITOLAK`).
      - Rute `/api/v1/admin-master/*`: Wajib memiliki peran `admin_master`. Jika `admin` biasa mencoba mengakses $\rightarrow$ HTTP `403 Forbidden` (`KHUSUS_ADMIN_MASTER`).
   5. Untuk mutasi sensitif oleh `admin`/`admin_master`, validasi keberadaan field `pesan_commit` (minimal 5 karakter, tidak boleh kosong).

---

## 2. Matriks Kewenangan Granular (RBAC)

| Modul / Aksi Backend | `warga` | `admin` | `admin_master` | Keterangan & Kewajiban Commit |
|---|---|---|---|---|
| **Katalog, Detail Buku, Rating, Ulasan, Favorit** | ✅ | ✅ (Mode Warga) | ✅ (Mode Warga) | Ulasan hanya untuk buku yang relevan dengan akun. |
| **Pengajuan Pinjam, Antrean FIFO, Batal Sendiri** | ✅ | ✅ (Mode Warga) | ✅ (Mode Warga) | Terikat *Single-Item Rule* (maks 1 aktif). |
| **Ajukan Perpanjangan Pinjaman Pribadi** | ✅ | ✅ (Mode Warga) | ✅ (Mode Warga) | Wajib bebas denda & isi alasan. |
| **CRUD Master Buku, Kategori, Eksemplar, Barcode** | ❌ | ✅ | ✅ | Hapus buku/eksemplar wajib cek histori aktif + `pesan_commit`. |
| **Meja Sirkulasi (Serah Terima, Pinjam Langsung, Kembali)** | ❌ | ✅ | ✅ | Transaksi DB atomik + `FOR UPDATE`. |
| **Tolak / Batalkan Pengajuan Warga** | ❌ | ✅ | ✅ | Wajib alasan (`rusak`/`lainnya`) + `pesan_commit`. |
| **Konfirmasi / Ubah Hari / Tolak Perpanjangan** | ❌ | ✅ | ✅ | Wajib `pesan_commit` ke `log_audit`. |
| **Pelunasan, Koreksi Nominal, Pembebasan Denda (Tunggal & Batch)** | ❌ | ✅ | ✅ | Wajib `pesan_commit` ke `log_audit`. |
| **Stock Opname (Buat Sesi, Fast-Scan, Review Diff, Commit)** | ❌ | ✅ | ✅ | Commit mengupdate massal eksemplar + 1 `log_audit`. |
| **CRUD Akun Warga & Buka Blokir Sanksi Permanen** | ❌ | ✅ | ✅ | Hybrid Delete (Soft/Hard) + `pesan_commit`. |
| **Pengaturan Kebijakan Sistem (Tarif, Durasi, Kuota)** | ❌ | ✅ | ✅ | Wajib `pesan_commit` + snapshot `data_lama`/`data_baru`. |
| **Lihat Seluruh Audit Log & Riwayat Commit** | ❌ | ✅ | ✅ | Hanya baca (*Read-Only*). |
| **CRUD Akun `admin` & Beri/Cabut Role `admin`** | ❌ | ❌ | ✅ (Eksklusif) | `admin` biasa tidak bisa menyentuh akun `admin` lain. |
| **Ubah / Hapus Baris `log_audit`** | ❌ | ❌ | ❌ (Dilarang Mutlak) | Dilindungi `REVOKE UPDATE, DELETE` & Trigger DB. |

---

## 3. State Machine & Transisi Status Resmi

Seluruh enum database, payload JSON, dan logika backend **wajib menggunakan 100% Bahasa Indonesia (`snake_case`)**.

### 3.1 Eksemplar Fisik (`status_eksemplar`)
- `tersedia` $\rightarrow$ `direservasi`: Saat dialokasikan ke pengajuan daring warga atau promosi antrean `#1`.
- `tersedia` $\rightarrow$ `dipinjam`: Saat peminjaman langsung (*offline*) di meja sirkulasi.
- `direservasi` $\rightarrow$ `dipinjam`: Saat warga mengklaim pengajuan daring di meja sirkulasi (barcode `BK-xxxx` cocok).
- `direservasi` $\rightarrow$ `tersedia`: Saat dibatalkan/ditolak/kedaluwarsa dan **tidak ada** antrean menunggu.
- `direservasi` $\rightarrow$ `rusak`: Saat Admin membatalkan pengajuan karena fisik buku ternyata rusak (tidak memicu promosi antrean pada unit ini).
- `dipinjam` $\rightarrow$ `tersedia`: Saat dikembalikan dalam kondisi `baik` (jika ada antrean `#1`, dalam transaksi yang sama langsung berubah menjadi `direservasi`).
- `dipinjam` $\rightarrow$ `rusak` / `hilang`: Saat dikembalikan dalam kondisi `rusak`/`hilang` atau saat Stock Opname.
- `tersedia` / `rusak` / `hilang`: Dapat diperbarui melalui modul inventaris atau **Commit Stock Opname**.

### 3.2 Reservasi: Pengajuan & Antrean (`status_reservasi`)
- **Jenis `pengajuan` (mengunci 1 eksemplar spesifik):**
  - Dibuat langsung berstatus `siap_diambil` (`waktu_tenggat = NOW() + 24 jam`).
  - `siap_diambil` $\rightarrow$ `selesai`: Klaim fisik dikonfirmasi Admin di meja sirkulasi.
  - `siap_diambil` $\rightarrow$ `batal`: Dibatalkan oleh Warga sendiri atau oleh Admin (`rusak` / `lainnya`).
  - `siap_diambil` $\rightarrow$ `ditolak`: Ditolak oleh Admin dengan alasan resmi.
  - `siap_diambil` $\rightarrow$ `kedaluwarsa`: Melewati `waktu_tenggat` 24 jam (dievaluasi oleh Cron Job).
- **Jenis `antre` (antrean FIFO tanpa mengunci eksemplar):**
  - Dibuat berstatus `menunggu`.
  - `menunggu` $\rightarrow$ `siap_diambil`: Dipromosikan otomatis secara atomik oleh sistem ketika 1 eksemplar layak menjadi bebas.
  - `menunggu` $\rightarrow$ `batal`: Dibatalkan oleh Warga sebelum dipromosikan.

### 3.3 Pinjaman (`status_pinjaman`)
- Dibuat berstatus `aktif` (`tanggal_jatuh_tempo = tanggal_pinjam + durasi_hari`, default 7 hari).
- `aktif` $\rightarrow$ `terlambat`: Diubah otomatis oleh Cron Job harian (pukul 00:05 WIB) jika `CURRENT_DATE > tanggal_jatuh_tempo`.
- `aktif` / `terlambat` $\rightarrow$ `selesai`: Saat buku dikembalikan fisik di meja Admin.

### 3.4 Ajuan Perpanjangan (`status_ajuan_perpanjangan`)
- Dibuat berstatus `menunggu`.
- `menunggu` $\rightarrow$ `disetujui`: Oleh Admin (`durasi_hari_disetujui` boleh sama atau diubah manual oleh Admin).
- `menunggu` $\rightarrow$ `ditolak`: Oleh Admin dengan catatan alasan.

### 3.5 Denda (`status_denda`) & Stock Opname (`status_opname`)
- **Denda:** `belum_lunas` $\rightarrow$ `lunas` (pelunasan penuh tunai di meja) ATAU `belum_lunas` $\rightarrow$ `dibebaskan` (oleh Admin dengan `pesan_commit`).
- **Stock Opname:** `draf` $\rightarrow$ `berjalan` $\rightarrow$ `selesai_commit` (final, mengubah tabel `eksemplar`) atau `dibatalkan`.

---

## 4. Workflow Backend Super Detail per Peran

### 4.1 Workflow Peran `warga` (dan `admin` saat Mode Warga)

#### A. Pengajuan Peminjaman Daring (`POST /api/v1/reservasi/pengajuan`)
1. **Validasi Kelayakan Warga (Berurutan):**
   - Cek status blokir akun (`status_blokir`):
     - Jika `blokir_sementara` dan `blokir_hingga > NOW()` $\rightarrow$ tolak HTTP `403` (`AKUN_TERBLOKIR_SEMENTARA`).
     - Jika `blokir_permanen` $\rightarrow$ tolak HTTP `403` (`AKUN_TERBLOKIR_PERMANEN`).
   - Cek denda aktif: `SELECT COUNT(*) FROM denda WHERE pengguna_id = $1 AND status = 'belum_lunas' AND nominal > 0`. Jika > 0 $\rightarrow$ tolak HTTP `403` (`DENDA_BELUM_LUNAS`).
   - Cek *Single-Item Rule*: Hitung total (`pinjaman` `aktif`/`terlambat`) + (`reservasi` `siap_diambil`/`menunggu`). Jika >= 1 $\rightarrow$ tolak HTTP `409` (`KUOTA_PINJAM_PENUH`).
2. **Transaksi Database Atomik (`BEGIN ... COMMIT`):**
   - Cari 1 eksemplar fisik yang layak untuk `buku_id` target dengan penguncian baris:
     ```sql
     SELECT id, kode_barcode FROM eksemplar
     WHERE buku_id = $1 AND status = 'tersedia' AND deleted_at IS NULL
     ORDER BY id ASC
     LIMIT 1
     FOR UPDATE SKIP LOCKED;
     ```
   - Jika tidak ditemukan baris $\rightarrow$ `ROLLBACK` dan kembalikan HTTP `409` (`STOK_TIDAK_TERSEDIA`, arahkan UI ke tombol Antre Buku).
   - Ubah `eksemplar.status = 'direservasi'`.
   - Buat baris `reservasi` (`jenis = 'pengajuan'`, `eksemplar_id`, `kode_reservasi = 'RSV-...'`, `status = 'siap_diambil'`, `waktu_tenggat = NOW() + INTERVAL '24 hours'`).
   - Catat ke `antrean_email` (idempoten) untuk email konfirmasi pengajuan + buat notifikasi *In-App* untuk Warga dan Admin.
   - `COMMIT`.

#### B. Masuk Antrean FIFO (`POST /api/v1/reservasi/antre`)
1. Jalankan validasi kelayakan Warga yang sama (tidak terblokir, bebas denda, *Single-Item Rule* = 0).
2. Cek jumlah eksemplar `tersedia` untuk `buku_id` tersebut. Jika masih ada yang `tersedia` (> 0) $\rightarrow$ tolak HTTP `409` (`STOK_MASIH_TERSEDIA`, warga harus mengajukan pinjaman langsung).
3. Hitung kapasitas antrean aktif (`status = 'menunggu'`) untuk `buku_id`:
   - Total eksemplar layak (`tersedia` + `direservasi` + `dipinjam`) 1–5 $\rightarrow$ batas maksimal antrean **3**.
   - Total eksemplar layak 6+ $\rightarrow$ batas maksimal antrean **5**.
   - Jika sudah penuh $\rightarrow$ tolak HTTP `409` (`ANTREAN_PENUH`).
4. Insert baris `reservasi` (`jenis = 'antre'`, `eksemplar_id = NULL`, `status = 'menunggu'`).

#### C. Pembatalan oleh Warga (`POST /api/v1/reservasi/{id}/batal`)
1. Pastikan `reservasi.pengguna_id == sesi.pengguna_id` dan statusnya `siap_diambil` atau `menunggu`.
2. Dalam 1 transaksi DB (`BEGIN ... COMMIT`):
   - Ubah `reservasi.status = 'batal'`, `alasan_batal = 'batal_warga'`.
   - Jika sebelumnya `siap_diambil` (punya `eksemplar_id`):
     - Kunci baris `eksemplar` (`FOR UPDATE`).
     - Jalankan **Sub-rutin Promosi Antrean FIFO** (lihat Bagian 4.4) untuk `buku_id` tersebut: jika ada antrean `#1` (`menunggu`), langsung alokasikan eksemplar tersebut ke antrean `#1`; jika tidak ada antrean, ubah `eksemplar.status = 'tersedia'`.

#### D. Pengajuan Perpanjangan Mandiri (`POST /api/v1/pinjaman/{id}/perpanjangan`)
1. Boleh diajukan **kapan saja** selama pinjaman berstatus `aktif` (atau `terlambat`? Catatan: hanya saat `aktif` dan **bebas denda**; jika sudah `terlambat`, warga harus mengembalikan fisik ke meja Admin).
2. Pastikan tidak ada ajuan perpanjangan lain yang masih `menunggu` pada `pinjaman_id` yang sama.
3. Wajib menerima `durasi_hari_diminta` (integer > 0) dan `alasan` (string non-kosong).
4. **Tetap diizinkan** meskipun ada antrean FIFO pada buku tersebut (karena keputusan akhir ada di tangan Admin).
5. Insert `ajuan_perpanjangan` (`status = 'menunggu'`) dan kirim notifikasi *In-App* ke Admin (disertai deep-link ke halaman konfirmasi perpanjangan).

---

### 4.2 Workflow Peran `admin` (Operasional Sirkulasi & Inventaris)

#### A. Meja Sirkulasi: Konfirmasi Peminjaman (`POST /api/v1/admin/sirkulasi/konfirmasi-pinjam`)
Mendukung dua jalur resmi:
1. **Jalur Klaim Pengajuan Daring (`jalur = 'reservasi_online'`):**
   - Admin memindai/memilih **kartu anggota** (`pengguna_id`) dan memindai **barcode fisik buku** (`kode_barcode`).
   - Backend mencari `eksemplar` berdasarkan `kode_barcode` dengan `FOR UPDATE`.
   - **Proteksi Tabrakan Eksemplar:**
     - Jika `eksemplar.status == 'direservasi'`, cek `reservasi` aktif (`siap_diambil`) yang mengunci `eksemplar.id`:
       - Jika `reservasi.pengguna_id != pengguna_id` input $\rightarrow$ **TOLAK MUTLAK** HTTP `409` (`EKSEMPLAR_DIRESERVASI_ORANG_LAIN`) dengan pesan: *"Eksemplar buku tidak dapat dipinjam. Buku ini sedang dialokasikan untuk pengajuan peminjaman warga lain. Silakan pilih eksemplar buku lain yang tersedia."*
   - Jika cocok dengan `reservasi` milik warga tersebut:
     - `reservasi.status = 'selesai'`
     - `eksemplar.status = 'dipinjam'`
     - Buat baris `pinjaman` (`status = 'aktif'`, `durasi_hari = payload.durasi_hari ?? kebijakan.durasi_default_7`, `tanggal_jatuh_tempo = CURRENT_DATE + durasi_hari`).
     - Catat `log_audit` aksi `KONFIRMASI_PINJAM_ONLINE`.
2. **Jalur Peminjaman Langsung (`jalur = 'langsung_offline'`):**
   - Admin memindai kartu anggota + barcode `BK-xxxx`.
   - Jalankan validasi kelayakan Warga (tidak terblokir, bebas denda `belum_lunas`, *Single-Item Rule* = 0).
   - Pastikan `eksemplar.status == 'tersedia'` (dengan `FOR UPDATE`). Jika berstatus `direservasi` $\rightarrow$ tolak dengan `EKSEMPLAR_DIRESERVASI_ORANG_LAIN`.
   - Ubah `eksemplar.status = 'dipinjam'`, buat baris `pinjaman` (`aktif`), dan catat `log_audit` aksi `KONFIRMASI_PINJAM_LANGSUNG`.

#### B. Pembatalan / Penolakan Pengajuan oleh Admin (`POST /api/v1/admin/reservasi/{id}/batal-atau-tolak`)
- Payload wajib: `aksi` (`batal` atau `ditolak`), `alasan_kode` (`rusak` / `lainnya`), `pesan_commit` (wajib).
- Dalam 1 transaksi DB:
  - Ubah `reservasi.status` ke `batal` atau `ditolak`, simpan alasan.
  - Kunci `eksemplar` terkait (`FOR UPDATE`):
    - Jika `alasan_kode == 'rusak'`: Ubah `eksemplar.status = 'rusak'`. **Jangan memicu promosi antrean** pada eksemplar ini. (Opsional: sistem mencari apakah ada eksemplar lain yang `tersedia` untuk mempromosikan antrean `#1`).
    - Jika `alasan_kode == 'lainnya'` atau `ditolak`: Jalankan **Sub-rutin Promosi Antrean FIFO**; jika tidak ada antrean, kembalikan `eksemplar.status = 'tersedia'`.
  - Tulis `log_audit` lengkap dengan `pesan_commit`.
  - Kirim notifikasi *In-App* + Email ke Warga.

#### C. Pengembalian Fisik & Penerbitan Denda (`POST /api/v1/admin/sirkulasi/pengembalian`)
1. Admin memindai `kode_barcode` eksemplar dan memilih `kondisi_kembali` (`baik`, `rusak`, atau `hilang`).
2. Dalam 1 transaksi DB (`BEGIN ... COMMIT`):
   - Kunci baris `pinjaman` (`aktif`/`terlambat`) dan `eksemplar` (`FOR UPDATE`).
   - Hitung keterlambatan berdasarkan zona waktu **`Asia/Jakarta`** (hari libur tetap terhitung):
     - `selisih_hari = MAX(0, DATE(NOW() AT TIME ZONE 'Asia/Jakarta') - pinjaman.tanggal_jatuh_tempo)`
   - Jika `selisih_hari > 0`:
     - `nominal_denda = selisih_hari * 500` (Rp500/hari/buku, atau membaca tabel kebijakan sistem).
     - Insert ke tabel `denda` (`pengguna_id`, `pinjaman_id`, `jumlah_hari_terlambat = selisih_hari`, `nominal = nominal_denda`, `status = 'belum_lunas'`).
   - Update `pinjaman.status = 'selesai'`, `pinjaman.tanggal_kembali = NOW()`.
   - Penanganan kondisi buku:
     - Jika `kondisi_kembali == 'baik'`: Jalankan **Sub-rutin Promosi Antrean FIFO** untuk `buku_id` tersebut. Jika tidak ada antrean `#1`, set `eksemplar.status = 'tersedia'`.
     - Jika `kondisi_kembali == 'rusak'` atau `'hilang'`: Set `eksemplar.status = kondisi_kembali` (kunci agar tidak dipromosikan ke antrean `#1`).
   - Catat ke `log_audit` (`PENGEMBALIAN_BUKU`).
   - Kirim notifikasi *In-App* + Email ke Warga (dan ke pemenang antrean `#1` jika ada promosi).

#### D. Konfirmasi Perpanjangan oleh Admin (`POST /api/v1/admin/perpanjangan/{id}/proses`)
- Payload: `keputusan` (`disetujui` / `ditolak`), `durasi_hari_disetujui` (bisa sama atau diubah Admin via stepper `-`/`+`), `pesan_commit` (wajib).
- Dalam 1 transaksi DB:
  - Jika `disetujui`: Update `ajuan_perpanjangan.status = 'disetujui'`, tambah `pinjaman.tanggal_jatuh_tempo` sebanyak `durasi_hari_disetujui` hari.
  - Jika `ditolak`: Update `ajuan_perpanjangan.status = 'ditolak'`, simpan `pesan_commit` sebagai alasan penolakan.
  - Tulis `log_audit` (`PROSES_PERPANJANGAN`) dengan `data_lama` dan `data_baru`.
  - Kirim notifikasi *In-App* + Email ke Warga.

#### E. Manajemen Denda: Pelunasan, Koreksi, & Pembebasan (`POST /api/v1/admin/denda/*`)
1. **Pelunasan Penuh V1 (`POST /api/v1/admin/denda/{id}/lunas`):**
   - Mengubah `denda.status` dari `belum_lunas` $\rightarrow$ `lunas` (pembayaran tunai penuh di meja; cicilan belum didukung di V1).
   - Begitu seluruh denda milik warga berstatus `lunas`/`dibebaskan`, hambatan pinjam karena denda otomatis terbuka.
2. **Koreksi / Pembebasan Tunggal & Massal/Batch (`POST /api/v1/admin/denda/batch-koreksi`):**
   - Menerima array `denda_ids[]`, aksi (`ubah_nominal` / `bebaskan`), `nominal_baru` (jika ubah nominal), dan `pesan_commit` (wajib).
   - Seluruh pembaruan dieksekusi dalam 1 transaksi DB + mencatat `log_audit` lengkap dengan `data_lama` dan `data_baru`.

#### F. Stock Opname (*Fast-Scan & Commit*)
1. **Buka Sesi (`POST /api/v1/admin/opname/sesi`):**
   - Buat `opname_sesi` (`kode_sesi`, `judul`, `cakupan`: `semua`/`kategori`, `status = 'berjalan'`, `petugas_id`).
   - Snapshot seluruh `eksemplar` sesuai cakupan ke `opname_detail` (`status_sistem_awal`, `sudah_dipindai = false`).
2. **Fast-Scan Barcode (`POST /api/v1/admin/opname/sesi/{id}/pindai`):**
   - Terima `kode_barcode` dan `status_fisik_temuan` (default `cocok`, atau `rusak` / `salah_lokasi`).
   - Update `opname_detail` secara instan (`sudah_dipindai = true`, `dipindai_pada = NOW()`).
3. **Tinjau Selisih / Diff (`GET /api/v1/admin/opname/sesi/{id}/selisih`):**
   - Mengelompokkan hasil menjadi 3 kategori:
     1. **Sesuai:** `sudah_dipindai = true` dan `status_fisik_temuan == 'cocok'`.
     2. **Kondisi Berubah (Rusak/Salah Lokasi):** `sudah_dipindai = true` dan `status_fisik_temuan != 'cocok'`.
     3. **Tidak Ditemukan (Hilang):** `sudah_dipindai = false` (kecuali yang memang sedang `dipinjam` aktif oleh warga).
4. **Pengesahan / Commit Opname (`POST /api/v1/admin/opname/sesi/{id}/commit`):**
   - Wajib `pesan_commit`.
   - Dalam 1 transaksi DB: Perbarui massal status pada tabel `eksemplar` berdasarkan temuan akhir, ubah `opname_sesi.status = 'selesai_commit'`, `disahkan_pada = NOW()`, dan tulis 1 entri `log_audit` (`COMMIT_OPNAME`).

#### G. Manajemen Warga, Buka Blokir, & Hybrid Delete
1. **CRUD Akun Warga:** Tambah, ubah profil/kelas/NIS/NIP, reset password, dan **Buka Blokir Sanksi Permanen** (`status_blokir = 'normal'`, `no_show_count = 0`, wajib `pesan_commit`).
2. **Kebijakan Hybrid Delete (`DELETE /api/v1/admin/pengguna/{id}`):**
   - Cek apakah akun memiliki histori (`pinjaman`, `reservasi`, `denda`, atau `log_audit`):
     - **Jika SUDAH memiliki histori (misal siswa lulus/keluar):** Wajib **Soft Delete** (`UPDATE pengguna SET deleted_at = NOW()`). Dilarang keras hard delete agar `FOREIGN KEY` dan laporan historis tetap utuh.
     - **Jika BELUM pernah memiliki transaksi/histori sama sekali (misal salah buat akun/typo):** Diperbolehkan **Hard Delete** (`DELETE FROM pengguna WHERE id = $1`) dengan menyertakan parameter `tipe_hapus = 'permanen'` dan `pesan_commit`.

---

### 4.3 Workflow Eksklusif Peran `admin_master`

`admin_master` mewarisi seluruh kemampuan `admin` di atas, ditambah endpoint eksklusif `/api/v1/admin-master/kelola-admin/*`:
1. **Tambah / Promosikan Admin (`POST /api/v1/admin-master/kelola-admin`):** Memberikan peran `admin` kepada akun baru atau warga yang ada. Wajib `pesan_commit`.
2. **Cabut Peran / Nonaktifkan Admin (`DELETE /api/v1/admin-master/kelola-admin/{id}`):** Mencabut `kode_peran = 'admin'` dari tabel `pengguna_peran` (dan memutus sesi admin aktif pengguna tersebut). Wajib `pesan_commit`.
3. **Proteksi Kekebalan:**
   - Akun dengan `is_admin_master = true` **kebal** terhadap pencabutan role, penurunan hak akses, maupun penghapusan oleh endpoint mana pun (kembalikan HTTP `403` `ADMIN_MASTER_KEBAL`).
   - `admin` biasa yang mencoba memodifikasi sesama `admin` atau `admin_master` wajib ditolak dengan HTTP `403` (`KHUSUS_ADMIN_MASTER`).

---

### 4.4 Workflow Sistem Otomatis (Sub-rutin & Cron Jobs)

#### A. Sub-rutin Atomik: Promosi Antrean FIFO
Dipanggil di dalam transaksi DB yang sama setiap kali 1 eksemplar menjadi bebas dalam kondisi `baik`:
```sql
-- 1. Pastikan eksemplar terkunci (FOR UPDATE) dan layak
-- 2. Cari antrean urutan teratas untuk buku_id terkait
SELECT id, pengguna_id FROM reservasi
WHERE buku_id = $1 AND jenis = 'antre' AND status = 'menunggu'
ORDER BY created_at ASC, id ASC
LIMIT 1
FOR UPDATE SKIP LOCKED;
```
- Jika ditemukan antrean `#1`:
  - Update baris antrean tsb: `jenis = 'pengajuan'` (atau tetap `antre` dengan status `siap_diambil` sesuai skema migrasi), `status = 'siap_diambil'`, `eksemplar_id = $eksemplar_id`, `kode_reservasi = 'RSV-...'`, `waktu_tenggat = NOW() + INTERVAL '24 hours'`.
  - Update `eksemplar.status = 'direservasi'`.
  - Masukkan notifikasi *In-App* + antrean email (`antre_kirim`) kepada pemenang antrean `#1`.
- Jika tidak ada antrean:
  - Update `eksemplar.status = 'tersedia'`.

#### B. Cron Job 1: Kedaluwarsa Pengajuan 24 Jam (Tiap 5 Menit)
1. Cari semua `reservasi` dengan `status = 'siap_diambil'` dan `waktu_tenggat < NOW()`.
2. Untuk setiap baris (dalam transaksi per item):
   - Ubah `reservasi.status = 'kedaluwarsa'`.
   - Tidak ada denda uang. Tambah `no_show` counter warga dalam 30 hari terakhir:
     - Jika mencapai **3x *no-show* dalam 30 hari** $\rightarrow$ set `status_blokir = 'blokir_sementara'`, `blokir_hingga = NOW() + INTERVAL '7 days'`, dan tambah `jumlah_blokir_sementara += 1`.
     - Jika `jumlah_blokir_sementara >= 3` $\rightarrow$ set `status_blokir = 'blokir_permanen'` (hanya bisa dibuka oleh Admin/Admin Master).
   - Jalankan **Sub-rutin Promosi Antrean FIFO** untuk melepas/mempromosikan eksemplar.
   - Catat ke `log_audit` dengan `konteks_peran = 'sistem_cron'`, `aksi = 'KEDALUWARSA_RESERVASI'`.

#### C. Cron Job 2: Keterlambatan Pinjaman Harian (Setiap Hari Pukul 00:05 WIB)
1. Cek `pinjaman` dengan `status = 'aktif'` dan `tanggal_jatuh_tempo < DATE(NOW() AT TIME ZONE 'Asia/Jakarta')`.
2. Ubah `pinjaman.status = 'terlambat'`.
3. Kirim notifikasi *In-App* + Email pemberitahuan keterlambatan (tarif berjalan Rp500/hari, dikunci ke tabel `denda` saat buku dikembalikan fisik).

#### D. Cron Job 3: Pengingat Berkala (Tiap 1 Jam)
1. **Pengingat Pengambilan:** 6 jam sebelum `waktu_tenggat` pengajuan `siap_diambil` berakhir.
2. **Pengingat Jatuh Tempo:** H-1 sebelum `tanggal_jatuh_tempo` pinjaman `aktif`.
3. Gunakan `kunci_idempoten` di tabel `antrean_email` (misal `PENGINGAT_H1:pinjaman_123`) agar tidak mengirim notifikasi ganda.

---

## 5. Standar Audit Log, Sistem Commit Ala Git, & Error Handling

### 5.1 Struktur `log_audit` (Immutable Git-Style Commit)
Setiap perubahan sensitif wajib menulis 1 baris ke `log_audit`:
- `id`: UUID v4
- `kode_commit`: Hash pendek 8 karakter unik (misal `a4f9c21e`)
- `pengguna_id`: UUID aktor (NULL jika `sistem_cron`)
- `konteks_peran`: `'warga'` | `'admin'` | `'admin_master'` | `'sistem_cron'`
- `aksi`: Kode aksi standar uppercase (`KONFIRMASI_PINJAM_ONLINE`, `PENGEMBALIAN_BUKU`, `PROSES_PERPANJANGAN`, `KOREKSI_DENDA_BATCH`, `COMMIT_OPNAME`, `BUKA_BLOKIR_WARGA`, `HAPUS_PENGGUNA`, `CABUT_PERAN_ADMIN`)
- `pesan_commit`: Teks wajib yang menjelaskan alasan perubahan
- `tabel` & `entitas_id`: Nama tabel dan ID objek yang berubah
- `data_lama` (JSONB) & `data_baru` (JSONB): *Diff snapshot* sebelum dan sesudah transaksi
- `created_at`: Timestamp server UTC

**Proteksi Immutability Database:**
```sql
REVOKE UPDATE, DELETE ON log_audit FROM app_role;
-- Ditambah trigger PostgreSQL BEFORE UPDATE OR DELETE yang melempar EXCEPTION.
```

### 5.2 Ketahanan Pengiriman Email
- Kegagalan koneksi SMTP/API email **TIDAK BOLEH** membatalkan (*rollback*) transaksi bisnis utama (pinjam, kembali, promosi antrean).
- Simpan tugas pengiriman ke `antrean_email` (`antre_kirim`, `terkirim`, `gagal`, `coba_ulang`) di dalam transaksi, lalu proses pengirimannya secara asinkron di background worker.

### 5.3 Standar Respons Error (RFC 7807 / RFC 9457)
Seluruh error `4xx` / `5xx` wajib mengembalikan `Content-Type: application/problem+json` dengan `code` berbahasa Indonesia:
- `SESI_TIDAK_VALID` (`401`)
- `AKSES_DITOLAK` (`403`)
- `KHUSUS_ADMIN_MASTER` (`403`)
- `ADMIN_MASTER_KEBAL` (`403`)
- `AKUN_TERBLOKIR_SEMENTARA` / `AKUN_TERBLOKIR_PERMANEN` (`403`)
- `DENDA_BELUM_LUNAS` (`403`)
- `KUOTA_PINJAM_PENUH` (`409`)
- `STOK_TIDAK_TERSEDIA` (`409`)
- `STOK_MASIH_TERSEDIA` (`409`)
- `ANTREAN_PENUH` (`409`)
- `EKSEMPLAR_DIRESERVASI_ORANG_LAIN` (`409`)
- `PESAN_COMMIT_WAJIB` (`422`)
