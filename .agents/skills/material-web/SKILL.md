---
name: material-web
description: |
  Material Design 3 (M3) web component, interactive state, and design token guidelines from Google Material Web (material-components/material-web).
  Use when designing or refining component elevation, surface tints, interactive state layers (hover, focus, pressed), motion timing, and typography scales.
---

# Material Web (M3) Design & Component Guidelines

Reference standard adapted from `material-components/material-web` for modern React/Next.js/Tailwind web applications.

## 1. Elevation & Surface Tints

In Material Design 3, elevation is communicated through **surface color tints** combined with subtle ambient shadows, rather than muddy dark drop shadows alone:

| Level | Role | Surface Tint | Shadow Token | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Level 0** | Flat Surface | `bg-background` | None | Page background, table rows |
| **Level 1** | Default Card | `bg-card` | `shadow-2xs` / `shadow-xs` | Cards, list containers, panels |
| **Level 2** | Hover / Raised | `bg-card` + tint | `shadow-sm` | Interactive card hover, floating toolbars |
| **Level 3** | Dialogs / Overlays | `bg-card` | `shadow-xl` / `shadow-2xl` | Native `<dialog>`, modals |
| **Level 4** | Nav Drawer / Sheet | `bg-card` | `shadow-lg` | Mobile navigation drawers |
| **Level 5** | Floating System UI | `bg-heading` | `shadow-2xl` | Toast notifications, critical alerts |

## 2. Interaction State Layers

M3 defines interactive states through consistent opacity layers:
- **Hover**: +8% foreground/primary overlay tint (`hover:bg-primary-hover` or `hover:bg-primary/10`).
- **Focus-Visible**: +10% state tint with a 2px high-contrast ring (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
- **Pressed / Active**: +12% state tint with active scale/depress feedback (`active:scale-[0.98]`).
- **Disabled**: 38% opacity with `cursor-not-allowed` and pointer events disabled.

## 3. Motion Timing & Easing Curves

Never use linear animations for UI transitions. Follow M3 standard curves:
- **Emphasized Easing (Enter)**: `cubic-bezier(0.2, 0.0, 0, 1.0)` — 250ms to 400ms (dialog open, sheet slide-in).
- **Accelerated Easing (Exit)**: `cubic-bezier(0.3, 0.0, 1, 1)` — 150ms to 200ms (dialog close, toast fade-out).
- **Reduced Motion**: Always support `@media (prefers-reduced-motion: reduce)` with zero animation duration.

## 4. Typography Scale Hierarchy

Map headings and body text to M3 semantic categories:
- **Headline (Large / Medium / Small)**: `text-2xl` / `text-xl` / `text-lg` with `font-bold text-heading`.
- **Title (Medium / Small)**: `text-base` / `text-sm` with `font-semibold text-heading`.
- **Body (Medium / Small)**: `text-sm` / `text-xs` with `text-foreground` or `text-secondary-text`.
- **Label (Medium / Small)**: `text-xs` font-medium for badges, form labels, and metadata.

## 5. Touch Target Standards
- Minimum touch target size is **44px × 44px** (48dp in M3 standard).
- Interactive buttons and inputs must never drop below 38px in compact desktop or 44px on mobile touch viewports.
