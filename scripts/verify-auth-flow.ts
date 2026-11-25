import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

async function waitForServer(url: string, timeoutMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // Tunggu
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function run() {
  const outputDir = path.resolve(process.cwd(), "docs/03-desain/screenshots/auth-flow");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Memulai Next.js server untuk verifikasi Alur Login & Versi Publik...");
  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    cwd: path.resolve(process.cwd(), "frontend"),
    shell: true,
    stdio: "inherit",
  });

  try {
    const isReady = await waitForServer("http://localhost:3000");
    if (!isReady) throw new Error("Server gagal dimulai dalam 30s");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // 1. Screenshot Homepage Versi Publik (Belum Login - Ada Tombol Masuk)
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const publicHomePath = path.join(outputDir, "01-homepage-versi-publik.png");
    await page.screenshot({ path: publicHomePath, fullPage: true });
    console.log(`[OK] Screenshot 1 (Publik): ${publicHomePath}`);

    // 2. Screenshot Halaman Masuk dengan 3 Kartu Demo
    await page.goto("http://localhost:3000/masuk", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);
    const loginPagePath = path.join(outputDir, "02-halaman-masuk-demo.png");
    await page.screenshot({ path: loginPagePath, fullPage: true });
    console.log(`[OK] Screenshot 2 (Login Demo): ${loginPagePath}`);

    // 3. Klik Demo Login Warga & Ambil Screenshot Homepage Versi Warga
    await page.locator("text=Muhammad Fadhil").click();
    await page.waitForURL("http://localhost:3000");
    await page.waitForTimeout(600);
    const wargaHomePath = path.join(outputDir, "03-homepage-setelah-login-warga.png");
    await page.screenshot({ path: wargaHomePath, fullPage: true });
    console.log(`[OK] Screenshot 3 (Login Warga): ${wargaHomePath}`);

    await context.close();
    await browser.close();
    console.log("✅ Verifikasi alur login sukses!");
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
