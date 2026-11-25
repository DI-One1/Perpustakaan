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
  const outputDir = path.resolve(process.cwd(), "docs/03-desain/screenshots/detail-buku");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let serverProcess: ChildProcess | null = null;
  const alreadyUp = await isServerUp("http://localhost:3000");

  if (!alreadyUp) {
    console.log("Memulai Next.js production server untuk verifikasi Detail Buku...");
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
    
    // Desktop View
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto("http://localhost:3000/buku/buku-laskar", { waitUntil: "networkidle" });
    await desktopPage.screenshot({
      path: path.join(outputDir, "01-detail-buku-desktop-full.png"),
      fullPage: true,
    });
    console.log("Screenshot desktop tersimpan: 01-detail-buku-desktop-full.png");

    // Mobile View
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto("http://localhost:3000/buku/buku-laskar", { waitUntil: "networkidle" });
    await mobilePage.screenshot({
      path: path.join(outputDir, "02-detail-buku-mobile-full.png"),
      fullPage: true,
    });
    console.log("Screenshot mobile tersimpan: 02-detail-buku-mobile-full.png");

    await browser.close();
  } finally {
    if (serverProcess && serverProcess.pid) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", serverProcess.pid.toString(), "/f", "/t"]);
      } else {
        serverProcess.kill("SIGTERM");
      }
    }
  }
}

run().catch((err) => {
  console.error("Gagal menjalankan verifikasi detail buku:", err);
  process.exit(1);
});
