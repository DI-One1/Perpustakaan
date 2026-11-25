# BILIK — Perpustakaan Digital SMK TI BAZMA

> Platform Perpustakaan Digital & Sirkulasi Terpadu untuk **SMK TI BAZMA** di bawah naungan **Yayasan BAZMA Pertamina** (Proyek TEFA — Software as a Service).

---

## Tentang Proyek

**BILIK (Basis Informasi & Literasi Islam Terpadu Kejuruan)** menggabungkan pengalaman pemustaka ala e-commerce (katalog, pencarian, favorit, rating, ulasan, pengajuan peminjaman, dan antrean FIFO) dengan sistem operasional meja sirkulasi fisik berbasis barcode eksemplar (`BK-xxxx`), stock opname *fast-scan*, denda terukur, dan audit log bergaya Git commit.

### Prinsip Utama: *One Platform, One Identity, Multiple Workspaces*
Setiap pengguna hanya memiliki **1 identitas akun tunggal**. Staf (`pustakawan`, `admin`, `admin_master`) dapat berpindah antara **Mode Warga** dan **Workspace Pengelola** tanpa membuat akun kedua.

---

## Peran Pengguna

| Peran | Akses & Wewenang |
|---|---|
| **Warga** | Eksplorasi katalog, favorit, rating/ulasan, **Pengajuan Peminjaman** (kunci 24 jam), **Antre Buku (FIFO)**, perpanjangan mandiri, dan kartu anggota digital. |
| **Pustakawan** | *Broad Operational Access*: Meja Sirkulasi (scan kartu + barcode fisik), validasi/penolakan pengajuan, pengembalian & denda, CRUD master buku/kategori/eksemplar, dan Stock Opname. |
| **Admin** | *Full Access* operasional & manajemen data (CRUD seluruh data **kecuali** `log_audit` & `commit`), pengaturan kebijakan, buka blokir akun, dan melihat seluruh log audit. |
| **Admin Master** | 1 akun utama bawaan yang kebal dihapus serta memiliki wewenang eksklusif CRUD dan pencabutan hak akses akun `admin` lainnya. |

---

## Arsitektur & Tech Stack

* **Frontend & Prototipe API:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (Strict), Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Plus Jakarta Sans.
* **Basis Data & Migrasi:** PostgreSQL 16 + `dbmate` (plain SQL migrations di `infra/db/migrations/`).
* **Spesifikasi API:** OpenAPI 3.0.3 (`docs/02-api/openapi.yaml`) + RFC 7807 Problem Details.
* **Quality Assurance:** Vitest, Playwright, ESLint, Prettier.

---

## Standar Konsistensi Bahasa & Kode (WAJIB)

Seluruh pengembang dan AI Agent wajib mematuhi [`docs/01-arsitektur/penamaan-dan-bahasa.md`](docs/01-arsitektur/penamaan-dan-bahasa.md):
1. **UI / Antarmuka:** Gunakan **"Pengajuan Peminjaman"** dan **"Direservasi"** (DILARANG memakai kata `"Booking"` / `"Dibooking"`). Dilarang menampilkan label status tidak berguna seperti `"Akun Aktif"`.
2. **Kode, Database, Enum, & API:** Gunakan **100% Bahasa Indonesia (`snake_case`)** yang konsisten (contoh: `direservasi`, `pengajuan`, `reservasi_online`, `kode_reservasi`, `menunggu`, `siap_diambil`, `belum_lunas`).

---

## Pusat Acuan Dokumentasi (`docs/`)

Seluruh dokumentasi proyek telah dikonsolidasikan di [`docs/README.md`](docs/README.md):
* **Konsolidasi Master:** [`all-in-one-BILIK.md`](all-in-one-BILIK.md)
* **Aturan Bisnis Final:** [`docs/01-arsitektur/aturan-bisnis.md`](docs/01-arsitektur/aturan-bisnis.md)
* **Spesifikasi Teknis Tim Backend:** [`docs/01-arsitektur/spesifikasi-backend.md`](docs/01-arsitektur/spesifikasi-backend.md)
* **Standar Penamaan & Bahasa:** [`docs/01-arsitektur/penamaan-dan-bahasa.md`](docs/01-arsitektur/penamaan-dan-bahasa.md)
* **Panduan Basis Data:** [`docs/01-arsitektur/panduan-basis-data.md`](docs/01-arsitektur/panduan-basis-data.md)
* **Design System Resmi:** [`docs/03-desain/DESIGN_SYSTEM.md`](docs/03-desain/DESIGN_SYSTEM.md)
* **Tata Kelola AI Agent:** [`AGENTS.md`](AGENTS.md) & [`.agents/skills/`](.agents/skills/)

---

## Perintah Pengembangan

```powershell
npm run dev          # Menjalankan frontend Next.js di localhost:3000
npm run typecheck    # Pemeriksaan tipe TypeScript
npm run lint         # Pemeriksaan ESLint
npm run test         # Menjalankan unit test domain (Vitest)
npm run build        # Build produksi Next.js
npm run db:up        # Menjalankan migrasi PostgreSQL via dbmate
npm run db:seed      # Menanam data dummy pengujian
```
