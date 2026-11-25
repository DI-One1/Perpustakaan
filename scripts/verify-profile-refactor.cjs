const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../frontend/node_modules/@playwright/test"));

async function verifyAndCapture() {
  const artifactDir = "C:/Users/pcbaz/.gemini/antigravity/brain/5cf89ac2-aabf-4817-85bc-27cf4f7ab08c";
  const outDir = path.resolve("docs/03-desain/screenshots/after-profil");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();

  // Desktop 1280
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. Dashboard Tab
  await page.goto("http://localhost:3000/profil?tab=dashboard", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "01-dashboard-desktop.png") });
  await page.screenshot({ path: path.join(artifactDir, "after-01-dashboard-desktop.png") });

  // 2. Data Pribadi Tab
  await page.goto("http://localhost:3000/profil?tab=data-pribadi", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "02-data-pribadi-desktop.png") });
  await page.screenshot({ path: path.join(artifactDir, "after-02-data-pribadi-desktop.png") });

  // 3. Peminjaman Saya Tab
  await page.goto("http://localhost:3000/profil?tab=peminjaman", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "03-peminjaman-desktop.png") });
  await page.screenshot({ path: path.join(artifactDir, "after-03-peminjaman-desktop.png") });

  // 4. Test Native Dialog: Ajukan Perpanjangan
  const extendBtn = page.locator("button:has-text('Ajukan Perpanjangan')").first();
  if (await extendBtn.isVisible()) {
    await extendBtn.click();
    await page.waitForTimeout(300);
    const dialog = page.locator("dialog[open]");
    const isOpen = await dialog.isVisible();
    console.log("Native dialog opened successfully:", isOpen);
    await page.screenshot({ path: path.join(outDir, "04-native-dialog-open.png") });
    await page.screenshot({ path: path.join(artifactDir, "after-04-native-dialog-open.png") });

    // Test Esc key dismiss
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const isClosed = !(await dialog.isVisible());
    console.log("Native dialog dismissed via Escape key:", isClosed);
  }

  // 5. Riwayat Membaca Tab
  await page.goto("http://localhost:3000/profil?tab=riwayat", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "05-riwayat-desktop.png") });
  await page.screenshot({ path: path.join(artifactDir, "after-05-riwayat-desktop.png") });

  // 6. Buku Favorit Tab
  await page.goto("http://localhost:3000/profil?tab=favorit", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "06-favorit-desktop.png") });
  await page.screenshot({ path: path.join(artifactDir, "after-06-favorit-desktop.png") });

  // 7. Pengaturan Akun Tab
  await page.goto("http://localhost:3000/profil?tab=pengaturan", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "07-pengaturan-desktop.png") });
  await page.screenshot({ path: path.join(artifactDir, "after-07-pengaturan-desktop.png") });

  // 8. Mobile 375
  const mContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mPage = await mContext.newPage();
  await mPage.goto("http://localhost:3000/profil?tab=dashboard", { waitUntil: "networkidle" });
  await mPage.screenshot({ path: path.join(outDir, "08-dashboard-mobile.png") });
  await mPage.screenshot({ path: path.join(artifactDir, "after-08-dashboard-mobile.png") });

  await browser.close();
  console.log("All verification and after screenshots completed successfully!");
}

verifyAndCapture().catch((err) => {
  console.error(err);
  process.exit(1);
});
