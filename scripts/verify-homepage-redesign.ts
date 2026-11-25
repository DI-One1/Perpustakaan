import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

async function waitForServer(url: string, timeoutMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // Tunggu server siap
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function run() {
  const outputDir = path.resolve(process.cwd(), "docs/03-desain/screenshots/homepage-redesign");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Memulai Next.js production server pada port 3000...");
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    cwd: path.resolve(process.cwd(), "frontend"),
    shell: true,
    stdio: "inherit",
  });

  try {
    const isReady = await waitForServer("http://localhost:3000");
    if (!isReady) {
      throw new Error("Server Next.js tidak merespons dalam 30 detik!");
    }
    console.log("Server Next.js siap pada http://localhost:3000\n");

    const browser = await chromium.launch({ headless: true });

    // 1. Screenshot Viewport Referensi Utama (1536 x 1024)
    console.log("--- Mengambil screenshot viewport 1536x1024 (Master Reference) ---");
    const ctxDesktop = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    const pageDesktop = await ctxDesktop.newPage();
    await pageDesktop.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await pageDesktop.waitForTimeout(1000);

    const desktopPath = path.join(outputDir, "01-homepage-desktop-1536x1024.png");
    await pageDesktop.screenshot({ path: desktopPath, fullPage: false });
    console.log(`[OK] Saved viewport screenshot: ${desktopPath}`);

    const desktopFullPath = path.join(outputDir, "01-homepage-desktop-full.png");
    await pageDesktop.screenshot({ path: desktopFullPath, fullPage: true });
    console.log(`[OK] Saved full page screenshot: ${desktopFullPath}`);

    // Verifikasi broken images
    const brokenImages = await pageDesktop.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
      return imgs
        .filter((img) => img.naturalWidth === 0)
        .map((img) => ({ src: img.src, alt: img.alt }));
    });

    if (brokenImages.length > 0) {
      console.warn("⚠️ Peringatan broken images:", brokenImages);
    } else {
      console.log("✅ 0 broken images! Seluruh aset gambar termuat dengan sempurna.");
    }
    await ctxDesktop.close();

    // 2. Screenshot Mobile Viewport (375 x 812)
    console.log("--- Mengambil screenshot viewport Mobile (375x812) ---");
    const ctxMobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 1,
    });
    const pageMobile = await ctxMobile.newPage();
    await pageMobile.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await pageMobile.waitForTimeout(1000);

    const mobilePath = path.join(outputDir, "02-homepage-mobile.png");
    await pageMobile.screenshot({ path: mobilePath, fullPage: true });
    console.log(`[OK] Saved mobile screenshot: ${mobilePath}`);
    await ctxMobile.close();

    // 3. Screenshot Halaman Katalog (1536 x 1024)
    console.log("--- Mengambil screenshot Katalog 1536x1024 ---");
    const ctxKatalog = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    const pageKatalog = await ctxKatalog.newPage();
    await pageKatalog.goto("http://localhost:3000/katalog", { waitUntil: "networkidle" });
    await pageKatalog.waitForTimeout(1000);

    const katalogPath = path.join(outputDir, "03-katalog-desktop-1536x1024.png");
    await pageKatalog.screenshot({ path: katalogPath, fullPage: true });
    console.log(`[OK] Saved katalog screenshot: ${katalogPath}`);
    await ctxKatalog.close();

    await browser.close();
    console.log("\n✅ Verifikasi visual homepage redesign selesai!");
  } finally {
    console.log("Menghentikan server Next.js...");
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", `${server.pid}`, "/f", "/t"]);
    } else {
      server.kill("SIGTERM");
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
