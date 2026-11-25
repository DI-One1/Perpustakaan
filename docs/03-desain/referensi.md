# Catatan Referensi Desain & Arsitektur BILIK

Terakhir Diperbarui: 2026-11-20 (Tahap: Kontrak API OpenAPI 3.1 Selesai)

| Repositori / Referensi | Kategori | Keputusan yang Dipengaruhi | File Terkait |
|---|---|---|---|
| `vercel/next.js` | [PAKAI] | App Router, Server Components, dynamic image handling, responsive container | `frontend/next.config.ts`, `frontend/src/app/(public)/page.tsx` |
| `GoogleChrome/modern-web-guidance` | [PAKAI] | Carousel responsive, Polite live region untuk assistive technology, standard viewport margin, image aspect ratio tanpa layout shift | `frontend/src/components/home/banner-carousel.tsx`, `frontend/src/components/media/book-cover.tsx` |
| `miqdadbadjuber/anti-slop` | [PAKAI] | Mengeliminasi placeholder inisial/kotak polos; microcopy ringkas dan lugas; satu pintu komponen gambar terpusat | `frontend/src/components/media/*`, `docs/03-desain/aset-gambar.md` |
| `shadcn-ui/ui` | [PAKAI] | Komponen Popover, Dropdown Menu, Dialog, Badge status, Tabs | `frontend/src/components/ui/*` |
| `Shopee / Tokopedia / Gramedia` | [ACUAN-POLA] | Wide layout 1280px (`min(calc(100% - 48px), 1280px)`), hero banner komposisi 2:1 murni visual-only, e-commerce catalog grid, product detail sticky actions panel | `frontend/src/components/layout/header.tsx`, `frontend/src/components/home/banner-carousel.tsx`, `frontend/src/app/(public)/buku/[id]/page.tsx`, `frontend/src/app/(public)/katalog/page.tsx` |
| `amacneil/dbmate` | [PAKAI] | Pemilik tunggal skema database (SQL up/down) | `infra/db/migrations/` |
| `porsager/postgres` | [PAKAI] | Database client murni Postgres | `frontend/src/server/` |
| `openapi-ts/openapi-typescript` | [PAKAI] | Generator tipe TypeScript otomatis dari kontrak OpenAPI 3.1 tanpa mengubah snake_case | `docs/02-api/openapi.yaml`, `frontend/src/lib/api/schema.d.ts` |
| `RFC 9457 (Problem Details)` | [PAKAI] | Standar representasi error HTTP API dengan kode stabil (`PINJAMAN_AKTIF`, `DENDA_AKTIF`, dll.) | `docs/02-api/openapi.yaml`, `docs/02-api/aturan-bisnis.md` |
| `dedoc/scramble` | [ACUAN-BACKEND] | Acuan pengujian kesesuaian endpoint Laravel dengan kontrak OpenAPI saat serah terima | `docs/02-api/openapi.yaml` |
| `jasontaylordev/CleanArchitecture` | [ACUAN-BACKEND] | Acuan struktur layer entitas ASP.NET Core saat serah terima | `docs/01-arsitektur/adr-0001-database-sementara.md` |
