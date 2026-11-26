# frontend/AGENTS.md — Frontend Engineering & UI Rules

This document enforces technical and visual standards for all files inside `frontend/`. It inherits and strictly enforces the root [`AGENTS.md`](../AGENTS.md) and [`docs/03-desain/DESIGN_SYSTEM.md`](../docs/03-desain/DESIGN_SYSTEM.md).

---

## 1. Visual Authority Hierarchy
1. **Master Spec**: `docs/03-desain/DESIGN_SYSTEM.md`
2. **Backend & Language Standard**: `docs/01-arsitektur/penamaan-dan-bahasa.md` & `docs/01-arsitektur/spesifikasi-backend.md`
3. **Tokens & CSS**: `frontend/src/app/globals.css`
4. **Asset Guidelines**: `docs/03-desain/aset-gambar.md`

---

## 2. Mandatory Rules for Every Frontend Component
1. **Zero Hardcoded Hex Codes**: Always use semantic classes (`text-primary`, `bg-background`, `border-border`, `text-heading`, `text-foreground`, `text-muted-foreground`, `bg-card`).
2. **Copywriting & Anti-Slop (R-02 & R-28)**:
   - NEVER use the em dash (`—`) in UI text.
   - NEVER add filler subtitles that merely repeat the heading.
   - NEVER display useless status badges like `"Akun Aktif"` on UI pages.
3. **Consistencies in Terminology & Bahasa Indonesia (R-27)**:
   - UI MUST use **"Pengajuan Peminjaman"** (never `"Booking"`).
   - Book detail action buttons order: **Left (Outline)** = `Antre Buku`, **Right (Solid Primary)** = `Ajukan Peminjaman`.
   - New code, types, and API payloads MUST follow 100% Bahasa Indonesia (`direservasi`, not `dibooking`) per `docs/01-arsitektur/penamaan-dan-bahasa.md`.
   - Live countdown format: `"Batas Pengambilan: HH:MM:SS"`.
4. **Accessibility & Forms**:
   - Use native `<dialog>` or Radix UI `<Dialog />`.
   - Every `<input>` must have an `id` matching `<label htmlFor="...">` or explicit `aria-label`.
5. **Touch Targets (Material 3)**: Minimum 44px × 44px for mobile interactive controls.
6. **Single-Portal Media**:
   - Book covers exclusively via `<BookCover />` (2:3).
   - User avatars exclusively via `<UserAvatar />` (1:1).
7. **Workspace Concept**:
   - Support *One Identity, Multiple Workspaces* (`Mode Warga`, `Workspace Admin`).

---

## 3. Skills Execution Order & Verification
- **Before Development**: Read `AGENTS.md`, `docs/03-desain/DESIGN_SYSTEM.md`, and `docs/01-arsitektur/penamaan-dan-bahasa.md`.
- **During Development**:
  - Trigger `modern-web-guidance` for HTML/CSS/JS.
  - Declare `antislop active: during (session override).` before editing.
- **After Development**:
  - `npm --prefix frontend run typecheck` (0 errors required).
  - `npm --prefix frontend run lint` (0 errors required).
