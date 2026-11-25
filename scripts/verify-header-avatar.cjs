const path = require("path");
const fs = require("fs");

async function main() {
  const artifactDir = "C:\\Users\\pcbaz\\.gemini\\antigravity\\brain\\5cf89ac2-aabf-4817-85bc-27cf4f7ab08c";
  const { chromium } = require(path.resolve(__dirname, "../frontend/node_modules/@playwright/test"));

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  // Preset warga session
  const wargaSession = {
    id: "usr-warga-1",
    nama: "Muhammad Fadhil",
    identitas: "0061234567",
    peran: "warga",
    kelas_atau_unit: "XII SIJA 1",
    denda_aktif: 0,
    is_blocked: false,
    foto_path: "avatars/user-1.svg",
    foto_url: "/images/avatars/user-1.svg",
    reservasi_aktif: {
      id: "res-101",
      jenis: "booking",
      buku_id: "buku-1",
      buku_judul: "Clean Architecture: Panduan Praktis Arsitektur Perangkat Lunak",
      buku_penulis: "Robert C. Martin",
      kode_booking: "BKG-202611-0042",
      nomor_induk_eksemplar: "EXM-0051-03",
      status: "siap_diambil",
      waktu_tenggat_iso: "2026-11-21T14:30:00+07:00",
      sisa_waktu_teks: "16 jam tersisa",
    },
  };

  const page = await context.newPage();

  // Set localStorage via addInitScript so it loads with user logged in
  await page.addInitScript((session) => {
    window.localStorage.setItem("bilik_active_session", JSON.stringify(session));
  }, wargaSession);

  console.log("1. Navigating to http://localhost:3000 (Homepage) as logged-in user...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Capture header specifically
  const header = page.locator("header");
  const headerPath = path.join(artifactDir, "homepage-header-avatar-only.png");
  if (await header.count() > 0) {
    await header.screenshot({ path: headerPath });
    console.log("Saved header screenshot to:", headerPath);
  } else {
    await page.screenshot({ path: headerPath, clip: { x: 0, y: 0, width: 1280, height: 200 } });
    console.log("Saved top clip screenshot to:", headerPath);
  }

  // Check mobile profile page for horizontal overflow
  console.log("2. Navigating to mobile profile (375px)...");
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.addInitScript((session) => {
    window.localStorage.setItem("bilik_active_session", JSON.stringify(session));
  }, wargaSession);
  await mobilePage.goto("http://localhost:3000/profil", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);

  const overflow = await mobilePage.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasHorizontalScrollbar: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log("Mobile overflow result:", overflow);

  const mobileProfilePath = path.join(artifactDir, "mobile-profile-verified.png");
  await mobilePage.screenshot({ path: mobileProfilePath, fullPage: false });
  console.log("Saved mobile profile screenshot to:", mobileProfilePath);

  await browser.close();
  console.log("Verification completed successfully!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
