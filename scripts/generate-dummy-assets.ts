import * as fs from "fs";
import * as path from "path";

// Direktori output
const PUBLIC_DIR = path.resolve(__dirname, "../frontend/public/images");
const COVERS_DIR = path.join(PUBLIC_DIR, "covers");
const BANNERS_DIR = path.join(PUBLIC_DIR, "banners");
const AVATARS_DIR = path.join(PUBLIC_DIR, "avatars");

// Warna token BILIK
const PALETTES = [
  {
    bgStart: "#004B85",
    bgMid: "#0072C6",
    bgEnd: "#00355E",
    accent: "#B7D731",
    accentLight: "#E2F082",
    pill: "#B7D731",
  },
  {
    bgStart: "#0E381E",
    bgMid: "#1B6B3A",
    bgEnd: "#082313",
    accent: "#B7D731",
    accentLight: "#D4E865",
    pill: "#B7D731",
  },
  {
    bgStart: "#1E2633",
    bgMid: "#2B3A4F",
    bgEnd: "#0F141B",
    accent: "#5AB0F0",
    accentLight: "#BFE0FA",
    pill: "#5AB0F0",
  },
  {
    bgStart: "#5C2008",
    bgMid: "#8A4B00",
    bgEnd: "#3D1400",
    accent: "#F2B35A",
    accentLight: "#FFE2B8",
    pill: "#F2B35A",
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate Dummy Book Cover SVG (600x900)
function generateCoverSvg(isbn: string, judul: string, kategori: string): string {
  const hash = hashString(isbn);
  const palette = PALETTES[hash % PALETTES.length];
  const motifType = hash % 3;

  let motifSvg = "";
  if (motifType === 0) {
    motifSvg = `
      <circle cx="320" cy="380" r="140" fill="${palette.bgMid}" fill-opacity="0.08"/>
      <circle cx="320" cy="380" r="100" stroke="${palette.bgMid}" stroke-width="3" stroke-opacity="0.3"/>
      <circle cx="320" cy="380" r="60" stroke="${palette.accent}" stroke-width="3" stroke-opacity="0.8"/>
      <rect x="220" y="280" width="200" height="200" rx="20" stroke="${palette.bgMid}" stroke-width="2" stroke-opacity="0.3" transform="rotate(45 320 380)"/>
    `;
  } else if (motifType === 1) {
    motifSvg = `
      <rect x="180" y="260" width="280" height="240" rx="16" fill="${palette.bgMid}" fill-opacity="0.07" stroke="${palette.bgMid}" stroke-width="2" stroke-opacity="0.3"/>
      <line x1="140" y1="300" x2="500" y2="300" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
      <line x1="140" y1="340" x2="440" y2="340" stroke="${palette.bgMid}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.4"/>
      <line x1="140" y1="380" x2="480" y2="380" stroke="${palette.bgMid}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.4"/>
      <circle cx="480" cy="380" r="8" fill="${palette.accent}"/>
    `;
  } else {
    motifSvg = `
      <path d="M120 220 L480 500" stroke="${palette.bgMid}" stroke-width="4" stroke-opacity="0.25"/>
      <path d="M140 200 L500 480" stroke="${palette.accent}" stroke-width="4" stroke-opacity="0.6"/>
      <circle cx="310" cy="350" r="90" fill="${palette.bgMid}" fill-opacity="0.1"/>
      <circle cx="310" cy="350" r="45" stroke="${palette.bgMid}" stroke-width="3" stroke-opacity="0.4"/>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900" fill="none">
  <rect width="600" height="900" rx="8" fill="#F8FAFC"/>
  <rect x="2" y="2" width="596" height="896" rx="6" stroke="${palette.bgMid}" stroke-width="4" stroke-opacity="0.3"/>
  <rect x="0" y="0" width="48" height="900" rx="4" fill="${palette.bgEnd}" fill-opacity="0.15"/>
  <line x1="48" y1="0" x2="48" y2="900" stroke="${palette.bgMid}" stroke-width="2"/>
  <line x1="56" y1="0" x2="56" y2="900" stroke="${palette.bgMid}" stroke-width="1" stroke-opacity="0.3"/>
  ${motifSvg}
  <rect x="80" y="660" width="440" height="8" rx="4" fill="${palette.accent}"/>
  <rect x="90" y="790" width="160" height="32" rx="6" fill="${palette.bgMid}"/>
  <text x="170" y="811" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">BILIK KOLEKSI</text>
  <rect x="420" y="790" width="110" height="32" rx="6" fill="#EEF1F5"/>
  <text x="475" y="811" fill="#596273" font-family="system-ui, -apple-system, monospace" font-size="12" font-weight="600" text-anchor="middle">EDISI 2026</text>
</svg>`;
}

// Generate PURE GRAPHICAL Dummy Banner SVG (TANPA TEKS, Estetika E-Commerce Modern)
function generateBannerSvg(slug: string, isLg: boolean): string {
  const width = isLg ? 1600 : 800;
  const height = isLg ? 800 : 400;
  const hash = hashString(slug);
  const p = PALETTES[hash % PALETTES.length];
  const scale = isLg ? 1 : 0.5;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
  <defs>
    <linearGradient id="bg_${slug}_${isLg}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bgStart}"/>
      <stop offset="60%" stop-color="${p.bgMid}"/>
      <stop offset="100%" stop-color="${p.bgEnd}"/>
    </linearGradient>
    <linearGradient id="acc_${slug}_${isLg}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.accent}"/>
      <stop offset="100%" stop-color="${p.accentLight}"/>
    </linearGradient>
    <linearGradient id="glow_${slug}_${isLg}" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0"/>
    </linearGradient>
  </defs>

  <!-- Latar Belakang Gradasi Penuh Modern -->
  <rect width="${width}" height="${height}" rx="${16 * scale}" fill="url(#bg_${slug}_${isLg})"/>

  <!-- Ornamen Geometris Lengkung Mengalir (Fluid Curves) -->
  <circle cx="${width * 0.88}" cy="${height * 0.5}" r="${380 * scale}" fill="#FFFFFF" fill-opacity="0.04"/>
  <circle cx="${width * 0.88}" cy="${height * 0.5}" r="${260 * scale}" stroke="url(#acc_${slug}_${isLg})" stroke-width="${3 * scale}" stroke-opacity="0.3"/>
  <circle cx="${width * 0.88}" cy="${height * 0.5}" r="${160 * scale}" fill="url(#acc_${slug}_${isLg})" fill-opacity="0.08"/>

  <!-- Elemen Ilustrasi 3D Flat Vektor (Buku & Cahaya) -->
  <g transform="translate(${width * 0.72}, ${height * 0.28}) scale(${3.5 * scale})" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="#FFFFFF" fill-opacity="0.12"/>
    <path d="M6 6h10"/>
    <path d="M6 10h10"/>
    <path d="M6 14h6"/>
  </g>
  <g transform="translate(${width * 0.84}, ${height * 0.38}) scale(${2.5 * scale})" stroke="url(#acc_${slug}_${isLg})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </g>

  <!-- Bentuk Grafis Mockup Card Abstrak di Sisi Kiri (Tanpa Teks) -->
  <rect x="${100 * scale}" y="${140 * scale}" width="${440 * scale}" height="${250 * scale}" rx="${18 * scale}" fill="url(#glow_${slug}_${isLg})" stroke="#FFFFFF" stroke-width="${1.5 * scale}" stroke-opacity="0.25"/>
  <rect x="${140 * scale}" y="${180 * scale}" width="${90 * scale}" height="${14 * scale}" rx="${7 * scale}" fill="url(#acc_${slug}_${isLg})"/>
  <rect x="${140 * scale}" y="${215 * scale}" width="${320 * scale}" height="${26 * scale}" rx="${13 * scale}" fill="#FFFFFF" fill-opacity="0.85"/>
  <rect x="${140 * scale}" y="${255 * scale}" width="${240 * scale}" height="${18 * scale}" rx="${9 * scale}" fill="#FFFFFF" fill-opacity="0.5"/>
  <rect x="${140 * scale}" y="${305 * scale}" width="${150 * scale}" height="${40 * scale}" rx="${20 * scale}" fill="url(#acc_${slug}_${isLg})"/>

  <!-- Garis Pola & Titik Aksen Bawah -->
  <line x1="${100 * scale}" y1="${520 * scale}" x2="${600 * scale}" y2="${520 * scale}" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="${2 * scale}" stroke-linecap="round"/>
  <line x1="${100 * scale}" y1="${545 * scale}" x2="${380 * scale}" y2="${545 * scale}" stroke="url(#acc_${slug}_${isLg})" stroke-width="${4 * scale}" stroke-linecap="round"/>

  <g fill="#FFFFFF" fill-opacity="0.2">
    <circle cx="${130 * scale}" cy="${640 * scale}" r="${6 * scale}"/>
    <circle cx="${170 * scale}" cy="${640 * scale}" r="${6 * scale}"/>
    <circle cx="${210 * scale}" cy="${640 * scale}" r="${6 * scale}"/>
    <circle cx="${250 * scale}" cy="${640 * scale}" r="${6 * scale}"/>
  </g>
</svg>`;
}

// Generate Dummy User Avatar SVG (256x256)
function generateAvatarSvg(name: string, role: string): string {
  const hash = hashString(name);
  const palette = PALETTES[hash % PALETTES.length];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" fill="none">
  <rect width="256" height="256" rx="128" fill="#F0F4F8"/>
  <circle cx="128" cy="128" r="126" stroke="${palette.bgMid}" stroke-width="4" stroke-opacity="0.4"/>
  <circle cx="128" cy="96" r="44" fill="${palette.bgMid}" fill-opacity="0.2" stroke="${palette.bgMid}" stroke-width="3"/>
  <circle cx="112" cy="94" r="5" fill="${palette.bgEnd}"/>
  <circle cx="144" cy="94" r="5" fill="${palette.bgEnd}"/>
  <path d="M120 110 Q 128 116, 136 110" stroke="${palette.bgEnd}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M48 220 C48 165, 80 155, 128 155 C176 155, 208 165, 208 220" fill="${palette.bgMid}" fill-opacity="0.3" stroke="${palette.bgMid}" stroke-width="3"/>
  <path d="M112 155 L128 185 L144 155" stroke="${palette.accent}" stroke-width="3" fill="none"/>
  <circle cx="190" cy="190" r="16" fill="${palette.accent}" stroke="#FFFFFF" stroke-width="2"/>
</svg>`;
}

const BOOKS_TO_GENERATE = [
  { id: "buku-1", isbn: "978-0134494166", judul: "Clean Architecture", kat: "teknologi-sija" },
  { id: "buku-2", isbn: "978-0133594140", judul: "Konsep Jaringan Komputer", kat: "jaringan-komputer" },
  { id: "buku-3", isbn: "978-1492092148", judul: "Fullstack Modern", kat: "pemrograman-web" },
  { id: "buku-4", isbn: "978-6020523315", judul: "Pendidikan Akhlak & Adab", kat: "keislaman" },
];

const BANNERS_TO_GENERATE = [
  { slug: "pekan-literasi" },
  { slug: "aturan-booking" },
  { slug: "buku-rekayasa-sija" },
];

const AVATARS_TO_GENERATE = [
  { id: "user-1", name: "Ahmad Dahlan", role: "siswa" },
  { id: "user-pustakawan", name: "Ibu Nurul Hidayah", role: "pustakawan" },
  { id: "user-admin", name: "Pak Ridwan Santoso", role: "admin" },
];

function main() {
  console.log("Memperbarui dummy banner murni gambar grafis tanpa teks...");

  for (const b of BOOKS_TO_GENERATE) {
    const filename = `${b.id}.svg`;
    fs.writeFileSync(path.join(COVERS_DIR, filename), generateCoverSvg(b.isbn, b.judul, b.kat), "utf-8");
  }

  for (const ban of BANNERS_TO_GENERATE) {
    const lgName = `${ban.slug}-lg.svg`;
    const smName = `${ban.slug}-sm.svg`;
    fs.writeFileSync(path.join(BANNERS_DIR, lgName), generateBannerSvg(ban.slug, true), "utf-8");
    fs.writeFileSync(path.join(BANNERS_DIR, smName), generateBannerSvg(ban.slug, false), "utf-8");
    console.log(`✓ Banner grafis dibuat: banners/${lgName}, banners/${smName}`);
  }

  for (const av of AVATARS_TO_GENERATE) {
    const filename = `${av.id}.svg`;
    fs.writeFileSync(path.join(AVATARS_DIR, filename), generateAvatarSvg(av.name, av.role), "utf-8");
  }

  console.log("Semua aset banner grafis berhasil diperbarui!");
}

main();
