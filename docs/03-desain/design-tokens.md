# Dokumentasi Sistem Desain & Token Warna BILIK

> **Status:** Single Source of Truth (P1) Implementasi Token Warna BILIK  
> **Terakhir Diperbarui:** 2026-11-23  
> **Versi:** 2.0.0 (Migrasi Navy Institutional & SMK TI BAZMA Visual Reference)  
> **Kepatuhan:** WCAG 2.1 AA, Anti-Slop, Material 3 State Layers

---

## 1. Filosofi & Karakter Visual

1. **Amanah, Religius & Profesional**: Mengadopsi palet korporasi selaras dengan identitas Yayasan BAZMA Pertamina dan SMK TI BAZMA (Navy Institutional `#132B6D`, permukaan putih bersih `#FFFFFF`, teks kontras tinggi `#0A0A0A`, aksen limau Pertamina).
2. **White-Dominant & E-Commerce Rhythm**: Ruang visual lapang berbasis latar putih bersih (`#FFFFFF`) dan permukaan sekunder lembut (`#F5F5F5`), terinspirasi dari pengalaman e-commerce modern dengan kontainer lebar maksimal 1280px.
3. **Anti-Slop (Bebas Polusi AI)**: Menolak gradien ungu generik, menolak teks filler/em dash (`—`), menolak card seragam tanpa hierarki, serta melarang keras penulisan kode warna hex sembarangan (`#[...]`) di dalam kode markup.
4. **Aksesibilitas Teruji (WCAG 2.1 AA)**: Setiap teks normal memenuhi rasio kontras minimal 4.5:1 terhadap latarnya. Target sentuh (touch target) mobile minimal 44px × 44px.

---

## 2. Palet Token Warna Resmi (Master Design Tokens)

Nilai token di bawah ini adalah acuan mutlak yang terdaftar pada `frontend/src/app/globals.css`:

```css
:root {
  /* Canonical Brand Tokens */
  --primary: #132B6D;
  --primary-foreground: #FFFFFF;
  --primary-hover: #0F2159;
  --primary-active: #0A1840;
  --primary-soft: #EBF0FB;
  --primary-soft-foreground: #132B6D;
  --ring: #132B6D;

  /* Neutral Surface & Typography Tokens */
  --background: #FFFFFF;
  --foreground: #0A0A0A;
  --card: #FFFFFF;
  --card-foreground: #0A0A0A;
  --popover: #FFFFFF;
  --popover-foreground: #0A0A0A;
  --secondary: #F5F5F5;
  --secondary-foreground: #132B6D;
  --muted: #F5F5F5;
  --muted-foreground: #737373;
  --accent: #F5F5F5;
  --accent-foreground: #132B6D;
  --border: #E5E5E5;
  --input: #E5E5E5;

  /* Status Semantik */
  --destructive: #E40014;
  --destructive-foreground: #FFFFFF;
  --success-bg: #E6F4EA;
  --success-fg: #1B6B3A;
  --warning-bg: #FFF1DB;
  --warning-fg: #8A4B00;
  --danger-bg: #FDEBEC;
  --danger-fg: #B3141B;

  /* Radius Dasar (10px / 0.625rem) */
  --radius: 0.625rem;
}
```

### Tabel Pemetaan Token Tailwind CSS

| Peran Desain | CSS Variable | Kelas Tailwind Resmi | Nilai Hex |
|---|---|---|---|
| Latar Halaman Utama | `--background` | `bg-background` | `#FFFFFF` |
| Permukaan Kartu/Modal | `--card` | `bg-card` | `#FFFFFF` |
| Judul & Teks Utama | `--foreground` / `--color-heading` | `text-heading`, `text-foreground` | `#0A0A0A` |
| Teks Sekunder/Metadata | `--muted-foreground` | `text-muted-foreground` | `#737373` |
| Garis Batas / Border | `--border` | `border-border` | `#E5E5E5` |
| Border Input Form | `--input` | `border-input` | `#E5E5E5` |
| Tombol/Aksen Utama | `--primary` | `bg-primary`, `text-primary` | `#132B6D` |
| Hover Tombol Utama | `--primary-hover` | `hover:bg-primary-hover` | `#0F2159` |
| Active Tombol Utama | `--primary-active` | `active:bg-primary-active` | `#0A1840` |
| Soft Badge / Chip Aktif | `--primary-soft` | `bg-primary-soft` | `#EBF0FB` |
| Teks Badge Biru | `--primary-soft-foreground` | `text-primary-soft-foreground` | `#132B6D` |
| Latar Bar Utility Atas | `--color-navy` | `bg-navy` | `#093A71` |
| Aksi Destruktif / Kritis | `--destructive` | `bg-destructive` | `#E40014` |

---

## 3. Tipografi

- **Font Family Utama**: Plus Jakarta Sans (`font-sans`), dimuat via `next/font/google` di `frontend/src/app/layout.tsx`.
- **Feature Settings**: `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` dan `-webkit-font-smoothing: antialiased`.
- **Skala Hierarki**:
  - `H1` (Page Title): `text-2xl sm:text-3xl font-bold tracking-tight text-heading` (30px / 36px line-height)
  - `H2` (Section Title): `text-lg sm:text-xl font-bold text-heading` (24px / 30px line-height)
  - `H3` (Card Title): `text-base sm:text-lg font-bold text-heading`
  - Body Text: `text-xs sm:text-sm text-foreground leading-relaxed` (14px)
  - Metadata / Timestamp: `text-xs text-muted-foreground` (13px)
  - Microcopy / Tag: `text-[11px] font-semibold`

---

## 4. Bentuk Komponen (Shape Language) & Radius

- **Radius Dasar**: 10px (`--radius: 0.625rem`)
- **Skala Radius**:
  - `rounded-xs` (4px)
  - `rounded-sm` (8px)
  - `rounded-md` (10px) — base radius
  - `rounded-lg` (12px)
  - `rounded-xl` (16px)
  - `rounded-2xl` (18px)
  - `rounded-full` (9999px)
- **Elevasi & Bayangan**: Menggunakan bayangan lembut M3 & referensi SMK TI BAZMA (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`). Dilarang menggunakan drop shadow buram hitam legam.

---

## 5. Tata Letak & Skala Spasi

- **Lebar Kontainer**: Maksimal 1280px terpusat (`mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)]`).
- **Grid Buku**:
  - Mobile (< 640px): 2 kolom
  - Tablet (640px - 1024px): 3 - 4 kolom
  - Desktop (> 1024px): 5 kolom seimbang
- **Target Sentuh Mobile**: Minimal 44px × 44px pada seluruh kontrol interaktif.
