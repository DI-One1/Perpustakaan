# AGENTS.md — BILIK Project Standards, AI Guidelines & Development Authority

This document is the **Primary Source of Truth (P1)** governing all AI coding agents, contributors, and developers working on the **BILIK (Basis Informasi & Literasi Islam Terpadu Kejuruan)** digital library platform for SMK TI BAZMA.

---

## 1. Authority Hierarchy by Domain

When resolving requirements, decisions, or code patterns, follow this strict priority order:

```
P1 — PRIMARY SOURCE OF TRUTH (Absolute Compliance)
  ├── 1. Master Concept Consolidation: all-in-one-BILIK.md
  ├── 2. Business Logic: docs/01-arsitektur/aturan-bisnis.md
  ├── 3. Backend Technical Spec: docs/01-arsitektur/spesifikasi-backend.md
  ├── 4. Language & Naming Standard: docs/01-arsitektur/penamaan-dan-bahasa.md
  ├── 5. API Contract: docs/02-api/README.md & docs/02-api/openapi.yaml
  ├── 6. Database Schema: infra/db/migrations/ (managed via dbmate) & docs/01-arsitektur/panduan-basis-data.md
  ├── 7. Visual Design Specification: docs/03-desain/DESIGN_SYSTEM.md
  ├── 8. Design Tokens & Visual Palette: docs/03-desain/design-tokens.md & frontend/src/app/globals.css
  └── 9. Asset Guidelines: docs/03-desain/aset-gambar.md (Strict 2:3 Book Cover, 1:1 Avatar)

P2 — MANDATORY DEVELOPMENT GUIDELINES (Enforced during Implementation)
  ├── 1. Google Chrome Modern Web Guidance (.agents/skills/modern-web-guidance/SKILL.md)
  ├── 2. Anti-AI-Slop Quality Standards (.agents/skills/antislop/SKILL.md — Mode During)
  ├── 3. Google Material Web M3 (.agents/skills/material-web/SKILL.md)
  └── 4. shadcn/ui Component Architecture (.agents/skills/shadcn-ui/SKILL.md)

P3 — SUPPORTING REFERENCES
  ├── 1. Role Workflow Documentation (docs/01-arsitektur/workflow/*.md)
  └── 2. Domain Glossary (docs/00-konteks/glosarium.md)

P4 — NON-AUTHORITATIVE / IRRELEVANT
  └── Generic AI-generated templates, unvetted boilerplate, or legacy "Booking" terminology.
```

---

## 2. Division of Labor for Skills & Agent Governance

1. **Google Chrome Modern Web Guidance (`.agents/skills/modern-web-guidance/SKILL.md`)**
   - Use native `<dialog>` with `.showModal()`, `::backdrop`, and focus restoration (or Radix UI accessible dialog wrappers).
   - Use semantic `<form>`, proper `<label htmlFor="...">`, and full keyboard accessibility (`Tab`, `Escape`, `Enter`).
   - Core Web Vitals (CWV): Proper `<Image sizes="..." priority />` to eliminate CLS.

2. **Anti-AI-Slop Quality Standards (`.agents/skills/antislop/SKILL.md`)**
   - **Mode Declaration**: Announce `antislop active: during (session override).` before any editing task.
   - **R-02 (Copywriting)**: FORBIDDEN to use the em dash (`—`) in UI copy. Use hyphens `-`, colons `:`, or parentheses. Delete subtitles that merely repeat headings.
   - **R-03 (Mobile Responsiveness)**: Flawless mobile viewport, zero unwanted horizontal overflow, minimum 44px × 44px tap targets.
   - **R-25 (Semantic Color Tokens)**: FORBIDDEN to write arbitrary hex classes (`text-[#132B6D]`, `bg-[#FFFFFF]`). Always consume tokens from `globals.css`.
   - **R-26 (Authentic Interactions)**: No dead buttons or placeholder `onClick={() => {}}`.
   - **R-27 (Efisiensi Informasi & Terminologi Baku)**:
     - UI copy MUST use **"Pengajuan Peminjaman"** and **"Direservasi"** (NEVER `"Booking"` / `"Dibooking"`).
     - Code, Database Enums, and API Payloads MUST be **100% Bahasa Indonesia (`snake_case`)** per `docs/01-arsitektur/penamaan-dan-bahasa.md` (e.g. `direservasi`, `pengajuan`, `kode_reservasi`, `menunggu`, `siap_diambil`, `belum_lunas`). Do NOT mix English enum names like `PENDING` or `ALLOCATED`.
     - FORBIDDEN to place long SOP tutorials on transactional pages.
     - Replace verbose time warnings with concise live countdown (`Batas Pengambilan: HH:MM:SS`).
   - **R-28 (Larangan Teks Status Redundan)**:
     - FORBIDDEN to render useless status labels like `"Akun Aktif"` on the frontend UI. Active status is an internal backend concern; if a user can interact, they are active.

3. **Google Material Web M3 (`.agents/skills/material-web/SKILL.md`)**
   - Surface tints, standard interaction state layers (+8% hover, +10% focus, +12% pressed, 38% disabled), and `cubic-bezier(0.2, 0.0, 0, 1.0)`.

4. **shadcn/ui Architecture (`.agents/skills/shadcn-ui/SKILL.md`)**
   - Reusable primitives live in `frontend/src/components/ui/` using Radix UI + CVA + `cn()`.

---

## 3. Master Design Tokens & Palette (Canonical Specification)

Always use standardized tokens from `frontend/src/app/globals.css`:
- `--primary` (`#132B6D`), `--primary-hover` (`#0F2159`), `--primary-active` (`#0A1840`), `--primary-soft` (`#EBF0FB`), `--color-navy` (`#093A71`)
- `--foreground` (`#0A0A0A`), `--color-heading` (`#0A0A0A`), `--muted-foreground` (`#737373`)
- `--background` (`#FFFFFF`), `--card` (`#FFFFFF`), `--border` (`#E5E5E5`), `--muted` (`#F5F5F5`), `--destructive` (`#E40014`)
- **Font:** Plus Jakarta Sans (`font-sans`).

---

## 4. Media & Asset Handling Standards

1. Book Covers: **2:3** (`aspect-[2/3]`) exclusively via `<BookCover />`.
2. User Avatars: **1:1** (`rounded-full`) exclusively via `<UserAvatar />`.
3. Never use generic SVG placeholders for book covers or avatars.

---

## 5. Quality Gates & Definition of Done

Before completing any code change:
- [ ] Semantic tokens used (zero arbitrary hex in markup).
- [ ] No em dash (`—`) and no `"Booking"` / `"Akun Aktif"` labels in UI copy.
- [ ] Code/DB/API naming follows 100% Bahasa Indonesia (`direservasi`, not `dibooking`).
- [ ] `npm --prefix frontend run typecheck` passes with 0 errors.
- [ ] `npm --prefix frontend run lint` passes with 0 errors.
