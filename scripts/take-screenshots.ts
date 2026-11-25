import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

// Tambahkan resolusi 1440 sesuai instruksi Master Tambahan
const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 667 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

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
  const outputDir = path.resolve(process.cwd(), "docs/03-desain/screenshots/after");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Memulai Next.js server untuk verifikasi UI & Image Fallback...");
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

    for (const vp of VIEWPORTS) {
      console.log(`--- Mengambil screenshot resolusi: ${vp.name} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      // 1. Screenshot Homepage
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      const homePath = path.join(outputDir, `homepage-${vp.name}.png`);
      await page.screenshot({ path: homePath, fullPage: true });
      console.log(`[OK] Homepage screenshot: ${homePath}`);

      // 2. Screenshot Katalog Buku
      await page.goto("http://localhost:3000/katalog", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      const katalogPath = path.join(outputDir, `katalog-${vp.name}.png`);
      await page.screenshot({ path: katalogPath, fullPage: true });
      console.log(`[OK] Katalog screenshot: ${katalogPath}`);

      // 3. Screenshot Detail Buku
      await page.goto("http://localhost:3000/buku/buku-1", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      const detailPath = path.join(outputDir, `detail-buku-${vp.name}.png`);
      await page.screenshot({ path: detailPath, fullPage: true });
      console.log(`[OK] Detail Buku screenshot: ${detailPath}`);

      // 4. Screenshot Halaman Masuk
      await page.goto("http://localhost:3000/masuk", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      const masukPath = path.join(outputDir, `masuk-${vp.name}.png`);
      await page.screenshot({ path: masukPath, fullPage: true });
      console.log(`[OK] Masuk screenshot: ${masukPath}`);

      // 5. Cek Image Fallback & Broken Image Verification di Beranda
      if (vp.name === "desktop-1440") {
        console.log("--- Memverifikasi tidak adanya broken images (naturalWidth === 0)... ---");
        await page.goto("http://localhost:3000/katalog", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);
        const brokenImages = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
          return imgs
            .filter((img) => img.naturalWidth === 0)
            .map((img) => ({ src: img.src, alt: img.alt }));
        });

        if (brokenImages.length > 0) {
          console.error("❌ Ditemukan broken image yang gagal fallback:", brokenImages);
          throw new Error("Broken image terdeteksi di katalog!");
        } else {
          console.log("✅ Verifikasi berhasil: 0 broken images! Seluruh fallback bekerja sempurna.");
        }
      }

      await context.close();
    }

    await browser.close();
    console.log("\n✅ Semua screenshot AFTER dan pengujian image fallback berhasil!");
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
