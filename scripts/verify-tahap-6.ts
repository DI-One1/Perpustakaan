import { chromium } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

async function isServerUp(url: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(url: string, timeoutMs = 25000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp(url)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function run() {
  const outputDir = path.resolve(process.cwd(), "docs/03-desain/screenshots/tahap-6");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let serverProcess: ChildProcess | null = null;
  const alreadyUp = await isServerUp("http://localhost:3000");

  if (!alreadyUp) {
    console.log("Memulai Next.js production server untuk verifikasi Tahap 6...");
    serverProcess = spawn("npx", ["next", "start", "-p", "3000"], {
      cwd: path.resolve(process.cwd(), "frontend"),
      shell: true,
      stdio: "ignore",
    });

    const isReady = await waitForServer("http://localhost:3000");
    if (!isReady) throw new Error("Gagal memulai server dalam batas waktu 25s");
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Pastikan login sebagai Warga
    await page.goto("http://localhost:3000/masuk", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const wargaCard = page.locator("button:has-text('Pakai Akun Ini')").first();
    if (await wargaCard.isVisible()) {
      await wargaCard.click();
      await page.waitForTimeout(600);
    }

    const pagesToTest = [
      { url: "http://localhost:3000/pinjaman", name: "01-dashboard-pinjaman-warga.png" },
      { url: "http://localhost:3000/antrean", name: "02-dashboard-antrean-booking.png" },
      { url: "http://localhost:3000/favorit", name: "03-dashboard-favorit.png" },
      { url: "http://localhost:3000/profil", name: "04-kartu-anggota-profil.png" },
      { url: "http://localhost:3000/pustakawan", name: "05-overview-meja-pustakawan.png" },
      { url: "http://localhost:3000/pustakawan/sirkulasi", name: "06-meja-sirkulasi-terpadu.png" },
    ];

    for (const item of pagesToTest) {
      console.log(`Mengambil tangkapan layar untuk: ${item.url}`);
      await page.goto(item.url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);
      const savePath = path.join(outputDir, item.name);
      await page.screenshot({ path: savePath, fullPage: true });
      console.log(`[OK] Disimpan: ${savePath}`);
    }

    await browser.close();
    console.log("✅ Seluruh 6 screenshot Tahap 6 tersimpan!");
  } finally {
    if (serverProcess) {
      console.log("Menghentikan server lokal...");
      serverProcess.kill();
    }
  }
}

run().catch((err) => {
  console.error("Gagal verifikasi Tahap 6:", err);
  process.exit(1);
});
