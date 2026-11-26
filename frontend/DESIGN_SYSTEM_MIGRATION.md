# BILIK — GLOBAL DESIGN SYSTEM MIGRATION & AI AGENT ECOSYSTEM INTEGRATION

## 1. TASK OBJECTIVE

Saya ingin melakukan pembaruan dan integrasi menyeluruh terhadap Global Design System BILIK sekaligus menghubungkannya dengan seluruh ekosistem AI Agent dan konfigurasi development yang sudah tersedia di repository.

Pekerjaan ini memiliki dua tujuan utama:

**A. Global Design System Migration**

Menerapkan identitas visual baru BILIK berdasarkan dokumentasi resmi yang mengacu pada website SMK TI BAZMA.

**B. AI Agent Ecosystem Integration**

Memastikan seluruh AI Agent yang bekerja pada repository BILIK dapat memahami, mengakses, mengikuti, dan mempertahankan Design System yang sama melalui integrasi dengan AGENTS.md, Anti-Slop, konfigurasi agent, skills, rules, dan workflow yang sudah tersedia.

Saya tidak ingin Design System hanya menjadi dokumentasi yang dibaca sesekali.

Saya ingin Design System menjadi standar visual yang benar-benar digunakan dalam setiap proses pengembangan frontend, baik ketika membuat halaman baru, memperbarui komponen, memperbaiki UI, maupun melakukan refactoring.

Hasil akhirnya harus menciptakan satu ekosistem development yang saling terhubung:

- Design System sebagai sumber spesifikasi visual.
- Design Tokens sebagai referensi implementasi.
- AGENTS.md sebagai instruksi kerja AI Agent.
- frontend/AGENTS.md sebagai panduan operasional frontend.
- Anti-Slop sebagai salah satu mekanisme penjaga kualitas dan konsistensi UI.
- Existing Skills, Rules, Commands, Hooks, Workflows, dan tools sebagai sistem pendukung pekerjaan agent.
- Global CSS dan reusable components sebagai implementasi nyata Design System.

**Prinsip utama: MIGRATE THE DESIGN SYSTEM, CONNECT THE AGENT ECOSYSTEM, PRESERVE THE EXISTING PRODUCT.**

---

# 2. WAJIB MEMBACA DOKUMENTASI DAN MEMAHAMI REPOSITORY

Sebelum melakukan perubahan apa pun, pahami terlebih dahulu arsitektur repository BILIK.

Dokumentasi utama yang wajib dibaca:

- `docs/03-desain/DESIGN_SYSTEM.md`
- `docs/03-desain/design-tokens.md`
- `docs/03-desain/aset-gambar.md`
- `AGENTS.md`
- `frontend/AGENTS.md`

Periksa juga dokumentasi terkait:

- Struktur frontend.
- Konfigurasi styling.
- Reusable UI components.
- Tailwind CSS v4.
- shadcn/ui.
- Radix UI.
- CVA.
- Existing development guidelines.
- Existing testing guidelines.

Untuk konfigurasi AI Agent, lakukan pemeriksaan terhadap seluruh struktur dan file konfigurasi yang benar-benar tersedia di repository.

Contoh lokasi yang dapat diperiksa apabila tersedia:

- `.agents/`
- `.agent/`
- `.claude/`
- `.cursor/`
- `.codex/`
- `.opencode/`
- `.github/`
- `.husky/`
- File konfigurasi Anti-Slop.
- File Agent Rules.
- File Agent Skills.
- File Agent Commands.
- File Agent Hooks.
- File Agent Workflows.
- Konfigurasi modern-web-guidance.
- Konfigurasi referensi UI lainnya seperti shadcn/ui dan material web.
- Konfigurasi dan instruksi development lainnya.

Daftar tersebut merupakan referensi audit, bukan instruksi untuk membuat semua direktori.

Jangan mengasumsikan semua konfigurasi tersebut tersedia atau aktif.

Identifikasi terlebih dahulu tools dan sistem apa saja yang benar-benar digunakan oleh repository BILIK.

### Ketentuan

1. Baca dokumentasi sebelum melakukan perubahan.
2. Pahami fungsi setiap konfigurasi existing.
3. Identifikasi hubungan antara instruksi global dan instruksi khusus.
4. Periksa apakah terdapat aturan yang duplikat atau bertentangan.
5. Periksa apakah Anti-Slop sudah memiliki aturan khusus untuk UI/UX.
6. Periksa apakah terdapat skills atau commands yang dapat membantu implementasi Design System.
7. Periksa apakah sudah terdapat workflow untuk pengembangan frontend.
8. Pertahankan seluruh konfigurasi yang masih berfungsi.
9. Jangan membuat asumsi tentang arsitektur repository.
10. Jangan membuat ulang sistem yang sebenarnya sudah tersedia.

Gunakan `DESIGN_SYSTEM.md` sebagai acuan utama keputusan visual baru.

Gunakan `globals.css` sebagai sumber kebenaran implementasi token frontend saat ini.

Jika spesifikasi dokumentasi dan implementasi berbeda, lakukan migrasi berdasarkan target yang sudah ditentukan dalam task ini.

Jika ditemukan konflik yang belum dapat diselesaikan, dokumentasikan dan laporkan.

---

# 3. DESIGN SYSTEM MIGRATION SCOPE

Fokus migrasi meliputi:

1. Global CSS Tokens.
2. Tailwind CSS v4 Theme Mapping.
3. Font Configuration.
4. Global Typography.
5. Semantic Color System.
6. Radius System.
7. Shadow and Elevation System.
8. Reusable Component Compatibility.
9. Existing Design Token Usage.
10. Design System Documentation Synchronization.

Hasil implementasi harus membuat seluruh halaman BILIK mengikuti identitas visual baru melalui sistem token yang terpusat.

Jangan melakukan redesign seluruh halaman.

Perubahan harus dilakukan pada fondasi global terlebih dahulu agar komponen dan halaman yang sudah ada dapat mengikuti sistem desain yang sama.

---

# 4. PRE-MIGRATION AUDIT

Sebelum mengedit kode, lakukan audit terhadap implementasi frontend.

## A. Global CSS

Periksa:

`frontend/src/app/globals.css`

Identifikasi:

- Seluruh CSS custom properties.
- Struktur `:root`.
- Struktur `@theme inline`.
- Semantic tokens.
- Brand-specific tokens.
- Typography variables.
- Radius variables.
- Shadow variables.
- CSS reset.
- Base styles.
- Tailwind v4 mappings.

Pastikan memahami hubungan setiap token dengan utility classes dan reusable components.

## B. Font Configuration

Periksa:

`frontend/src/app/layout.tsx`

Identifikasi:

- Font yang saat ini dimuat.
- Sumber font.
- Font variables.
- Font weights.
- Font class.
- Penggunaan pada elemen HTML/body.

Jangan menganggap konfigurasi font lama sudah sesuai dengan identitas visual baru.

## C. Existing Token Usage

Audit penggunaan token di:

`frontend/src/**/*`

Identifikasi:

- Token yang masih digunakan.
- Token yang tidak lagi digunakan.
- Token duplikat.
- Token dengan fungsi yang sama.
- Utility classes yang bergantung pada token lama.
- Penggunaan warna hardcoded.
- Penggunaan radius dan shadow yang tidak konsisten.

## D. Existing Component Compatibility

Periksa token dan styling pada:

- `components/ui/`
- `components/layout/`
- `components/book/`
- `components/home/`
- `components/media/`
- `components/profile/`

Pastikan migrasi global tidak merusak reusable components.

## E. Agent Ecosystem Audit

Periksa semua instruksi dan konfigurasi agent yang tersedia.

Identifikasi:

- Global agent instructions.
- Frontend agent instructions.
- Anti-Slop rules.
- Existing UI/UX rules.
- Skills.
- Commands.
- Hooks.
- Workflows.
- MCP configurations.
- Development guidelines.
- Code quality rules.
- Repository-specific instructions.

Untuk setiap konfigurasi, catat fungsinya, lokasi, hubungan dengan konfigurasi lain, dan apakah masih digunakan.

Setelah seluruh audit selesai, tentukan pendekatan integrasi sebelum melakukan perubahan.

---

# 5. GLOBAL COLOR SYSTEM MIGRATION

Ini merupakan perubahan identitas visual utama BILIK.

Primary brand color baru:

**NAVY INSTITUTIONAL — #132B6D**

Warna ini menjadi satu-satunya canonical primary brand color.

Jangan mempertahankan primary blue lama sebagai primary alternatif.

## 5.1 Target Color Tokens

Terapkan target berikut sesuai struktur CSS dan Tailwind v4 existing.

### Brand & Surface

| Token | Target HEX |
|---|---|
| Background | #FFFFFF |
| Foreground | #0A0A0A |
| Card | #FFFFFF |
| Card Foreground | #0A0A0A |
| Popover | #FFFFFF |
| Popover Foreground | #0A0A0A |
| Primary | #132B6D |
| Primary Foreground | #FFFFFF |
| Secondary | #F5F5F5 |
| Secondary Foreground | #132B6D |
| Muted | #F5F5F5 |
| Muted Foreground | #737373 |
| Accent | #F5F5F5 |
| Accent Foreground | #132B6D |
| Border | #E5E5E5 |
| Input | #E5E5E5 |
| Ring | #132B6D |
| Sidebar | #FAFAFA |
| Sidebar Foreground | #0A0A0A |
| Sidebar Primary | #132B6D |
| Sidebar Primary Foreground | #FFFFFF |
| Sidebar Accent | #F5F5F5 |
| Sidebar Accent Foreground | #132B6D |
| Sidebar Border | #E5E5E5 |
| Sidebar Ring | #132B6D |

### Semantic Colors

Tetapkan:

- Destructive: `#E40014`.
- Info: Tailwind Blue 500.
- Success: Tailwind Emerald 500.
- Warning: Tailwind Amber 500.

Jika existing project sudah memiliki pasangan semantic background dan foreground, pertahankan mekanismenya.

Jangan menghilangkan status colors yang dibutuhkan oleh:

- Availability.
- Booking.
- Borrowing.
- Overdue.
- Account restriction.
- Validation.
- Error feedback.

Pastikan foreground dan background memiliki kontras yang memadai.

## 5.2 Legacy Color Migration

Periksa dan migrasikan token lama berikut:

- `#093A71`
- `#074685`
- `#0068C2`
- `#0056A3`
- `#004B85`
- `#092142`
- `#17365C`
- `#46617D`
- `#F8F9FB`
- `#EBEDF2`
- `#748399`
- `#DFE9F3`
- `#EBF2F9`
- `#D7E9F9`
- `#DA1E28`

Ketentuan:

1. Jangan mempertahankan warna lama sebagai primary kedua.
2. Ganti penggunaan primary lama dengan `#132B6D`.
3. Evaluasi warna teks lama dan petakan ke foreground atau muted foreground.
4. Ganti neutral surface lama sesuai sistem baru.
5. Pertahankan semantic colors yang masih diperlukan.
6. Jangan mengubah warna logo resmi.
7. Jangan mengubah warna cover buku dan banner.
8. Jangan menggunakan hardcoded HEX baru di komponen.

Jangan menghapus variable sampai seluruh penggunaannya sudah dialihkan atau kompatibilitasnya dipastikan.

## 5.3 Color Token Governance

Gunakan satu sumber kebenaran.

Semua utility classes dan component styling harus mengambil warna dari token.

Jangan membuat:

- Primary baru di setiap halaman.
- Hardcoded HEX di JSX.
- Custom background berdasarkan selera AI.
- Variasi biru yang tidak terdokumentasi.

Pastikan Tailwind v4 mapping tetap berfungsi.

---

# 6. TYPOGRAPHY MIGRATION

## 6.1 Primary Typeface

Tetapkan:

**Plus Jakarta Sans**

sebagai font utama seluruh aplikasi BILIK.

Acuan typography dari website SMK TI BAZMA:

### H1
- Font: Plus Jakarta Sans.
- Size: 30px.
- Weight: 700.
- Line-height: 36px.

### H2
- Font: Plus Jakarta Sans.
- Size: 24px.
- Weight: 700.
- Line-height: 30px.

Gunakan ini sebagai acuan utama typography BILIK.

Typography scale lainnya tetap mengikuti `DESIGN_SYSTEM.md`.

Jangan mengubah ukuran typography setiap halaman secara sembarangan.

## 6.2 Font Configuration

Periksa:

`frontend/src/app/layout.tsx`

Jika masih menggunakan Geist Sans sebagai font utama, migrasikan ke Plus Jakarta Sans.

Gunakan mekanisme font loading yang sesuai dengan Next.js dan konfigurasi existing.

Jika menggunakan `next/font/google`, gunakan satu instance font terpusat.

Contoh referensi:

```tsx
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});
```

Sesuaikan konfigurasi weight dengan kebutuhan aktual.

Jangan memuat font yang sama berulang kali.

Jangan menambahkan `@import` Google Fonts jika sudah menggunakan `next/font`.

## 6.3 Global Font Mapping

Pastikan mapping:

```css
--font-sans: var(--font-plus-jakarta-sans);
```

atau bentuk yang sesuai dengan arsitektur Tailwind v4 existing.

Pastikan utility `font-sans` benar-benar menggunakan Plus Jakarta Sans.

Terapkan pada:

- Body.
- Heading.
- Button.
- Input.
- Navigation.
- Card.
- Table.
- Dialog.
- Dropdown.
- Badge.
- Tabs.
- Metadata.

## 6.4 Additional Fonts

**Familjen Grotesk**

- Tidak perlu dimuat sebagai font default.
- Pertahankan hanya jika ada penggunaan nyata dan terdokumentasi.
- Jangan menggunakannya secara acak pada heading.

**Geist Mono**

- Boleh dipertahankan untuk kebutuhan teknis.
- Contohnya kode identifikasi eksemplar dan informasi monospaced.
- Jangan menjadikannya font UI utama.

Jika font tambahan tidak lagi digunakan, evaluasi penghapusannya.

Jangan menghapus font yang masih digunakan komponen penting.

---

# 7. RADIUS SYSTEM MIGRATION

Existing project menggunakan base radius:

`--radius: 0.5rem`

Target baru:

`--radius: 0.625rem`

atau 10px.

Tetapkan mapping:

| Token | Target |
|---|---:|
| radius-xs | 4px |
| radius-sm | 8px |
| radius-md | 10px |
| radius-lg | 12px |
| radius-xl | 16px |
| radius-2xl | 18px |
| radius-full | 9999px |

Pastikan mapping ke Tailwind v4 tidak bertabrakan.

Jangan membuat token radius dengan nama sama tetapi nilai berbeda di file lain.

Pertahankan kompatibilitas utility radius existing.

Jangan mengubah seluruh komponen menjadi radius 18px.

Penggunaan radius harus mengikuti jenis komponen dan dokumentasi Design System.

---

# 8. SHADOW AND ELEVATION SYSTEM MIGRATION

Shadow harus menjadi token resmi dalam global CSS.

Jangan menghilangkan shadow secara global.

Tetapkan:

### Shadow XS

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
```

### Shadow SM

```css
--shadow-sm:
  0 1px 3px 0 rgb(0 0 0 / 0.08),
  0 1px 2px -1px rgb(0 0 0 / 0.06);
```

### Shadow MD

```css
--shadow-md:
  0 4px 6px -1px rgb(0 0 0 / 0.10),
  0 2px 4px -2px rgb(0 0 0 / 0.08);
```

### Shadow LG

```css
--shadow-lg:
  0 10px 15px -3px rgb(0 0 0 / 0.10),
  0 4px 6px -4px rgb(0 0 0 / 0.10);
```

Pastikan syntax sesuai Tailwind v4.

Shadow harus dapat digunakan melalui:

- CSS variables.
- Tailwind utilities.
- Component styling.

Jangan mengubah seluruh halaman menjadi shadow-lg.

Jangan memberikan `shadow-none` secara default kepada semua card.

Gunakan elevation sesuai dokumentasi Design System.

---

# 9. TAILWIND CSS V4 INTEGRATION

BILIK menggunakan Tailwind CSS v4.

Pastikan perubahan mengikuti arsitektur yang benar.

Periksa:

- `@import "tailwindcss"`.
- `:root`.
- `@theme inline`.
- CSS custom properties.
- Token color mapping.
- Font mapping.
- Radius mapping.
- Shadow mapping.

Jangan menggunakan pola konfigurasi Tailwind v3 apabila proyek tidak membutuhkannya.

Pastikan semua token dapat digunakan melalui utility classes.

Contoh penggunaan:

```tsx
<div className="bg-background text-foreground">
  <div className="rounded-lg border border-border bg-card shadow-sm">
    Content
  </div>
</div>
```

Pastikan utility tersebut menghasilkan styling berdasarkan token aktual.

Jangan mengubah component architecture hanya untuk mengganti konfigurasi token.

---

# 10. SHADCN, CVA, RADIX AND REUSABLE COMPONENT COMPATIBILITY

BILIK sudah menggunakan reusable UI components berbasis:

- shadcn/ui.
- Radix UI.
- CVA.

Pertahankan arsitektur tersebut.

Audit kompatibilitas:

- `button.tsx`.
- `dialog.tsx`.
- `dropdown-menu.tsx`.
- `tabs.tsx`.
- `badge.tsx`.
- `popover.tsx`.
- `skeleton.tsx`.
- `empty.tsx`.

Pastikan token baru tidak merusak:

- Component variants.
- Foreground dan background.
- Border.
- Focus ring.
- Disabled state.
- Hover.
- Active.
- Dialog elevation.
- Dropdown elevation.

Jangan membangun komponen pengganti.

Jangan mengubah seluruh variant tanpa kebutuhan.

Jika komponen masih menggunakan warna hardcoded atau token lama, lakukan perbaikan minimal yang diperlukan.

Prioritaskan reuse terhadap komponen existing.

---

# 11. DESIGN SYSTEM AND AI AGENT ECOSYSTEM INTEGRATION

Bagian ini merupakan fondasi penting agar migrasi Design System tidak hanya berlaku untuk implementasi saat ini, tetapi juga menjadi standar pengembangan BILIK selanjutnya.

Saya ingin seluruh konfigurasi AI Agent yang sudah tersedia di repository dapat saling terhubung dengan Design System.

Jangan membuat sistem agent baru jika repository sudah memiliki sistem yang berfungsi.

Lakukan integrasi terhadap konfigurasi existing.

## 11.1 Establish a Clear Documentation Architecture

Tetapkan fungsi setiap dokumentasi sebagai berikut.

### A. DESIGN_SYSTEM.md

Lokasi:

`docs/03-desain/DESIGN_SYSTEM.md`

Berfungsi sebagai:

**Single Source of Truth untuk spesifikasi visual BILIK.**

Mencakup:

- Brand identity.
- Color system.
- Typography.
- Spacing.
- Radius.
- Shadow.
- Elevation.
- Component guidelines.
- Layout principles.
- Interaction states.
- Responsive design.
- Visual consistency.

Setiap keputusan visual harus mengikuti dokumentasi ini.

Jangan membuat standar visual yang bertentangan dengannya.

### B. design-tokens.md

Lokasi:

`docs/03-desain/design-tokens.md`

Berfungsi sebagai dokumentasi token desain yang diterapkan frontend.

Pastikan dokumentasi ini menjelaskan token, fungsi, nilai, dan status implementasinya.

Dokumentasi harus sinkron dengan `globals.css`.

### C. aset-gambar.md

Lokasi:

`docs/03-desain/aset-gambar.md`

Berfungsi sebagai referensi aset visual resmi BILIK.

Pastikan agent menggunakan aset yang sudah tersedia sesuai dokumentasi.

Jangan mengganti aset resmi dengan gambar buatan atau sumber lain tanpa kebutuhan dan otorisasi.

### D. AGENTS.md

Lokasi:

`AGENTS.md`

Berfungsi sebagai entry point instruksi global AI Agent.

Pastikan instruksi global mengarahkan agent untuk memahami:

- Arsitektur repository.
- Design System BILIK.
- Aturan coding.
- Aturan development.
- Struktur dokumentasi.
- Agent ecosystem.
- Konfigurasi quality control.

Agent harus memahami bahwa pekerjaan visual tidak boleh dilakukan tanpa mengacu pada Design System.

### E. frontend/AGENTS.md

Lokasi:

`frontend/AGENTS.md`

Berfungsi sebagai instruksi operasional khusus frontend.

Hubungkan dengan:

- Design System.
- Design Tokens.
- Global CSS.
- Tailwind CSS v4.
- Reusable components.
- shadcn/ui.
- Radix UI.
- CVA.
- Responsive guidelines.
- Accessibility guidelines.
- Existing frontend architecture.

Hindari menyalin seluruh isi Design System ke dalam AGENTS.md.

Gunakan referensi dokumentasi agar tidak terjadi duplikasi spesifikasi.

## 11.2 Connect Existing Anti-Slop Configuration

Periksa implementasi Anti-Slop yang sudah dikonfigurasi di repository.

Pahami tujuan, struktur, aturan, dan mekanisme kerjanya.

Hubungkan aturan Anti-Slop yang relevan dengan standar visual BILIK.

Pastikan Anti-Slop mendukung pencegahan:

- UI yang terlalu dekoratif tanpa kebutuhan.
- Penggunaan gradient sembarangan.
- Shadow berlebihan.
- Warna brand yang tidak konsisten.
- Typography yang tidak konsisten.
- Radius yang tidak sesuai.
- Arbitrary styling tanpa alasan.
- Komponen yang duplikatif.
- Elemen UI yang tidak memiliki tujuan UX.
- Perubahan desain yang tidak sesuai Design System.
- Penggunaan visual yang tidak mengikuti pola existing.

Namun, jangan mengasumsikan Anti-Slop hanya berfungsi untuk visual.

Pertahankan seluruh fungsi dan aturan Anti-Slop lainnya yang sudah ada.

Jangan menghapus, menonaktifkan, atau mengganti implementasi Anti-Slop hanya demi integrasi ini.

Jika Anti-Slop sudah memiliki rule yang sesuai, manfaatkan rule tersebut.

Jika terdapat kebutuhan integrasi tambahan, lakukan perubahan minimal pada konfigurasi existing.

## 11.3 Connect Existing Agent Rules, Skills, Commands and Workflows

Lakukan sinkronisasi dengan seluruh sistem pendukung agent yang ditemukan dalam repository.

Periksa:

- Agent Rules.
- Agent Skills.
- Agent Commands.
- Agent Hooks.
- Agent Workflows.
- MCP Configuration.
- Existing Repository Instructions.
- Existing UI/UX Development Rules.
- Code Quality Guidelines.
- Existing Validation Mechanisms.

Pastikan seluruh sistem yang berkaitan dengan pekerjaan frontend memahami dan menggunakan Design System sebagai referensi visual.

Contoh:

Ketika agent mendapatkan task membuat halaman baru, agent harus dapat menemukan dokumentasi Design System melalui instruksi repository.

Ketika agent membuat komponen baru, agent harus mengikuti component guidelines dan memeriksa reusable components existing.

Ketika agent melakukan styling, agent harus menggunakan design tokens yang sudah ditetapkan.

Ketika agent melakukan evaluasi UI, agent harus memeriksa konsistensi visual dan Anti-Slop rules.

Ketika agent melakukan perubahan frontend, agent harus tetap mengikuti quality checks dan workflow existing.

Gunakan mekanisme yang sudah disediakan masing-masing tools.

Jangan membuat sistem integrasi yang tidak kompatibel dengan platform agent yang benar-benar digunakan.

Jangan memasukkan konfigurasi khusus satu agent ke konfigurasi agent lain tanpa memastikan kompatibilitasnya.

## 11.4 Define Design System Governance

Tetapkan aturan permanen bagi AI Agent yang bekerja pada repository BILIK.

### Mandatory Design Rules

1. Setiap pekerjaan yang mengubah UI wajib mengacu pada `DESIGN_SYSTEM.md`.
2. Setiap implementasi styling wajib menggunakan design tokens yang tersedia.
3. Setiap komponen baru harus mengikuti component guidelines.
4. Setiap perubahan visual harus mempertahankan konsistensi halaman lainnya.
5. Agent harus memeriksa reusable components sebelum membuat komponen baru.
6. Agent tidak boleh membuat brand color baru.
7. Agent tidak boleh menciptakan typography, radius, atau shadow baru tanpa dasar dokumentasi.
8. Agent tidak boleh menggunakan hardcoded HEX jika token yang sesuai sudah tersedia.
9. Agent tidak boleh mengubah identitas visual BILIK secara sepihak.
10. Agent harus memeriksa responsive dan accessibility.
11. Agent wajib mempertahankan fungsi dan business logic existing.
12. Agent harus melaporkan konflik implementasi dengan Design System.

### Handling Missing Design Specifications

Jika kebutuhan UI belum memiliki spesifikasi:

1. Periksa apakah sudah terdapat pola serupa pada halaman atau komponen existing.
2. Periksa dokumentasi terkait.
3. Gunakan pola existing jika masih sesuai.
4. Jangan menciptakan standar visual baru secara sembarangan.
5. Jika keputusan desain memiliki dampak besar, minta konfirmasi terlebih dahulu.
6. Catat keputusan yang diperlukan untuk sinkronisasi dokumentasi.

### Handling Conflicting Rules

Jika terdapat konflik antara:

- AGENTS.md.
- frontend/AGENTS.md.
- Anti-Slop.
- Agent Rules.
- Skills.
- Workflows.
- Design System Documentation.
- Existing Component Implementation.

Identifikasi sumber konflik terlebih dahulu.

Gunakan hierarki berdasarkan tanggung jawab:

- Spesifikasi visual mengacu pada `DESIGN_SYSTEM.md`.
- Dokumentasi token mengacu pada `design-tokens.md`.
- Implementasi aktual diperiksa melalui source code frontend.
- Instruksi kerja agent mengikuti AGENTS.md dan aturan turunan sesuai cakupan direktori.
- Konfigurasi tools dan workflow mengikuti mekanisme platform masing-masing.

Jangan menghapus aturan yang bertentangan secara sepihak.

Dokumentasikan konflik yang membutuhkan keputusan.

Jangan mengorbankan keamanan, kualitas kode, atau integritas repository demi memenuhi instruksi visual.

## 11.5 Establish an Integrated Agent Workflow

Pastikan keterhubungan tersebut dapat digunakan dalam pekerjaan sehari-hari.

### Before Development

Sebelum melakukan pekerjaan:

1. Agent membaca instruksi repository yang berlaku.
2. Agent memahami scope task.
3. Jika task berhubungan dengan UI, agent membaca Design System.
4. Agent memeriksa design tokens.
5. Agent memeriksa aset visual jika diperlukan.
6. Agent memeriksa reusable components.
7. Agent memahami Anti-Slop dan aturan frontend yang berlaku.
8. Agent menentukan implementasi berdasarkan arsitektur existing.

### During Development

Ketika melakukan implementasi:

1. Gunakan token resmi.
2. Gunakan reusable components.
3. Ikuti component guidelines.
4. Ikuti responsive guidelines.
5. Ikuti accessibility guidelines.
6. Patuhi Anti-Slop.
7. Hindari duplikasi komponen.
8. Hindari styling di luar standar.
9. Pertahankan business logic dan fungsi existing.
10. Jangan mengubah konfigurasi yang tidak berkaitan dengan task.

### After Development

Setelah implementasi:

1. Periksa konsistensi visual.
2. Periksa penggunaan design tokens.
3. Periksa kemungkinan duplikasi komponen.
4. Periksa Anti-Slop compliance.
5. Jalankan quality checks yang relevan.
6. Sinkronkan dokumentasi jika diperlukan.
7. Laporkan konflik atau penyimpangan.
8. Laporkan file yang berubah.

Workflow ini harus memanfaatkan mekanisme yang sudah tersedia.

Jangan membuat workflow kedua yang menduplikasi fungsi workflow existing.

---

# 12. RESPONSIVE AND GLOBAL BASE STYLES

Pertahankan:

- CSS reset.
- Base layout.
- Responsive behavior.
- Accessibility styles.
- Focus visibility.
- Existing animation rules.

Jangan mengubah layout setiap halaman dalam task ini.

Jangan mengubah:

- Grid homepage.
- Struktur katalog.
- Layout detail buku.
- Profil anggota.
- Dashboard petugas.
- Header positioning.
- Carousel composition.

Perubahan visual yang terjadi secara otomatis akibat token baru memang diharapkan.

Namun, jangan melakukan redesign struktural.

---

# 13. PROTECTED SYSTEMS

Jangan mengubah:

- Database.
- API.
- Authentication.
- Authorization / RBAC.
- Business logic.
- Booking rules.
- Borrowing rules.
- Barcode system.
- Book availability logic.
- Storage.
- Media upload.
- BookCover behavior.
- UserAvatar behavior.
- BannerImage data source.

Jangan mengubah isi data atau gambar.

Jangan membuat aset baru.

Jangan melakukan refactor backend.

Jangan merusak konfigurasi agent, hooks, workflows, atau tools yang sudah berjalan.

---

# 14. IMPLEMENTATION WORKFLOW

Laksanakan pekerjaan secara bertahap dan terukur.

## Step 1 — Repository and Documentation Audit

Baca dokumentasi Design System, instruksi repository, struktur frontend, dan konfigurasi agent.

Buat daftar kondisi existing.

## Step 2 — Design Token Mapping

Identifikasi token lama dan tentukan pemetaannya ke token baru.

Pastikan setiap token memiliki fungsi yang jelas.

## Step 3 — Agent Ecosystem Audit

Identifikasi seluruh konfigurasi agent yang relevan.

Petakan hubungan antara:

- AGENTS.md.
- frontend/AGENTS.md.
- Anti-Slop.
- Agent Rules.
- Skills.
- Commands.
- Hooks.
- Workflows.
- Design System Documentation.

Tentukan konfigurasi mana yang perlu disinkronkan dan mana yang sebaiknya dipertahankan.

## Step 4 — Global CSS Migration

Migrasikan:

- Brand color.
- Neutral palette.
- Semantic colors.
- Typography mapping.
- Radius.
- Shadow.
- Tailwind v4 mappings.

Pertahankan struktur file existing yang masih sesuai.

## Step 5 — Font Configuration

Migrasikan font utama ke Plus Jakarta Sans.

Pastikan font hanya dimuat sekali dan digunakan dengan benar.

## Step 6 — Component Compatibility

Uji shared UI components.

Lakukan perubahan minimal jika diperlukan.

## Step 7 — AI Agent Integration

Sinkronkan AGENTS.md, frontend/AGENTS.md, Anti-Slop, dan konfigurasi agent lain yang relevan.

Pastikan integrasi tidak merusak mekanisme existing.

Jangan membuat konfigurasi baru apabila konfigurasi existing dapat diperluas.

## Step 8 — Documentation Synchronization

Pastikan dokumentasi design tokens, Design System, aset, dan instruksi agent memiliki referensi yang konsisten.

## Step 9 — Visual Verification

Jalankan aplikasi dan ambil screenshot:

- Homepage desktop.
- Homepage mobile.
- Catalog.
- Book detail.
- Member profile.
- Admin atau librarian interface.

Periksa konsistensi visual setelah migrasi.

Jangan melakukan redesign halaman.

## Step 10 — Quality Gates

Jalankan:

- TypeScript check.
- ESLint.
- Vitest.
- Production build.
- Responsive verification.
- Existing repository checks yang relevan.

Jangan mengklaim seluruh pengujian lulus jika belum dijalankan.

---

# 15. VISUAL REGRESSION CHECKLIST

Pastikan setelah migrasi:

- [ ] Plus Jakarta Sans menjadi font utama.
- [ ] Heading menggunakan typography yang konsisten.
- [ ] Primary brand color menjadi #132B6D.
- [ ] Neutral surfaces menggunakan putih dan abu-abu lembut.
- [ ] Border menggunakan neutral system baru.
- [ ] Radius dasar menjadi 10px.
- [ ] Radius scale tetap berfungsi.
- [ ] Shadow XS sampai LG tersedia.
- [ ] Shadow tidak hilang dari sistem.
- [ ] Semantic colors tetap berfungsi.
- [ ] Button variants tidak rusak.
- [ ] Input dan search tidak rusak.
- [ ] Card tidak mengalami overflow.
- [ ] Dialog dan dropdown tetap memiliki elevation.
- [ ] Sidebar tetap konsisten.
- [ ] Tidak ada arbitrary HEX baru.
- [ ] Tidak ada duplikasi font loading.
- [ ] Tidak ada komponen yang kehilangan styling.
- [ ] Tidak ada perubahan business logic.

---

# 16. AI AGENT ECOSYSTEM VERIFICATION

Pastikan setelah integrasi:

- [ ] AGENTS.md mengarahkan agent ke dokumentasi Design System.
- [ ] frontend/AGENTS.md mengatur implementasi Design System pada frontend.
- [ ] Design System menjadi sumber spesifikasi visual utama.
- [ ] design-tokens.md sinkron dengan implementasi.
- [ ] aset-gambar.md dapat digunakan sebagai referensi aset.
- [ ] Anti-Slop tetap berfungsi.
- [ ] Anti-Slop memiliki keterhubungan dengan standar UI BILIK.
- [ ] Existing Agent Rules tetap berfungsi.
- [ ] Existing Skills tetap tersedia.
- [ ] Existing Commands tidak rusak.
- [ ] Existing Hooks tidak rusak.
- [ ] Existing Workflows tidak terganggu.
- [ ] MCP configuration tidak mengalami regresi.
- [ ] Tidak ada aturan yang diduplikasi tanpa kebutuhan.
- [ ] Tidak ada konflik instruksi yang dibiarkan tanpa dokumentasi.
- [ ] Tidak ada konfigurasi existing yang dihapus tanpa alasan.
- [ ] Agent memiliki workflow yang jelas sebelum, selama, dan setelah mengerjakan UI.
- [ ] Agent dapat menemukan dokumentasi yang relevan melalui instruksi repository.

Jangan menandai item sebagai selesai jika belum diverifikasi.

---

# 17. DOCUMENTATION SYNCHRONIZATION

Setelah implementasi:

Periksa apakah dokumentasi berikut perlu disinkronkan:

- `docs/03-desain/DESIGN_SYSTEM.md`
- `docs/03-desain/design-tokens.md`
- `docs/03-desain/aset-gambar.md`
- `AGENTS.md`
- `frontend/AGENTS.md`
- Existing Anti-Slop configuration.
- Existing Agent Rules.
- Existing Skills atau Workflows yang relevan.

Jangan mengubah `DESIGN_SYSTEM.md` secara sembarangan.

Jika dokumentasi target dan implementasi actual sudah sesuai:

- Tandai token terkait sebagai IMPLEMENTED.
- Perbarui migration status.
- Pertahankan informasi target yang belum diterapkan.

Jika belum sesuai:

- Jangan tandai sebagai completed.
- Dokumentasikan perbedaan aktual dan target.

Hindari menyalin seluruh spesifikasi ke banyak file.

Gunakan referensi dan tanggung jawab dokumentasi yang jelas agar tidak ada dua sumber yang memberikan instruksi berbeda.

---

# 18. FINAL REPORT

Setelah seluruh pekerjaan selesai, berikan laporan secara terstruktur.

## A. Changed Files

Daftar setiap file yang benar-benar dimodifikasi dan alasan perubahan.

Pisahkan file implementasi, dokumentasi, dan konfigurasi agent.

## B. Repository Audit

Jelaskan kondisi awal repository dan sistem yang berhasil ditemukan.

## C. Color Migration

Tampilkan tabel:

- Token lama.
- Token baru.
- Status migrasi.

## D. Font Migration

Jelaskan:

- Font lama.
- Font baru.
- File konfigurasi.
- Font variable.
- Font weights yang dimuat.

## E. Radius Migration

Jelaskan nilai awal dan nilai baru.

## F. Shadow Migration

Jelaskan token yang berhasil dibuat dan mapping-nya.

## G. Component Compatibility

Laporkan komponen yang sudah diverifikasi dan perubahan yang dilakukan.

## H. AI Agent Ecosystem Integration

Jelaskan:

- Hubungan DESIGN_SYSTEM.md dengan AGENTS.md.
- Hubungan DESIGN_SYSTEM.md dengan frontend/AGENTS.md.
- Hubungan Design Tokens dengan Global CSS.
- Integrasi Anti-Slop.
- Integrasi existing Agent Rules.
- Integrasi Skills dan Commands.
- Integrasi Hooks dan Workflows jika tersedia.
- Mekanisme yang digunakan agent untuk menemukan dokumentasi.

## I. Preserved Configurations

Daftar konfigurasi existing yang berhasil dipertahankan beserta fungsi pentingnya.

## J. Test Results

Tampilkan hasil:

- TypeScript.
- ESLint.
- Vitest.
- Production build.
- Visual checks.
- Responsive verification.
- Agent configuration checks yang tersedia.

## K. Pending Issues

Laporkan setiap:

- Konflik dokumentasi.
- Konflik konfigurasi.
- Token yang belum dimigrasikan.
- Komponen yang belum kompatibel.
- Agent configuration yang belum terintegrasi.
- Pengujian yang belum dilakukan.

Jangan menyatakan pekerjaan selesai secara keseluruhan apabila masih terdapat bagian penting yang belum diverifikasi.

---

# 19. STRICT EXECUTION RULES

1. Baca dokumentasi sebelum coding.
2. Jangan membuat Design System baru.
3. Jangan menggandakan design tokens.
4. Jangan menggunakan arbitrary HEX.
5. Jangan mengubah layout halaman.
6. Jangan mengganti aset.
7. Jangan mengubah database.
8. Jangan mengubah API.
9. Jangan mengubah business logic.
10. Jangan menghapus reusable components.
11. Jangan mengubah fungsi fitur.
12. Jangan menambahkan dekorasi baru.
13. Jangan menghapus Anti-Slop atau konfigurasi agent existing.
14. Jangan membuat sistem agent duplikat.
15. Jangan merusak konfigurasi tools, skills, rules, hooks, atau workflows.
16. Jangan mengklaim pengujian berhasil jika belum dijalankan.
17. Jangan menghapus compatibility token sebelum memeriksa seluruh dependensinya.
18. Jangan melakukan refactor yang tidak berkaitan dengan task.
19. Prioritaskan integrasi daripada duplikasi.
20. Pertahankan seluruh sistem repository yang masih berfungsi.

Jika menemukan konfigurasi yang belum dipahami, jangan langsung mengubahnya.

Periksa fungsi dan dependensinya terlebih dahulu.

Jika terdapat perubahan yang berisiko terhadap sistem existing, lakukan perubahan minimal dan dokumentasikan dampaknya.

---

# FINAL DIRECTIVE — ONE DESIGN SYSTEM, ONE CONNECTED AGENT ECOSYSTEM

Saya ingin BILIK memiliki satu identitas visual yang konsisten sekaligus satu ekosistem AI Agent yang memahami dan menjaga identitas visual tersebut.

**GLOBAL DESIGN SYSTEM:**

- Primary Navy `#132B6D`.
- Plus Jakarta Sans.
- White & Neutral Surfaces.
- Consistent Rounded Components.
- Soft Layered Shadows.
- Centralized Design Tokens.

**AI AGENT ECOSYSTEM:**

- AGENTS.md.
- frontend/AGENTS.md.
- Anti-Slop.
- Existing Agent Rules.
- Existing Skills.
- Existing Commands.
- Existing Hooks.
- Existing Workflows.
- Repository Development Guidelines.

Semua harus saling terhubung sesuai fungsi dan arsitektur masing-masing.

Saya tidak ingin membangun ulang sistem yang sudah tersedia.

Saya ingin seluruh konfigurasi dan tools yang sudah dikembangkan sebelumnya dimanfaatkan dan disesuaikan agar bekerja bersama Design System BILIK.

Ketika nantinya saya meminta AI Agent membuat halaman baru, memperbarui komponen, memperbaiki tampilan, atau mengembangkan fitur frontend, agent sudah mengetahui:

- Dokumentasi desain yang harus diikuti.
- Token yang harus digunakan.
- Komponen yang harus diprioritaskan.
- Aturan visual yang tidak boleh dilanggar.
- Mekanisme Anti-Slop yang harus dipatuhi.
- Workflow development yang harus dijalankan.
- Quality checks yang harus dilakukan.

**AUDIT FIRST. MIGRATE THE DESIGN SYSTEM. CONNECT EXISTING AGENT CONFIGURATIONS. ESTABLISH DESIGN GOVERNANCE. PRESERVE THE PRODUCT.**

Lakukan seluruh pekerjaan secara terukur, sesuai arsitektur repository, dan tanpa merusak sistem yang sudah berjalan.

Setelah implementasi, integrasi, dokumentasi, serta seluruh verifikasi yang memungkinkan selesai, berikan laporan lengkap dan berhenti menunggu instruksi untuk tahap pengembangan berikutnya.