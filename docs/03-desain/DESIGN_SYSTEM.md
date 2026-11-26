# BILIK — Official Visual Design Specification

> **Status:** Official Design System — P1 Visual Authority
> **Version:** 2.0.0
> **Tanggal Dibuat:** 2026-11-23
> **Terakhir Diperbarui:** 2026-11-23
> **Penulis:** Design System Consolidation — Based on project audit & SMK TI BAZMA visual inspection
> **Scope:** Seluruh antarmuka BILIK (frontend Next.js)

---

## Legenda Status Informasi

Setiap klaim dalam dokumen ini diklasifikasikan sebagai:

- `[VERIFIED FACT]` — Dibuktikan langsung dari source code atau inspeksi visual resmi
- `[APPROVED DECISION]` — Keputusan desain resmi yang disetujui untuk BILIK
- `[RECOMMENDATION]` — Usulan yang belum menjadi keputusan final
- `[PENDING VERIFICATION]` — Belum dapat dibuktikan; perlu dikonfirmasi

---

## Daftar Isi

1. [Tujuan dan Cakupan](#1-tujuan-dan-cakupan)
2. [Design Philosophy](#2-design-philosophy)
3. [Brand Identity](#3-brand-identity)
4. [Color System](#4-color-system)
5. [Typography System](#5-typography-system)
6. [Shape Language & Radius System](#6-shape-language--radius-system)
7. [Shadow & Elevation System](#7-shadow--elevation-system)
8. [Button System](#8-button-system)
9. [Form & Input System](#9-form--input-system)
10. [Search Component](#10-search-component)
11. [Card & Surface System](#11-card--surface-system)
12. [Iconography](#12-iconography)
13. [Spacing & Layout](#13-spacing--layout)
14. [Visual Hierarchy](#14-visual-hierarchy)
15. [BookCard & BookCover](#15-bookcard--bookcover)
16. [Image & Asset Guidelines](#16-image--asset-guidelines)
17. [Navigation Components](#17-navigation-components)
18. [Page-Specific Design Patterns](#18-page-specific-design-patterns)
19. [Interaction & Motion](#19-interaction--motion)
20. [Responsive Design](#20-responsive-design)
21. [Accessibility](#21-accessibility)
22. [Anti-AI-Slop Rules](#22-anti-ai-slop-rules)
23. [Component Architecture](#23-component-architecture)
24. [Design Tokens Governance](#24-design-tokens-governance)
25. [Migration Plan](#25-migration-plan)
26. [Validation Checklist](#26-validation-checklist)
27. [References & Sources](#27-references--sources)
28. [Change Log](#28-change-log)

---

## 1. Tujuan dan Cakupan

Dokumen ini adalah **Official Visual Design Specification BILIK** — acuan wajib bagi seluruh AI coding agent dan developer yang mengembangkan antarmuka BILIK.

**BILIK** adalah platform perpustakaan digital untuk civitas akademika SMK TI BAZMA (Yayasan BAZMA Pertamina).

### Lingkup Dokumen

Dokumen ini mengatur:
- Identitas visual dan brand palette
- Sistem token warna
- Tipografi dan skala teks
- Shape language dan border radius
- Shadow dan sistem elevasi
- Komponen UI: button, form, card, search, navigation
- Sistem ikon dan aset media
- Pola layout per halaman
- Aturan aksesibilitas dan responsif
- Aturan anti-slop

### Dokumen Terkait

| Dokumen | Peran |
|---|---|
| [`docs/03-desain/design-tokens.md`](./design-tokens.md) | Dokumentasi teknis token implementasi (referensi internal) |
| [`docs/03-desain/aset-gambar.md`](./aset-gambar.md) | Kebijakan aset media dan rasio gambar (P1) |
| [`docs/03-desain/referensi.md`](./referensi.md) | Daftar repository dan referensi eksternal |
| [`AGENTS.md`](../../AGENTS.md) | Authority hierarchy, skill division, coding rules (P1) |
| [`frontend/AGENTS.md`](../../frontend/AGENTS.md) | Frontend coding conventions (P1) |
| [`docs/01-arsitektur/aturan-bisnis.md`](../01-arsitektur/aturan-bisnis.md) | Business rules — tidak diubah oleh dokumen ini |
| [`docs/02-api/openapi.yaml`](../02-api/openapi.yaml) | API contract — tidak diubah oleh dokumen ini |

> **Konflik resolusi**: Jika terdapat konflik antara dokumen ini dengan `aturan-bisnis.md` atau `openapi.yaml`, business rules dan API contract selalu menang.

---

## 2. Design Philosophy

### Tagline Resmi

> **BILIK — Modern Institutional E-commerce Interface**

### Empat Pilar Desain

**1. Strong Visual Identity**
BILIK harus memiliki karakter visual yang khas dan konsisten. Setiap komponen, halaman, dan interaksi harus mencerminkan identitas Navy Institutional yang kuat. Jangan membuat setiap halaman terasa seperti produk berbeda.

**2. Consistent Visual Hierarchy**
Hierarki visual yang jelas di setiap halaman: judul halaman, judul seksi, konten kartu, body text, metadata — semuanya harus dapat dibedakan tanpa kebingungan.

**3. Functional E-commerce UX**
BILIK menggunakan paradigma navigasi e-commerce. Prioritas utama: pencarian, penemuan koleksi, detail buku, ketersediaan, dan transaksi peminjaman. Jangan mengubahnya menjadi website company profile.

**4. Institutional Professionalism**
BILIK adalah perpustakaan institusi pendidikan Islam. Karakter desain harus amanah, profesional, dan selaras dengan nilai SMK TI BAZMA dan Yayasan BAZMA Pertamina.

### Prinsip Minimalisme Proporsional

Minimalisme digunakan secara selektif, bukan sebagai hukum absolut:

- **Boleh minimal**: dekorasi, filler text, ornamen tanpa fungsi
- **Jangan dihilangkan**: shadow, border yang memisahkan konten, komponen navigasi, karakter visual brand

---

## 3. Brand Identity

### Identitas Utama

`[APPROVED DECISION]`

| Elemen | Nilai |
|---|---|
| Nama Platform | BILIK |
| Kepanjangan | Basis Informasi & Literasi Islam Terpadu Kejuruan |
| Institusi | SMK TI BAZMA — Yayasan BAZMA Pertamina |
| Primary Brand Color | `#132B6D` (Navy Institutional) |
| Font Utama | Plus Jakarta Sans |
| Logo | `/public/BILIK.png` — raster resmi |

### File Logo Resmi

`[VERIFIED FACT]` — File tersedia di `frontend/public/BILIK.png`

Aturan penggunaan logo:
- Gunakan logo PNG raster resmi untuk semua tampilan header dan aplikasi
- Jangan membuat ulang logo menggunakan SVG atau teks
- Jangan memodifikasi proporsi atau warna logo
- Dimensi standar di header: `44×44px` dengan `object-contain`

---

## 4. Color System

### 4.1 Primary Brand Color — Target

`[APPROVED DECISION]`

| Token | Hex | Tailwind Class | Peran |
|---|---|---|---|
| `--primary` | `#132B6D` | `bg-primary`, `text-primary` | Identitas utama BILIK |
| `--primary-foreground` | `#FFFFFF` | `text-primary-foreground` | Teks di atas primary |
| `--primary-hover` | `#0F2159` | `hover:bg-primary-hover` | State hover button primary |
| `--primary-active` | `#0A1840` | `active:bg-primary-active` | State pressed button primary |
| `--primary-soft` | `#EBF0FB` | `bg-primary-soft` | Soft badge, chip background |
| `--primary-soft-foreground` | `#132B6D` | `text-primary-soft-foreground` | Teks di atas primary-soft |
| `--ring` | `#132B6D` | — | Focus ring color |

> **Migrasi**: Token-token ini menggantikan `#0068C2` sebagai primary. Status: `[PENDING MIGRATION]` — nilai CSS belum diperbarui. Lihat [Section 25 — Migration Plan](#25-migration-plan).

### 4.2 Neutral Color System — Target

`[APPROVED DECISION]`

| Token | Hex | Tailwind Class | Peran |
|---|---|---|---|
| `--background` | `#FFFFFF` | `bg-background` | Background halaman utama |
| `--foreground` | `#0A0A0A` | `text-foreground` | Teks utama seluruh halaman |
| `--card` | `#FFFFFF` | `bg-card` | Permukaan kartu dan modal |
| `--card-foreground` | `#0A0A0A` | `text-card-foreground` | Teks dalam kartu |
| `--popover` | `#FFFFFF` | `bg-popover` | Dropdown dan popover |
| `--popover-foreground` | `#0A0A0A` | `text-popover-foreground` | Teks dalam popover |
| `--muted` | `#F5F5F5` | `bg-muted` | Surface muted, secondary |
| `--muted-foreground` | `#737373` | `text-muted-foreground` | Teks pendukung, metadata |
| `--border` | `#E5E5E5` | `border-border` | Border dan separator |
| `--input` | `#E5E5E5` | `border-input` | Border input form |
| `--accent` | `#F5F5F5` | `bg-accent` | Highlight subtil |
| `--accent-foreground` | `#132B6D` | `text-accent-foreground` | Teks di atas accent |

> **Migrasi**: Background berubah dari `#F8F9FB` ke `#FFFFFF`. Status: `[PENDING MIGRATION]`. Lihat [Section 25](#25-migration-plan).

### 4.3 Semantic Status Colors

`[APPROVED DECISION]`

| Token | Hex | Tailwind Class | Peran |
|---|---|---|---|
| `--destructive` | `#E40014` | `bg-destructive` | Aksi destruktif, kondisi kritis |
| `--destructive-foreground` | `#FFFFFF` | `text-destructive-foreground` | Teks di atas destructive |
| `--success-bg` | `#E6F4EA` | `bg-success-bg` | Latar status berhasil |
| `--success-fg` | `#1B6B3A` | `text-success-fg` | Teks status berhasil |
| `--warning-bg` | `#FFF1DB` | `bg-warning-bg` | Latar status peringatan |
| `--warning-fg` | `#8A4B00` | `text-warning-fg` | Teks status peringatan |
| `--danger-bg` | `#FDEBEC` | `bg-danger-bg` | Latar status bahaya |
| `--danger-fg` | `#B3141B` | `text-danger-fg` | Teks status bahaya |

Semantic colors hanya boleh digunakan berdasarkan **makna semantik**:
- `success` untuk ketersediaan dan tindakan berhasil
- `warning` untuk batas pengembalian mendekat atau antrean
- `danger`/`destructive` untuk kondisi kritis, pemblokiran, penghapusan
- Jangan menggunakan warna status untuk dekorasi

### 4.4 Brand Legacy Colors — Migration Status

`[VERIFIED FACT]` — Nilai berikut saat ini aktif di `globals.css`

| Token Lama | Hex Lama | Status | Pemetaan Target |
|---|---|---|---|
| `--color-navy` | `#093A71` | RETAINED sebagai utility bar | Tetap digunakan untuk `bg-navy` utility bar |
| `--color-deep-blue` | `#074685` | DEPRECATED sebagai brand accent | Dihapus dari penggunaan aktif, pertahankan token |
| `--primary` | `#0068C2` | REPLACED oleh `#132B6D` | `[PENDING MIGRATION]` |
| `--color-heading` | `#092142` | REVIEW | Dapat digantikan `#0A0A0A` atau `#132B6D` |
| `--foreground` | `#17365C` | REPLACED oleh `#0A0A0A` | `[PENDING MIGRATION]` |
| `--color-secondary-text` | `#46617D` | REVIEW | Dapat digantikan `#737373` |
| `--background` | `#F8F9FB` | REPLACED oleh `#FFFFFF` | `[PENDING MIGRATION]` |
| `--border` | `#EBEDF2` | REPLACED oleh `#E5E5E5` | `[PENDING MIGRATION]` |
| `--muted-foreground` | `#748399` | REPLACED oleh `#737373` | `[PENDING MIGRATION]` |
| `--color-pale-blue` | `#DFE9F3` | REVIEW | Jika masih diperlukan, jadikan named token |
| `--color-ice-blue` | `#EBF2F9` | REPLACED oleh `#EBF0FB` untuk primary-soft | `[PENDING MIGRATION]` |
| `--color-sky-blue` | `#D7E9F9` | DEPRECATED | Hapus setelah cek penggunaan |
| `--accent-lime` | `#B7D731` | RETAINED | Aksen Pertamina — pertahankan |
| `--destructive` | `#DA1E28` | REPLACED oleh `#E40014` | `[PENDING MIGRATION]` |

**Aturan Migrasi Warna:**
1. `#0068C2` tidak boleh lagi menjadi primary kedua
2. `#093A71` tidak boleh menjadi primary alternatif
3. `#074685` tidak boleh digunakan acak sebagai aksen brand
4. Warna logo dan aset resmi tidak boleh diubah
5. Jangan menghapus token yang masih direferensikan komponen existing

### 4.5 Color Usage Rules

**Navy Primary `#132B6D`** — Gunakan untuk:
- Primary buttons
- Active navigation items
- Focus ring
- Brand emphasis elements
- Important links

**White `#FFFFFF`** — Gunakan untuk:
- Card surfaces
- Main content area
- Form surfaces
- Navigation header background

**Neutral Gray `#F5F5F5`, `#E5E5E5`** — Gunakan untuk:
- Secondary backgrounds
- Disabled field backgrounds
- Input borders
- Separators

**Semantic Colors** — Gunakan hanya untuk makna status. Jangan untuk dekorasi.

### 4.6 Light Theme Only

`[APPROVED DECISION]`

BILIK menggunakan light theme sebagai standar visual saat ini.

- Dark mode global: **tidak ditambahkan**
- E-book reader workspace: **boleh menggunakan dark reading mode** karena merupakan konteks fungsional berbeda

---

## 5. Typography System

### 5.1 Primary Font — Plus Jakarta Sans

`[APPROVED DECISION]` berdasarkan `[VERIFIED FACT]` inspeksi SMK TI BAZMA

**Plus Jakarta Sans** adalah font utama seluruh antarmuka BILIK.

Alasan pemilihan:
- Terverifikasi digunakan pada H1 (`font-size: 30px; font-weight: 700; line-height: 36px`) di website SMK TI BAZMA `[VERIFIED FACT]`
- Terverifikasi digunakan pada H2 (`font-size: 24px; font-weight: 700; line-height: 30px`) di website SMK TI BAZMA `[VERIFIED FACT]`
- Karakter modern, profesional, cocok untuk antarmuka pendidikan dan katalog

**Implementasi target:**
```tsx
// frontend/src/app/layout.tsx — target setelah migrasi
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

> **Status saat ini** `[VERIFIED FACT]`: Font yang digunakan adalah **Geist Sans** (`--font-geist-sans`), bukan Plus Jakarta Sans. Migrasi font termasuk dalam `[PENDING MIGRATION]`. Jangan mengubah `layout.tsx` di luar cakupan keputusan ini.

### 5.2 Font Scale

`[APPROVED DECISION]`

Dua nilai H1 dan H2 merupakan `[VERIFIED FACT]` dari inspeksi. Nilai lainnya adalah design decision BILIK.

| Role | CSS | Desktop | Mobile | Weight | Line Height |
|---|---|---:|---:|---:|---:|
| Hero Display | `text-4xl` | 36px | 28–30px | 700 | 1.2 |
| Page H1 | `text-3xl` | 30px | 24–28px | 700 | 36px |
| Section H2 | `text-2xl` | 24px | 20–22px | 700 | 30px |
| Subsection H3 | `text-xl` / `text-lg` | 18–20px | 16–18px | 600–700 | 1.4 |
| Card Title | `text-base` / `text-sm` | 14–16px | 14–15px | 600 | 1.4 |
| Body Large | `text-base` | 16px | 15–16px | 400 | 1.6 |
| Body Default | `text-sm` | 14px | 14px | 400 | 1.5 |
| Metadata | `text-xs` | 12–13px | 12px | 400 | 1.4 |
| Label / Tag | `text-[11px]` | 11–12px | 11px | 500–600 | 1.3 |

### 5.3 Font Classes yang Tersedia (Eksisting)

`[VERIFIED FACT]` — terdefinisi di `globals.css`:
```css
@theme inline {
  --text-xs: 0.8125rem; /* 13px — override Tailwind default 12px */
}
```

### 5.4 Font Lainnya

| Font | Status | Penggunaan |
|---|---|---|
| **Geist Sans** | `[VERIFIED FACT]` aktif saat ini | Font utama sementara selama migrasi |
| **Geist Mono** | `[VERIFIED FACT]` dimuat di `layout.tsx` | Gunakan terbatas: nomor eksemplar, kode referensi teknis |
| **Familjen Grotesk** | `[PENDING VERIFICATION]` terdeteksi di referensi | Belum dikonfirmasi penggunaannya; bukan font utama |
| **Plus Jakarta Sans** | `[APPROVED DECISION]` target | Font utama setelah migrasi |

---

## 6. Shape Language & Radius System

### 6.1 Design Direction

`[APPROVED DECISION]`

Base radius resmi BILIK adalah **10px (0.625rem)**, berdasarkan inspeksi visual website SMK TI BAZMA.

> **Status saat ini** `[VERIFIED FACT]`: Radius dasar di `globals.css` adalah `0.5rem` (8px). Pembaruan ke 10px termasuk `[PENDING MIGRATION]`.

### 6.2 Radius Scale

`[APPROVED DECISION]`

| Token | Value | Penggunaan |
|---|---:|---|
| `--radius-xs` | 4px (0.25rem) | Elemen sangat kecil, tooltip |
| `--radius-sm` | 8px (0.5rem) | Input, tombol kecil |
| `--radius-md` | 10px (0.625rem) | Base radius — input, button default |
| `--radius-lg` | 12px (0.75rem) | Book card, standard card |
| `--radius-xl` | 16px (1rem) | Featured container, prominent card |
| `--radius-2xl` | 18px (1.125rem) | Hero banner, large modal |
| `--radius-full` | 9999px | Avatar, pill badge, category chip |

### 6.3 Component Radius Map

| Komponen | Radius Target | Tailwind |
|---|---|---|
| Input field | 8–10px | `rounded-lg` atau `rounded-[10px]` |
| Button default | 10–12px | `rounded-[10px]` |
| Book Card | 10–12px | `rounded-xl` |
| Information Card | 12–16px | `rounded-xl` atau `rounded-2xl` |
| Featured / Hero Container | 14–18px | `rounded-2xl` |
| Modal Dialog | 14–18px | `rounded-2xl` |
| Avatar | Full | `rounded-full` |
| Badge / Category Chip | Full | `rounded-full` |
| Search bar container | `rounded-2xl` | Sesuai implementasi existing |

**Larangan:**
- Jangan membuat seluruh komponen pill (`rounded-full`)
- Jangan membuat seluruh komponen kotak (`rounded-none`)
- Jangan mengubah radius acak per halaman tanpa mengacu ke scale ini

---

## 7. Shadow & Elevation System

`[APPROVED DECISION]` berdasarkan `[VERIFIED FACT]` inspeksi visual SMK TI BAZMA

**Shadow adalah bagian wajib dari karakter visual BILIK.** Jangan menghilangkan shadow dari sistem hanya demi minimalisme.

### 7.1 Shadow Scale

**Shadow XS** — Untuk elemen sangat kecil

```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
```

**Shadow SM** — Untuk standard cards `[APPROVED DECISION]`

```css
box-shadow:
  0 1px 3px 0 rgb(0 0 0 / 0.08),
  0 1px 2px -1px rgb(0 0 0 / 0.06);
```

**Shadow MD** — Untuk featured cards dan panel penting `[APPROVED DECISION]`

```css
box-shadow:
  0 4px 6px -1px rgb(0 0 0 / 0.10),
  0 2px 4px -2px rgb(0 0 0 / 0.08);
```

**Shadow LG** — Referensi dari website SMK TI BAZMA `[VERIFIED FACT]`

```css
box-shadow:
  0 10px 15px -3px rgb(0 0 0 / 0.10),
  0 4px 6px -4px rgb(0 0 0 / 0.10);
```

### 7.2 Shadow Usage Rules

| Konteks | Shadow |
|---|---|
| Standard book card | shadow-sm |
| Featured card | shadow-md |
| Hero image, promotional banner | shadow-lg |
| Dropdown, popover | shadow-lg |
| Modal / dialog | shadow-lg |
| Button (subtle) | shadow-xs (opsional) |
| Content section biasa | Tidak wajib |
| Utility bar | Tidak diperlukan |

**Larangan:**
- Jangan `shadow-none` untuk seluruh card
- Jangan `shadow-lg` untuk semua komponen
- Jangan shadow hitam pekat (opacity > 0.15 untuk shadow biasa)
- Jangan nilai shadow acak di luar scale ini

---

## 8. Button System

### 8.1 Variants

`[VERIFIED FACT]` — Semua variant telah ada di `frontend/src/components/ui/button.tsx`

| Variant | Background | Foreground | Hover | Penggunaan |
|---|---|---|---|---|
| `default` (Primary) | `bg-primary` | `text-primary-foreground` | `bg-primary-hover` | Aksi utama, CTA |
| `secondary` | `bg-muted` | `text-foreground` | `bg-muted/80` | Aksi sekunder |
| `outline` | `bg-background` | `text-foreground` | `bg-muted` | Aksi tersier, cancel |
| `ghost` | transparan | `text-foreground` | `bg-muted` | Navigasi, aksi ringan |
| `destructive` | `bg-destructive` | `text-destructive-foreground` | `opacity-90` | Hapus, blokir, kritis |
| `link` | transparan | `text-primary` | underline | Link dalam teks |
| `soft` | `bg-primary-soft` | `text-primary-soft-foreground` | `bg-primary-soft/80` | Soft action, filter aktif |

### 8.2 Sizes

`[VERIFIED FACT]` — Dari `button.tsx`:

| Size | Height | Padding | Font | Min Touch |
|---|---:|---|---|---:|
| `default` | 44px (h-11) | px-4 py-2 | `text-base font-medium` | 44px |
| `sm` | 44px (h-11) | px-3 | `text-sm` | 44px |
| `lg` | 48px (h-12) | px-8 | `text-lg` | 44px |
| `icon` | 44px×44px | — | — | 44px |

> Semua size memiliki `min-h-[44px] min-w-[44px]` sebagai base class `[VERIFIED FACT]`

### 8.3 States

Setiap button harus memiliki state berikut:

| State | Implementation |
|---|---|
| Default | Nilai awal variant |
| Hover | `hover:` prefix |
| Focus-visible | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| Active | `active:bg-primary-active` (primary) |
| Disabled | `disabled:pointer-events-none disabled:opacity-50` |
| Loading | Spinner + `disabled` state (implementasi per kasus) |

### 8.4 Radius Target

Semua button: `rounded-[10px]` (10px) — saat ini menggunakan `rounded-md` (6px). `[PENDING MIGRATION]`

### 8.5 Aturan

- Jangan membuat sistem button kedua di luar `button.tsx`
- Gunakan `asChild` prop untuk `<Link>` yang berfungsi sebagai button
- Semua button interaktif harus punya label aksesibel (`aria-label` atau teks terlihat)
- Jangan `onClick={() => {}}` sebagai placeholder

---

## 9. Form & Input System

### 9.1 Input Field

| Properti | Target |
|---|---|
| Background | `bg-white` / `bg-card` |
| Border | `border border-input` (`#E5E5E5`) |
| Radius | 8–10px (`rounded-lg` atau `rounded-[10px]`) |
| Font | Plus Jakarta Sans (sementara Geist Sans) |
| Font size | 14px (`text-sm`) |
| Placeholder | `text-muted-foreground` |
| Focus | `focus:border-primary focus:ring-2 focus:ring-primary/20` |
| Disabled | `bg-muted border-input opacity-50` |
| Height | Minimum 44px untuk touch target |

### 9.2 Form Labels

- Setiap input **wajib** memiliki `<label htmlFor="...">` yang sesuai dengan `id` input
- Label: `text-sm font-medium text-foreground`
- Label required: tambahkan `*` dengan `aria-hidden="true"` atau teks "(wajib)"

### 9.3 Validation

- Gunakan `:user-invalid` CSS untuk invalid state visual
- Jangan tampilkan error sebelum pengguna berinteraksi dengan field
- Error message: `text-xs text-danger-fg` di bawah field
- Jangan menggunakan warna merah untuk field yang belum pernah diisi

### 9.4 Textarea, Select, Checkbox, Radio

- Radius konsisten dengan input field (8–10px)
- Checkbox dan radio: gunakan elemen native atau Radix UI accessible primitives
- Select: gunakan Radix UI DropdownMenu atau native `<select>` dengan styling konsisten

---

## 10. Search Component

### 10.1 Struktur Integrated Search

`[VERIFIED FACT]` — Implementasi ada di `frontend/src/components/layout/header.tsx`

Search BILIK menggunakan struktur terpadu tiga bagian dalam satu container:

```
[ Dropdown Kategori | Search Input (flex-1) | Tombol Search ]
```

Semua bagian harus terlihat sebagai satu komponen tunggal.

### 10.2 Spesifikasi

| Properti | Nilai |
|---|---|
| Container | `flex h-[44px] rounded-2xl border border-input bg-card` |
| Focus state | `focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20` |
| Shadow | `shadow-xs` |
| Overflow | `overflow-hidden` |
| Kategori dropdown | `border-r border-border`, min width sesuai konten |
| Input | `flex-1 bg-transparent px-3.5 text-sm` |
| Tombol search | `bg-primary hover:bg-primary-hover`, tinggi penuh |

### 10.3 Popular Search Chips

`[VERIFIED FACT]` — Chips berada tepat di bawah search bar, disejajarkan sisi kirinya

- Posisi: tepat di bawah search bar, margin vertikal `gap-2` / `mt-2`
- Alignment: sisi kiri chip = sisi kiri search bar
- Layout: horizontal, `flex gap-1.5`, overflow horizontal tersembunyi di mobile
- Style chip: `rounded-full bg-primary-soft border border-sky-blue px-3 py-0.5 text-[12px] font-medium text-primary-soft-foreground`
- Hover: `hover:bg-pale-blue hover:text-primary`
- Fungsi: klik chip langsung melakukan pencarian dan navigasi ke `/katalog?q=...`

---

## 11. Card & Surface System

### 11.1 Surface Types

**Standard Card**
```
background: bg-card (#FFFFFF)
border: border border-border (#E5E5E5)
radius: rounded-xl (12px)
shadow: shadow-sm
padding: p-4 / p-5
```

**Featured Card**
```
background: bg-card (#FFFFFF)
border: border border-border (opsional)
radius: rounded-2xl (16–18px)
shadow: shadow-md
```

**Information Container**
```
background: bg-muted atau bg-card sesuai konteks
radius: rounded-xl (12px)
padding: p-4 / p-6
border: border border-border (opsional)
```

**Form Container**
```
background: bg-card (#FFFFFF)
radius: rounded-xl (12px)
padding: p-6 / p-8
shadow: shadow-sm (opsional)
```

**Muted Section**
```
background: bg-muted (#F5F5F5)
padding: py-8 / py-12
tidak menggunakan card border
```

### 11.2 Card Rules

Jangan:
- Membuat card di dalam card tanpa alasan fungsional
- Mengemas semua informasi sebagai card
- Menambahkan border pada setiap elemen
- Menggunakan background acak di luar token yang terdefinisi
- Menampilkan dekorasi yang tidak relevan dalam card

---

## 12. Iconography

### 12.1 Library Resmi

`[VERIFIED FACT]` — Seluruh proyek menggunakan **Lucide React**

```tsx
import { Search, ChevronDown, User, BookOpen, ArrowRight } from "lucide-react";
```

### 12.2 Aturan Penggunaan

| Properti | Ketentuan |
|---|---|
| Stroke | Konsisten dengan default Lucide (stroke-width 2) |
| Ukuran | `h-4 w-4` (16px) untuk ikon inline, `h-5 w-5` (20px) untuk standalone |
| Warna | Gunakan token warna, bukan hex langsung |
| Alignment | Gunakan `items-center` Flexbox dengan teks |

### 12.3 Larangan

- Jangan mencampur emoji sebagai ikon utama UI
- Jangan menggunakan Unicode symbols sebagai ikon (kecuali `|` sebagai separator)
- Jangan menggabungkan library ikon berbeda tanpa keputusan desain
- Jangan membuat ikon yang tidak memiliki fungsi

### 12.4 SVG Usage Rules

SVG hanya boleh digunakan untuk:
- Ikon UI melalui Lucide React (import komponen, bukan file SVG langsung)
- Logo vektor brand resmi yang telah disetujui
- Ilustrasi teknis UI: `ilustrasi-404.svg`, `ilustrasi-error.svg`, `ilustrasi-kosong.svg`

SVG yang dilarang:
- Cover buku SVG
- Foto anggota SVG
- Foto perpustakaan SVG
- Banner ilustratif generik SVG

---

## 13. Spacing & Layout

### 13.1 Container Width

`[VERIFIED FACT]` — Implementasi aktif di seluruh layout

```css
/* Container standard BILIK */
.container {
  width: min(calc(100% - 32px), 1280px);
  margin-left: auto;
  margin-right: auto;
}

/* Desktop */
@media (min-width: 640px) {
  .container {
    width: min(calc(100% - 48px), 1280px);
  }
}
```

Tailwind equivalent: `mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)]`

### 13.2 Spacing Scale

`[APPROVED DECISION]` — Berbasis kelipatan 4px, konsisten dengan Tailwind default

| Token | Value | Tailwind |
|---|---:|---|
| 1 | 4px | `p-1`, `m-1`, `gap-1` |
| 2 | 8px | `p-2`, `m-2`, `gap-2` |
| 3 | 12px | `p-3`, `m-3`, `gap-3` |
| 4 | 16px | `p-4`, `m-4`, `gap-4` |
| 5 | 20px | `p-5`, `m-5`, `gap-5` |
| 6 | 24px | `p-6`, `m-6`, `gap-6` |
| 8 | 32px | `p-8`, `m-8`, `gap-8` |
| 10 | 40px | `p-10`, `m-10`, `gap-10` |
| 12 | 48px | `p-12`, `m-12`, `gap-12` |
| 16 | 64px | `p-16`, `m-16`, `gap-16` |

Gunakan Tailwind default spacing. Jangan membuat sistem spacing paralel.

### 13.3 Book Grid

`[VERIFIED FACT]` — Pattern dari katalog

| Breakpoint | Kolom |
|---|---:|
| Mobile (< 640px) | 2 |
| Tablet (640px–1024px) | 3–4 |
| Desktop (> 1024px) | 5 |

### 13.4 Layout Rules

- Gunakan CSS Grid dan Flexbox untuk layout
- Hindari `position: absolute` untuk layout utama
- Hindari overflow horizontal yang tidak disengaja
- Jangan membuat section terlalu padat (minimum `py-8` antar section)
- Jangan membuat ruang kosong berlebihan tanpa konten

---

## 14. Visual Hierarchy

### 14.1 Text Hierarchy

Setiap halaman harus memiliki hierarki yang jelas dan konsisten:

| Level | Element | Style |
|---|---|---|
| 1 | Page Title / H1 | `text-3xl font-bold text-heading` |
| 2 | Section Title / H2 | `text-2xl font-bold text-heading` |
| 3 | Subsection / H3 | `text-xl font-semibold text-heading` |
| 4 | Card Title | `text-base font-semibold text-foreground` |
| 5 | Body Text | `text-sm text-foreground leading-relaxed` |
| 6 | Metadata | `text-xs text-muted-foreground` |
| 7 | Label / Tag | `text-[11px] font-semibold` |

### 14.2 Color as Hierarchy

- `text-heading` (`#092142` saat ini → target `#0A0A0A`): judul penting
- `text-foreground` (`#17365C` saat ini → target `#0A0A0A`): body text
- `text-secondary-text` (`#46617D` saat ini → target `#737373`): deskripsi sekunder
- `text-muted-foreground` (`#748399` saat ini → target `#737373`): metadata, timestamp

---

## 15. BookCard & BookCover

### 15.1 BookCard

BookCard adalah unit tampilan buku utama di katalog dan carousel. Struktur wajib:

```
[ BookCover (2:3) ]
[ Book Title (font-semibold, max 2 baris) ]
[ Author (text-sm text-muted-foreground) ]
[ Status Badge (tersedia/dipinjam/antre) ]
[ Action area (opsional) ]
```

Style card:
- Radius: `rounded-xl` (12px)
- Shadow: `shadow-sm`, naik ke `shadow-md` pada hover
- Background: `bg-card`
- Border: `border border-border`

Hover effect: `group-hover:shadow-md` pada container, `group-hover:scale-[1.02]` pada cover image.

### 15.2 BookCover Component

`[VERIFIED FACT]` — Komponen: `frontend/src/components/media/book-cover.tsx`

```tsx
<BookCover
  src={book.cover_url}
  judul={book.judul}
  kategoriSlug={book.kategori_slug}
  priority={isAboveFold}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
/>
```

Spesifikasi:
- Aspect ratio: **2:3** wajib (`aspect-[2/3]`)
- Radius: `rounded-md` pada wrapper
- Border: `border border-border`
- Shadow: `shadow-xs`, naik ke `shadow-md` pada hover
- Loading state: skeleton shimmer `animate-pulse bg-muted/80`
- Error fallback: fallback per kategori slug, lalu `/images/defaults/cover-umum.png`
- Object fit: `object-contain p-0.5` (default) atau `object-cover` untuk banner

### 15.3 Fallback Cover Map

`[VERIFIED FACT]` — Dari `book-cover.tsx`:

| Kategori Slug | Fallback |
|---|---|
| `teknologi-sija` | `/images/defaults/cover-teknologi.png` |
| `pemrograman-web` | `/images/defaults/cover-pemrograman.png` |
| `jaringan-komputer` | `/images/defaults/cover-jaringan.png` |
| `keislaman`, `keislaman-akhlak` | `/images/defaults/cover-keislaman.png` |
| `sains-matematika` | `/images/defaults/cover-sains.png` |
| `pengembangan-diri` | `/images/defaults/cover-pengembangan.png` |
| (default) | `/images/defaults/cover-umum.png` |

---

## 16. Image & Asset Guidelines

> Lihat [`docs/03-desain/aset-gambar.md`](./aset-gambar.md) untuk kebijakan lengkap (P1 authority).

### 16.1 Ringkasan Kebijakan

| Jenis | Komponen | Rasio | Fallback |
|---|---|---:|---|
| Sampul buku | `<BookCover />` | 2:3 | Per kategori, lalu cover-umum.png |
| Avatar pengguna | `<UserAvatar />` | 1:1 | `/images/defaults/avatar.png` |
| Banner | `<BannerImage />` atau `<Image fill className="object-cover">` | 2:1 | bg-color + border |

### 16.2 Inventaris Aset Aktif

`[VERIFIED FACT]` — Direktori `frontend/public/images/`:

| Direktori | Isi |
|---|---|
| `avatars/` | user-1,2,3.png, user-admin.png, user-pustakawan.png, user-default.png |
| `banners/` | default-banner1,3,5,6,7.png, banner-ebook2.png, pekan-literasi.png |
| `covers/` | cover-*.jpg / .png untuk buku mock |
| `defaults/` | avatar.png, cover-umum.png, cover-default.png, cover-[kategori].png |
| `ilustrasi/` | ilustrasi-404.svg, ilustrasi-error.svg, ilustrasi-kosong.svg, Homepage.png |
| `logo/` | Direktori logo |

### 16.3 Homepage Master Reference

`[VERIFIED FACT]` — File tersedia: `frontend/public/images/ilustrasi/Homepage.png`

Ini adalah Master Visual Reference homepage BILIK yang disetujui. Gunakan sebagai acuan komposisi layout homepage.

### 16.4 Larangan Media

- Dilarang `<img>` tag langsung untuk cover buku
- Dilarang `<Image>` Next.js langsung untuk cover buku (harus melalui `<BookCover />`)
- Dilarang SVG avatar, cover buku, atau foto generatif
- Dilarang membuat cover buku fiktif
- Dilarang merusak rasio gambar (stretch, squish)

---

## 17. Navigation Components

### 17.1 Utility Bar

`[VERIFIED FACT]` — `frontend/src/components/layout/utility-bar.tsx`

- Background: `bg-navy` (`#093A71`) — dipertahankan sebagai navy brand identity
- Height: `h-[38px]`
- Text: `text-white/90 text-xs`
- Konten: nama yayasan (kiri), link info + language selector (kanan)

### 17.2 Header

`[VERIFIED FACT]` — `frontend/src/components/layout/header.tsx`

- Position: `sticky top-0 z-40`
- Background: `bg-white`
- Border: `border-b border-border`
- Height: `py-3.5 sm:py-4` (tidak fixed height)
- Konten: Logo (kiri) | Search + Chips (tengah, hidden di mobile) | Auth (kanan)

### 17.3 Mobile Navigation

`[VERIFIED FACT]` — `frontend/src/components/layout/mobile-nav.tsx`

Mobile search bar tampil di bawah header main row dengan `border-t border-border`.

### 17.4 Footer

`[VERIFIED FACT]` — `frontend/src/components/layout/footer.tsx`

Ikuti token warna yang sudah ada. Jangan membuat footer dengan warna acak.

---

## 18. Page-Specific Design Patterns

### 18.1 Homepage

`[APPROVED DECISION]`

Urutan konten:
1. `<UtilityBar />` — navy bar paling atas
2. `<Header />` — sticky header dengan search
3. `<BannerCarousel />` — hero banner, ratio 2:1
4. Category chips / navigation
5. Book rows (carousel horizontal) per kategori
6. Footer

Karakter: E-commerce discovery page. Prioritaskan visual buku dan search.

### 18.2 Catalog (`/katalog`)

`[APPROVED DECISION]`

Layout: Search/filter sidebar atau top filter bar + Book grid
Grid: 2 kolom mobile, 3–4 tablet, 5 desktop
Fitur: Search, filter kategori, sorting, pagination

### 18.3 Book Detail (`/buku/[id]`)

`[APPROVED DECISION]`

Urutan konten:
1. Breadcrumb navigation
2. Informasi utama buku (cover + metadata primer)
3. Sinopsis lengkap
4. Detail buku (ISBN, penerbit, tahun, halaman, dll)
5. Form rating pengguna (sebelum daftar ulasan)
6. Daftar ulasan
7. Rekomendasi buku terkait

Ringkasan rating: tidak menggunakan grafik distribusi bar.

### 18.4 Member Area (`/profil`, `/pinjaman`, dll)

`[APPROVED DECISION]`

Layout: Banner profil sederhana + Sidebar navigasi + Content area

Sidebar tabs:
- Dashboard
- Data Pribadi
- Riwayat Membaca
- Peminjaman Saya
- Favorit
- Pengaturan Akun
- Daftar Blokir (jika tersedia)

Jangan menampilkan barcode dekoratif atau badge status yang tidak diperlukan.

### 18.5 Admin Dashboard (`/admin`)

`[APPROVED DECISION]`

Pola: Operational dashboard dengan tabel, filter, form, status, action controls.
Jangan memaksakan layout e-commerce publik ke halaman operasional.

### 18.6 Admin Dashboard (`/admin`)

`[APPROVED DECISION]`

Pola: Management interface dengan data table, CRUD operations, statistik fungsional.
Statistik hanya ditampilkan jika datanya tersedia dari backend.

### 18.7 E-book Reader

`[APPROVED DECISION]`

Reading workspace terpisah dari layout utama. Dark reading mode boleh digunakan di sini karena merupakan konteks fungsional berbeda.

---

## 19. Interaction & Motion

### 19.1 Transition Standard

```css
transition-colors: 150ms cubic-bezier(0.4, 0, 0.2, 1)
transition-opacity: 200ms cubic-bezier(0.4, 0, 0.2, 1)
transition-transform: 300ms cubic-bezier(0.4, 0, 0.2, 1)
transition-shadow: 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

### 19.2 Hover Effects

- Button: warna berubah via `hover:bg-*`, durasi 150ms
- Card: shadow naik dari sm ke md, durasi 200ms
- Book cover: subtle scale `scale-[1.02]`, durasi 300ms
- Link: warna berubah, durasi 150ms

### 19.3 Banner Carousel

`[VERIFIED FACT]` — `frontend/src/components/home/banner-carousel.tsx`

- Autoplay interval: 6000ms
- Pause on hover: ya (`isPaused` state)
- Navigasi arrow: tersembunyi saat idle, muncul saat banner di-hover
- Navigasi prev/next: tersedia via clickable zone kiri dan kanan

### 19.4 Reduced Motion

`[VERIFIED FACT]` — Sudah diimplementasikan di `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 20. Responsive Design

### 20.1 Breakpoints

Mengikuti breakpoint default Tailwind CSS:

| Prefix | Min Width | Target Device |
|---|---:|---|
| (none) | 0px | Mobile portrait |
| `sm:` | 640px | Mobile landscape / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide desktop |

### 20.2 Mobile-First Rules

- Selalu desain mobile terlebih dahulu, tambahkan breakpoint untuk layar lebih besar
- Touch target minimum 44px × 44px untuk semua kontrol interaktif `[VERIFIED FACT]` sudah diterapkan
- Hindari overflow horizontal yang tidak disengaja
- Search mobile berada di bawah header dalam row terpisah
- Chips bisa horizontal scroll di mobile

### 20.3 Container Responsif

```css
/* Pattern yang sudah digunakan di seluruh proyek */
mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)]
```

---

## 21. Accessibility

### 21.1 Target Standard

**WCAG 2.1 Level AA**

> Jangan mengklaim kontras sudah lulus sebelum menguji kombinasi aktual terhadap background yang digunakan.

### 21.2 Keyboard Accessibility

- Semua elemen interaktif dapat diakses via Tab
- Urutan focus harus logis mengikuti visual flow
- Gunakan `focus-visible:` prefix untuk focus ring (tidak tampil saat mouse click)
- Jangan menghilangkan focus ring dengan `outline-none` tanpa pengganti yang terlihat

### 21.3 Semantic HTML

- Gunakan heading hierarchy yang benar (H1 → H2 → H3)
- Hanya ada satu H1 per halaman
- Gunakan `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` dengan benar
- Gunakan `<button>` untuk aksi, `<a>` untuk navigasi
- Gunakan `<form>` dengan `<label htmlFor="...">` yang sesuai

### 21.4 Images & Media

- Semua `<Image>` harus memiliki `alt` yang deskriptif
- Dekorasi murni: `alt=""` dengan `aria-hidden="true"`
- Gunakan `aria-label` atau `aria-labelledby` untuk kontrol tanpa teks visible

### 21.5 Dialog & Modal

`[VERIFIED FACT]` — Sudah menggunakan Radix UI Dialog:

- Gunakan native `<dialog>` atau Radix Dialog
- Tambahkan `overscroll-behavior: contain` pada dialog:modal
- Kelola focus trap dan focus restoration

---

## 22. Anti-AI-Slop Rules

> Lihat `.agents/skills/antislop/SKILL.md` untuk aturan lengkap.

**Mode aktif**: `antislop: during (session override)`

### 22.1 Larangan Visual

- Jangan em dash (`—`) dalam UI copy. Gunakan `:` atau `-` atau kurung
- Jangan arbitrary hex class: `text-[#0068C2]`, `bg-[#F8F9FB]`. Gunakan token semantik
- Jangan gradient acak tanpa keputusan desain
- Jangan shadow berlebihan (lebih dari shadow-lg)
- Jangan rounded corners seragam tanpa konteks
- Jangan terlalu banyak warna dalam satu halaman

### 22.2 Larangan Konten

- Jangan subtitle yang mengulang heading
- Jangan deskripsi untuk setiap card
- Jangan badge "Aktif" tanpa makna
- Jangan statistik yang tidak tersedia dari backend
- Jangan barcode atau QR dekoratif
- Jangan cover buku generik AI-generated
- Jangan ikon tanpa fungsi
- Jangan empty card sebagai placeholder dekorasi

### 22.3 Larangan Interaksi

- Jangan `onClick={() => {}}` sebagai placeholder
- Setiap button, tab, filter harus memiliki aksi yang berjalan
- Jangan konten teks yang tidak bisa dibaca (terlalu kecil atau kontras buruk)

### 22.4 Aturan Positif

- Jika elemen tidak membantu pengguna, hilangkan
- Konten harus informatif dan spesifik untuk BILIK, bukan template generik
- Komponen buku harus menampilkan data buku nyata (atau mock yang realistis)

### 22.5 Prinsip Efisiensi Informasi dan Minimalisme Konten

- **Satu Istilah Resmi**: Gunakan secara mutlak istilah "Pengajuan Peminjaman" untuk seluruh antarmuka (menggantikan "Booking").
- **Hapus Redundansi & Instruksi Panjang**: Jangan menaruh paragraf tutorial atau SOP di halaman transaksional (seperti cara pengambilan di meja admin atau tombol kartu anggota bila sudah tersedia di header/navigasi). Informasi tersebut dipusatkan di halaman FAQ atau panduan tersendiri.
- **Informasi Waktu yang Ringkas & Fungsional**: Ganti kotak peringatan/alert panjang dengan indikator countdown real-time yang bersih (`Batas Pengambilan: HH:MM:SS`) dengan pewarnaan urgensi proporsional.
- **Dialog Konfirmasi Minimalis**: Pertahankan dialog konfirmasi yang singkat dan langsung ke inti (contoh: judul "Batalkan Pengajuan?", teks "Apakah Anda yakin ingin membatalkan pengajuan peminjaman ini?", tombol `[Kembali]` dan `[Ya, Batalkan]`).
- **Penyajian Status Ringkas**: Status penolakan disajikan lewat badge status ringkas ("Ditolak") beserta catatan alasan penolakan singkat pada card, tanpa paragraf penjelasan panjang.

---

## 23. Component Architecture

### 23.1 UI Primitives

`[VERIFIED FACT]` — Lokasi: `frontend/src/components/ui/`

| Komponen | Primitif | Pattern |
|---|---|---|
| `button.tsx` | Native `<button>` | CVA variants, Radix Slot |
| `dialog.tsx` | Radix UI Dialog | CVA, accessible |
| `dropdown-menu.tsx` | Radix UI DropdownMenu | Full keyboard nav |
| `tabs.tsx` | Radix UI Tabs | Full keyboard nav |
| `badge.tsx` | Native `<div>` | CVA variants |
| `popover.tsx` | Radix UI Popover | Accessible |
| `skeleton.tsx` | Native `<div>` | Shimmer loading |
| `empty.tsx` | Custom | Empty state |

**Aturan:**
- Semua komponen UI menggunakan `cn()` untuk class merging
- Semua komponen menggunakan `forwardRef` untuk ref forwarding
- Variants dikelola melalui CVA (Class Variance Authority)
- Jangan membuat komponen UI baru yang menduplikasi fungsi yang sudah ada

### 23.2 Media Components

`[VERIFIED FACT]` — Lokasi: `frontend/src/components/media/`

| Komponen | Fungsi | Wajib |
|---|---|---|
| `BookCover` | Semua sampul buku | Ya — tidak boleh menggunakan `<Image>` langsung |
| `UserAvatar` | Semua avatar pengguna | Ya — tidak boleh menggunakan `<Image>` langsung |
| `BannerImage` | Banner carousel | Ya |
| `EmptyState` | State kosong konsisten | Ya untuk halaman dengan empty list |

### 23.3 Layout Components

`[VERIFIED FACT]` — Lokasi: `frontend/src/components/layout/`

| Komponen | Fungsi |
|---|---|
| `header.tsx` | Header utama dengan search terintegrasi |
| `utility-bar.tsx` | Navy bar di atas header |
| `footer.tsx` | Footer global |
| `mobile-nav.tsx` | Navigasi mobile |
| `user-nav.tsx` | Dropdown navigasi pengguna (sudah login) |
| `reservation-popover.tsx` | Status reservasi aktif |

### 23.4 Shared Components

`[VERIFIED FACT]` — Lokasi dan kelompok:

| Kelompok | Lokasi | Komponen |
|---|---|---|
| Book | `components/book/` | `book-card.tsx` |
| Home | `components/home/` | `banner-carousel.tsx`, `book-row.tsx`, `category-chips.tsx` |
| Profile | `components/profile/` | 7 tab komponen profil |

### 23.5 Dependency Stack

`[VERIFIED FACT]`

```
Next.js App Router
├── Tailwind CSS v4 (dengan @theme inline)
├── Radix UI (dialog, dropdown, tabs, popover)
├── Class Variance Authority (CVA)
├── Lucide React (icons)
├── next-intl (i18n)
└── next/font/google (Geist, target: Plus Jakarta Sans)
```

---

## 24. Design Tokens Governance

### 24.1 Single Source of Truth

`[VERIFIED FACT]`

**`frontend/src/app/globals.css`** adalah satu-satunya sumber kebenaran token visual.

Dua lapisan token:
1. `:root {}` — CSS custom properties dengan nilai konkret
2. `@theme inline {}` — Mapping ke Tailwind CSS v4 utility classes

### 24.2 Aturan Pengelolaan Token

- Semua nilai token didefinisikan di `globals.css`
- Jangan mendefinisikan token di tempat lain (component file, inline style)
- Jangan menggunakan nilai hex langsung di class Tailwind: `text-[#132B6D]` **dilarang**
- Semua perubahan token harus melalui `globals.css` dan diperbarui di dokumen ini
- Dokumen `design-tokens.md` diperbarui bersamaan dengan `globals.css`

### 24.3 Naming Convention

```css
/* Brand palette — prefix color- */
--color-navy: ...
--color-deep-blue: ...

/* Semantic UI tokens — tanpa prefix */
--background: ...
--foreground: ...
--primary: ...
--primary-hover: ...
--border: ...
```

### 24.4 Tailwind Mapping

Semua token di `:root` harus dipetakan di `@theme inline` untuk tersedia sebagai Tailwind class:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* dst. */
}
```

---

## 25. Migration Plan

### 25.1 Status Legend

- `CURRENT` — nilai aktual di `globals.css` saat dokumen ini dibuat
- `TARGET` — nilai yang ditetapkan dalam Design System 2.0
- `STATUS` — MATCH / IMPLEMENTED / RETAINED / DEPRECATED

### 25.2 Color Token Migration

| Token | Current Value | Target Value | Status | Komponen Terdampak |
|---|---|---|---|---|
| `--primary` | `#132B6D` | `#132B6D` | IMPLEMENTED | Semua button primary, link aktif, focus ring |
| `--primary-hover` | `#0F2159` | `#0F2159` | IMPLEMENTED | Button primary hover |
| `--primary-active` | `#0A1840` | `#0A1840` | IMPLEMENTED | Button primary active |
| `--primary-soft` | `#EBF0FB` | `#EBF0FB` | IMPLEMENTED | Chips, soft badge |
| `--primary-soft-foreground` | `#132B6D` | `#132B6D` | IMPLEMENTED | Chip text |
| `--ring` | `#132B6D` | `#132B6D` | IMPLEMENTED | Focus ring semua komponen |
| `--background` | `#FFFFFF` | `#FFFFFF` | IMPLEMENTED | Halaman background |
| `--foreground` | `#0A0A0A` | `#0A0A0A` | IMPLEMENTED | Semua body text |
| `--card-foreground` | `#0A0A0A` | `#0A0A0A` | IMPLEMENTED | Teks dalam kartu |
| `--popover-foreground` | `#0A0A0A` | `#0A0A0A` | IMPLEMENTED | Teks dalam popover |
| `--muted` | `#F5F5F5` | `#F5F5F5` | IMPLEMENTED | Muted surface |
| `--muted-foreground` | `#737373` | `#737373` | IMPLEMENTED | Metadata text |
| `--border` | `#E5E5E5` | `#E5E5E5` | IMPLEMENTED | Semua border |
| `--input` | `#E5E5E5` | `#E5E5E5` | IMPLEMENTED | Input border |
| `--destructive` | `#E40014` | `#E40014` | IMPLEMENTED | Destructive button, badge |
| `--color-navy` | `#093A71` | `#093A71` | RETAINED | Utility bar bg — tidak berubah |
| `--color-deep-blue` | `#132B6D` | `#132B6D` | IMPLEMENTED | Dialihkan ke Navy Institutional |
| `--accent-lime` | `#B7D731` | `#B7D731` | RETAINED | Aksen Pertamina |
| `--success-bg` | `#E6F4EA` | `#E6F4EA` | MATCH | Status badge |
| `--success-fg` | `#1B6B3A` | `#1B6B3A` | MATCH | Status text |
| `--warning-bg` | `#FFF1DB` | `#FFF1DB` | MATCH | Status badge |
| `--warning-fg` | `#8A4B00` | `#8A4B00` | MATCH | Status text |
| `--danger-bg` | `#FDEBEC` | `#FDEBEC` | MATCH | Status badge |
| `--danger-fg` | `#B3141B` | `#B3141B` | MATCH | Status text |

### 25.3 Typography Migration

| Item | Current | Target | Status |
|---|---|---|---|
| Font keluarga | Plus Jakarta Sans (`--font-plus-jakarta-sans`) | Plus Jakarta Sans (`--font-sans`) | IMPLEMENTED |
| Font variable | `--font-plus-jakarta-sans` | `--font-sans` | IMPLEMENTED |
| Geist Mono | Aktif, dipakai | Retained untuk kode teknis | RETAINED |
| H1 size | Tailwind default | 30px / `text-3xl` | MATCH |
| H2 size | Tailwind default | 24px / `text-2xl` | MATCH |

### 25.4 Radius Migration

| Token | Current | Target | Status |
|---|---|---|---|
| `--radius` (base) | `0.625rem` (10px) | `0.625rem` (10px) | IMPLEMENTED |
| `--radius-sm` | `0.5rem` (8px) | 8px | IMPLEMENTED |
| `--radius-md` | `0.625rem` (10px) | 10px (base) | IMPLEMENTED |
| `--radius-lg` | `0.75rem` (12px) | 12px | IMPLEMENTED |
| `--radius-xl` | `1rem` (16px) | 16px | IMPLEMENTED |
| `--radius-2xl` | `1.125rem` (18px) | 18px | IMPLEMENTED |
| `--radius-xs` | `0.25rem` (4px) | 4px | IMPLEMENTED |

### 25.5 Shadow Migration

`[IMPLEMENTED]` — Token shadow resmi telah didefinisikan di `globals.css` pada `:root` dan dipetakan di `@theme inline`:
- `--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);`
- `--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06);`
- `--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.08);`
- `--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10);`

### 25.6 Urutan Migrasi yang Direkomendasikan

Urutan berdasarkan dampak dan risiko (dari rendah ke tinggi):

1. **Font addition** — Tambahkan Plus Jakarta Sans, pertahankan Geist sebagai fallback
2. **Radius update** — Update `--radius` base dan tambahkan token baru
3. **Shadow tokens** — Definisikan sebagai CSS custom properties
4. **Primary color** — `#0068C2` → `#132B6D` (dampak terbesar, perlu testing visual)
5. **Background/foreground neutrals** — Setelah primary disetujui
6. **Border dan input** — Update border colors
7. **Deprecate legacy brand tokens** — Setelah seluruh komponen tidak mereferensikannya

> **Peringatan**: Setiap langkah migrasi harus diikuti dengan visual testing di browser sebelum lanjut ke langkah berikutnya.

---

## 26. Validation Checklist

Gunakan checklist ini sebelum menyelesaikan task UI apapun:

### Token & Warna

- [ ] Tidak ada arbitrary hex class (`text-[#...]`, `bg-[#...]`) di markup
- [ ] Semua warna menggunakan token semantik dari `globals.css`
- [ ] Tidak menggunakan `--color-navy` atau `--color-deep-blue` sebagai primary baru

### Tipografi

- [ ] Hierarki heading konsisten (H1 > H2 > H3 > card title > body)
- [ ] Hanya satu H1 per halaman
- [ ] Metadata menggunakan `text-muted-foreground`

### Komponen

- [ ] Semua cover buku menggunakan `<BookCover />`
- [ ] Semua avatar menggunakan `<UserAvatar />`
- [ ] Tidak ada `<img>` atau `<Image>` mentah untuk cover dan avatar
- [ ] Semua button memiliki state: default, hover, focus-visible, disabled
- [ ] Tidak ada `onClick={() => {}}` placeholder

### Aksesibilitas

- [ ] Semua input memiliki `<label htmlFor="...">` yang sesuai
- [ ] Semua image memiliki `alt` yang deskriptif
- [ ] Touch target ≥ 44px × 44px
- [ ] Focus ring terlihat pada semua elemen interaktif
- [ ] Tidak ada `outline-none` tanpa pengganti

### Anti-Slop

- [ ] Tidak ada em dash (`—`) dalam UI copy
- [ ] Tidak ada subtitle yang mengulang heading
- [ ] Tidak ada badge atau ikon dekoratif tanpa fungsi
- [ ] Tidak ada empty card sebagai placeholder

### Quality Gates

- [ ] `npm --prefix frontend run typecheck` → 0 error
- [ ] `npm --prefix frontend run lint` → 0 problem, 0 warning

---

## 27. References & Sources

### Source Code (VERIFIED FACT)

| File | Peran |
|---|---|
| `frontend/src/app/globals.css` | Token implementasi aktif |
| `frontend/src/app/layout.tsx` | Font loading, HTML root |
| `frontend/src/components/ui/button.tsx` | Button system |
| `frontend/src/components/ui/badge.tsx` | Badge system |
| `frontend/src/components/ui/tabs.tsx` | Tab navigation |
| `frontend/src/components/media/book-cover.tsx` | Cover rendering |
| `frontend/src/components/media/user-avatar.tsx` | Avatar rendering |
| `frontend/src/components/layout/header.tsx` | Header & search |
| `frontend/src/components/layout/utility-bar.tsx` | Navy utility bar |
| `frontend/src/components/home/banner-carousel.tsx` | Banner carousel |

### Documentation (P1)

| Dokumen | Peran |
|---|---|
| `AGENTS.md` | Authority hierarchy, skill rules |
| `frontend/AGENTS.md` | Frontend coding conventions |
| `docs/03-desain/aset-gambar.md` | Media asset policy |
| `docs/03-desain/design-tokens.md` | Token documentation |

### External References

| Referensi | Kategori | Keputusan |
|---|---|---|
| SMK TI BAZMA website | VERIFIED FACT inspeksi | Plus Jakarta Sans, shadow LG, base radius |
| Shopee / Tokopedia / Gramedia | ACUAN-POLA | 1280px container, e-commerce grid pattern |
| `shadcn-ui/ui` | PAKAI | Komponen UI, CVA, Radix primitives |
| `miqdadbadjuber/anti-slop` | PAKAI | Anti-AI-slop quality rules |
| `GoogleChrome/modern-web-guidance` | PAKAI | Web platform best practices |

---

## 28. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
| 2.0.0 | 2026-11-23 | Pembuatan awal DESIGN_SYSTEM.md. Navy Institutional brand (`#132B6D`). Plus Jakarta Sans. Radius base 10px. Shadow scale dari referensi SMK TI BAZMA. Migration plan lengkap. |

---

> **Catatan Implementasi**: Seluruh perubahan dalam dokumen ini yang berstatus `[PENDING MIGRATION]` belum diterapkan ke `globals.css` atau komponen. Ini adalah dokumentasi target, bukan pernyataan bahwa implementasi sudah diperbarui. Setiap migrasi memerlukan konfirmasi dan testing terpisah sebelum diterapkan.
