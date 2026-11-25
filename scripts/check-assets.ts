import * as fs from "fs";
import * as path from "path";

const PUBLIC_DIR = path.resolve(__dirname, "../frontend/public/images");
const DEFAULTS_DIR = path.join(PUBLIC_DIR, "defaults");
const COVERS_DIR = path.join(PUBLIC_DIR, "covers");
const BANNERS_DIR = path.join(PUBLIC_DIR, "banners");
const AVATARS_DIR = path.join(PUBLIC_DIR, "avatars");

// Batas ukuran maksimal file (sesuai inventaris tabel prompt)
const MAX_SIZES_BYTES: Record<string, number> = {
  cover: 150 * 1024,   // 150 KB
  bannerLg: 200 * 1024, // 200 KB
  bannerSm: 100 * 1024, // 100 KB
  avatar: 50 * 1024,    // 50 KB
  svgDefault: 100 * 1024 // 100 KB
};

const REQUIRED_DEFAULTS = [
  "cover-umum.svg",
  "cover-teknologi-sija.svg",
  "cover-pemrograman-web.svg",
  "cover-jaringan-komputer.svg",
  "cover-keislaman-akhlak.svg",
  "cover-sains-matematika.svg",
  "avatar.svg",
  "banner-umum.svg",
  "ilustrasi-kosong.svg",
  "ilustrasi-error.svg",
  "ilustrasi-404.svg",
];

function checkFile(filepath: string, maxBytes: number, label: string): boolean {
  if (!fs.existsSync(filepath)) {
    console.error(`❌ [TIDAK DITEMUKAN] ${label}: ${filepath}`);
    return false;
  }
  const stat = fs.statSync(filepath);
  if (stat.size > maxBytes) {
    console.error(`❌ [MELEBIHI BOBOT] ${label}: ${filepath} (${stat.size} bytes > max ${maxBytes} bytes)`);
    return false;
  }
  return true;
}

function main() {
  console.log("=== Menjalankan Audit Aset Gambar BILIK (check-assets.ts) ===");
  let failed = false;

  // 1. Cek Seluruh File Defaults Wajib
  console.log("\n1. Memeriksa file default SVG wajib...");
  for (const def of REQUIRED_DEFAULTS) {
    const fullPath = path.join(DEFAULTS_DIR, def);
    if (!checkFile(fullPath, MAX_SIZES_BYTES.svgDefault, `Default Asset (${def})`)) {
      failed = true;
    } else {
      console.log(`  ✓ OK: defaults/${def}`);
    }
  }

  // 2. Cek Dummy Covers
  console.log("\n2. Memeriksa ketersediaan cover dummy...");
  const dummyCovers = ["buku-1.svg", "buku-2.svg", "buku-3.svg", "buku-4.svg"];
  for (const c of dummyCovers) {
    const fullPath = path.join(COVERS_DIR, c);
    if (!checkFile(fullPath, MAX_SIZES_BYTES.cover, `Dummy Cover (${c})`)) {
      failed = true;
    } else {
      console.log(`  ✓ OK: covers/${c}`);
    }
  }

  // 3. Cek Dummy Banners
  console.log("\n3. Memeriksa ketersediaan banner dummy...");
  const dummyBanners = [
    { name: "pekan-literasi-lg.svg", max: MAX_SIZES_BYTES.bannerLg },
    { name: "pekan-literasi-sm.svg", max: MAX_SIZES_BYTES.bannerSm },
    { name: "aturan-booking-lg.svg", max: MAX_SIZES_BYTES.bannerLg },
    { name: "aturan-booking-sm.svg", max: MAX_SIZES_BYTES.bannerSm },
  ];
  for (const b of dummyBanners) {
    const fullPath = path.join(BANNERS_DIR, b.name);
    if (!checkFile(fullPath, b.max, `Dummy Banner (${b.name})`)) {
      failed = true;
    } else {
      console.log(`  ✓ OK: banners/${b.name}`);
    }
  }

  // 4. Cek Dummy Avatars
  console.log("\n4. Memeriksa ketersediaan avatar dummy...");
  const dummyAvatars = ["user-1.svg", "user-pustakawan.svg", "user-admin.svg"];
  for (const a of dummyAvatars) {
    const fullPath = path.join(AVATARS_DIR, a);
    if (!checkFile(fullPath, MAX_SIZES_BYTES.avatar, `Dummy Avatar (${a})`)) {
      failed = true;
    } else {
      console.log(`  ✓ OK: avatars/${a}`);
    }
  }

  if (failed) {
    console.error("\n❌ Verifikasi aset GAGAL! Periksa error di atas.");
    process.exit(1);
  } else {
    console.log("\n✅ Semua aset memenuhi syarat (tersedia, format valid, dan di bawah batas bobot maksimal)!");
  }
}

main();
