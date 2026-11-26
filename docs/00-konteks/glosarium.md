# Glosarium Resmi Sistem BILIK

Dokumen ini menetapkan istilah baku di **Antarmuka Pengguna (UI)** serta padanan **Istilah Teknis (Kode, Database, API)** agar seluruh tim menggunakan bahasa yang seragam.

---

## 1. Istilah Baku Antarmuka (UI)

| Istilah Resmi (WAJIB) | Istilah Terlarang (DILARANG) | Makna di Aplikasi |
|---|---|---|
| **Pengajuan Peminjaman** | Booking, Ajuan Booking | Permintaan peminjaman daring atas eksemplar yang tersedia (mengunci buku 24 jam). |
| **Antre Buku** | Queue, Waitlist | Pendaftaran antrean FIFO saat seluruh eksemplar sedang dipinjam/direservasi. |
| **Siap Dipinjam** | Booking Siap Diambil | Status pengajuan saat eksemplar fisik sudah dialokasikan dan siap diambil di meja sirkulasi. |
| **Direservasi** / **Dialokasikan** | Dibooking | Kondisi eksemplar fisik yang sedang disisihkan untuk pengajuan peminjaman seorang warga. |
| **Batalkan Pengajuan** | Batalkan Booking | Aksi pembatalan oleh pengaju (warga) atau petugas (disertai alasan). |
| **Batas Pengambilan: HH:MM:SS** | Sisa Waktu Booking | Countdown waktu nyata hingga pengajuan kedaluwarsa (24 jam). |

---

## 2. Istilah Domain & Teknis

| Istilah | Definisi |
|---|---|
| **One Identity, Multiple Workspaces** | Satu akun pengguna memiliki satu identitas tunggal. Pengguna dengan peran `admin` dapat berpindah antara Mode Warga dan Workspace Admin tanpa membuat akun baru. |
| **Warga** | Pengalaman utama website untuk pemustaka (siswa, guru, staf, maupun Admin saat dalam Mode Warga). |
| **Admin** | Pengelola operasional perpustakaan & sistem dengan akses penuh (sirkulasi, katalog, opname, denda, CRUD warga, kebijakan sistem), kecuali mengubah/menghapus `log_audit` dan mengelola akun Admin lain. |
| **Admin Master** | Satu akun Administrator utama bawaan sistem yang kebal dihapus dan memiliki kewenangan eksklusif mengelola (CRUD) akun-akun Admin lainnya. |
| **Eksemplar** | Satu unit buku fisik spesifik yang memiliki barcode unik (`BK-xxxx`) dan kondisi fisik tersendiri. |
| **Alokasi** | Pengikatan satu eksemplar fisik tertentu kepada pengajuan seorang warga selama batas waktu 24 jam. |
| **Antrean FIFO** | Antrean berurutan (*First-In, First-Out*); warga yang lebih awal masuk antrean dipromosikan lebih dulu. |
| **Promosi Antrean** | Pengalihan otomatis antrean urutan `#1` menjadi pengajuan `siap_diambil` saat ada eksemplar layak yang dilepaskan. |
| **No-Show** | Kondisi warga tidak mengambil buku yang telah dialokasikan hingga batas 24 jam habis. Tidak dikenakan denda uang, melainkan dicatat untuk mekanisme blokir sementara. |
| **Commit** | Pencatatan perubahan penting, koreksi massal, atau penyelesaian Stock Opname bergaya Git (menyertakan aktor, pesan commit, hash/ID unik, serta selisih data lama dan baru). |
| **Audit Log** | Catatan kronologis permanen (*append-only / immutable*) atas seluruh tindakan sensitif di server. Tidak dapat diedit atau dihapus oleh siapa pun, termasuk Admin Master. |
| **Stock Opname** | Pemeriksaan berkala kecocokan koleksi fisik di rak terhadap data sistem melalui pemindaian barcode cepat (*Fast-Scan*), peninjauan selisih (*Diff*), dan pengesahan (*Commit*). |
