# Dokumentasi Resmi Sistem BILIK

Selamat datang di pusat acuan resmi proyek **BILIK (Basis Informasi & Literasi Islam Terpadu Kejuruan)** untuk **SMK TI BAZMA** di bawah naungan **Yayasan BAZMA Pertamina**.

Seluruh dokumen di folder `docs/` ini telah dikonsolidasikan berdasarkan keputusan arsitektur terbaru pada [`all-in-one-BILIK.md`](../all-in-one-BILIK.md) dan menjadi **Sumber Kebenaran Tunggal (Single Source of Truth)** bagi Tim Frontend, Tim Backend, dan AI Coding Agent.

---

## Peta Navigasi Dokumentasi

### 00 — Konteks & Glosarium
* [Konteks Sekolah (`00-konteks/sekolah.md`)](00-konteks/sekolah.md): Profil SMK TI BAZMA, kondisi operasional asrama, dan ruang lingkup V1.
* [Profil Klien (`00-konteks/klien.md`)](00-konteks/klien.md): Kebutuhan Yayasan BAZMA Pertamina dan standar akreditasi perpustakaan.
* [Glosarium Resmi (`00-konteks/glosarium.md`)](00-konteks/glosarium.md): Kamus istilah resmi antarmuka (UI) dan istilah teknis kode/database.

### 01 — Arsitektur & Spesifikasi Backend (P1)
* [Aturan Bisnis Final (`01-arsitektur/aturan-bisnis.md`)](01-arsitektur/aturan-bisnis.md): Aturan sirkulasi, kuota, denda Rp500/hari, no-show 24 jam, antrean FIFO, dan perpanjangan.
* [Spesifikasi Teknis Backend (`01-arsitektur/spesifikasi-backend.md`)](01-arsitektur/spesifikasi-backend.md): Acuan lengkap Tim Backend (Matriks Role & RBAC Admin Master/Admin/Warga, State Machine, Git-Style Commit & Audit Log, Stock Opname, Notifikasi & Cron, Hybrid Soft/Hard Delete).
* [Workflow Peran Backend Super Detail (`01-arsitektur/workflow-peran-backend.md`)](01-arsitektur/workflow-peran-backend.md): Peta eksekusi backend end-to-end per peran (`warga`, `admin`, `admin_master`, dan `sistem_cron`), validasi RBAC, query atomik, dan error handling.
* [Diagram Workflow Lengkap (`01-arsitektur/workflow-diagram.md`)](01-arsitektur/workflow-diagram.md): Diagram Mermaid interaktif seluruh alur sistem (4 zona: Warga, Backend, Admin, dan Cron Jobs) dengan relasi lintas zona.
* [Standar Penamaan & Bahasa Kode (`01-arsitektur/penamaan-dan-bahasa.md`)](01-arsitektur/penamaan-dan-bahasa.md): Aturan mutlak konsistensi Bahasa Indonesia penuh (`direservasi`, bukan `dibooking`; `snake_case`, tanpa campur bahasa Inggris).
* [Panduan Basis Data (`01-arsitektur/panduan-basis-data.md`)](01-arsitektur/panduan-basis-data.md): Eksekusi PostgreSQL, `dbmate`, seeder, dan skema tabel lanjutan.

#### Alur Kerja per Aktor (`01-arsitektur/workflow/`)
* [Workflow Warga (`workflow/warga.md`)](01-arsitektur/workflow/warga.md)
* [Workflow Admin & Admin Master (`workflow/admin.md`)](01-arsitektur/workflow/admin.md)
* [Workflow Sistem Otomatis (`workflow/sistem.md`)](01-arsitektur/workflow/sistem.md)

### 02 — Kontrak API
* [Panduan & Standar API (`02-api/README.md`)](02-api/README.md): Standar REST API, otorisasi sesi, RFC 7807 Problem Details, dan konsistensi payload Bahasa Indonesia.
* [Spesifikasi OpenAPI (`02-api/openapi.yaml`)](02-api/openapi.yaml): Kontrak endpoint REST API V1.

### 03 — Sistem Desain & Antarmuka (P1)
* [Design System BILIK (`03-desain/DESIGN_SYSTEM.md`)](03-desain/DESIGN_SYSTEM.md): Spesifikasi visual resmi, tipografi, komponen, dan prinsip minimalisme konten.
* [Design Tokens (`03-desain/design-tokens.md`)](03-desain/design-tokens.md): Token warna semantik dan skala ukuran.
* [Panduan Aset Gambar (`03-desain/aset-gambar.md`)](03-desain/aset-gambar.md): Rasio wajib cover buku (2:3) dan avatar (1:1).
* [Referensi Visual (`03-desain/referensi.md`)](03-desain/referensi.md): Catatan referensi desain antarmuka.

### 04 — Operasional & Deployment
* [Panduan Admin (`04-operasional/panduan-admin.md`)](04-operasional/panduan-admin.md): SOP Meja Sirkulasi, Stock Opname Fast-Scan, manajemen role, Admin Master, koreksi denda, dan audit log.
* [Deploy & Backup (`04-operasional/deploy-dan-backup.md`)](04-operasional/deploy-dan-backup.md): Konfigurasi server, cron job otomatis, dan backup database.
