const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../frontend/node_modules/@playwright/test"));

async function runAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log("=== STARTING POST-REFACTOR FUNCTIONAL QA AUDIT ===\n");

  const results = {
    tabsNavigation: {},
    dialogTests: {},
    formTests: {},
    toastTests: {},
    accessibility: {},
    visualObservations: [],
  };

  // 1. Tab Navigation & Rendering
  const tabs = [
    { id: "dashboard", label: "Dashboard", title: "Dashboard" },
    { id: "riwayat", label: "Riwayat Membaca", title: "Riwayat Membaca" },
    { id: "peminjaman", label: "Peminjaman Saya", title: "Peminjaman Saya" },
    { id: "favorit", label: "Buku Favorit", title: "Buku Favorit" },
    { id: "data-pribadi", label: "Data Pribadi", title: "Data Pribadi" },
    { id: "pengaturan", label: "Pengaturan Akun", title: "Pengaturan Akun" },
    { id: "blokir", label: "Daftar Blokir", title: "Daftar Blokir" },
  ];

  for (const t of tabs) {
    await page.goto(`http://localhost:3000/profil?tab=${t.id}`, { waitUntil: "networkidle" });
    const heading = await page.locator("h2").first().textContent();
    const matches = heading.trim() === t.title;
    results.tabsNavigation[t.id] = {
      expected: t.title,
      actual: heading.trim(),
      passed: matches,
    };
    console.log(`[TAB NAV] ?tab=${t.id} -> Heading: "${heading.trim()}" | Passed: ${matches}`);
  }

  // 2. Functional Testing: Data Pribadi Tab
  console.log("\n--- Testing Tab: Data Pribadi ---");
  await page.goto("http://localhost:3000/profil?tab=data-pribadi", { waitUntil: "networkidle" });

  // Check subtab toggle
  const kontakSubtabBtn = page.locator("button:has-text('Informasi Kontak')");
  await kontakSubtabBtn.click();
  const emailInput = page.locator("input#field-email");
  const isEmailVisible = await emailInput.isVisible();
  console.log("[DATA PRIBADI] Subtab Kontak toggle:", isEmailVisible);

  // Edit contact info and submit
  await emailInput.fill("fadhil.updated@smktibazma.sch.id");
  const saveContactBtn = page.locator("button:has-text('Simpan Perubahan')");
  await saveContactBtn.click();
  await page.waitForTimeout(300);

  // Check toast
  const toastContact = page.locator("[role='status']");
  const toastContactText = await toastContact.textContent();
  console.log("[TOAST] Contact save toast:", toastContactText);
  results.toastTests.contactSave = toastContactText.includes("Informasi kontak berhasil disimpan");

  // Switch back to Informasi Pribadi
  const pribadiSubtabBtn = page.locator("button:has-text('Informasi Pribadi')");
  await pribadiSubtabBtn.click();

  // Check disabled school data fields
  const namaInput = page.locator("input#field-nama");
  const isNamaDisabled = await namaInput.isDisabled();
  const nisInput = page.locator("input#field-nis");
  const isNisDisabled = await nisInput.isDisabled();
  const kelasInput = page.locator("input#field-kelas");
  const isKelasDisabled = await kelasInput.isDisabled();
  console.log("[DATA PRIBADI] School data disabled check:", {
    nama: isNamaDisabled,
    nis: isNisDisabled,
    kelas: isKelasDisabled,
  });
  results.formTests.schoolDataDisabled = isNamaDisabled && isNisDisabled && isKelasDisabled;

  // Test Crop Dialog via Ganti Foto button
  const gantiFotoBtn = page.locator("button:has-text('Ganti Foto')");
  const fileInput = page.locator("input[type='file']");

  // Create a minimal 1x1 test png base64
  const testPngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  await fileInput.setInputFiles({
    name: "test-avatar.png",
    mimeType: "image/png",
    buffer: testPngBuffer,
  });
  await page.waitForTimeout(400);

  // Verify Native Dialog opened
  const cropDialog = page.locator("dialog[aria-labelledby='crop-modal-title']");
  const isCropDialogOpen = await cropDialog.isVisible();
  console.log("[DIALOG 1] Native Crop Dialog opened:", isCropDialogOpen);

  // Test Zoom slider interaction
  const zoomSlider = cropDialog.locator("input[type='range']");
  await zoomSlider.fill("140");
  console.log("[DIALOG 1] Zoom slider adjusted to 140");

  // Apply Crop
  const applyCropBtn = cropDialog.locator("button:has-text('Terapkan Foto')");
  await applyCropBtn.click();
  await page.waitForTimeout(400);

  const isCropDialogClosed = !(await cropDialog.isVisible());
  console.log("[DIALOG 1] Native Crop Dialog closed after apply:", isCropDialogClosed);
  results.dialogTests.cropDialog = isCropDialogOpen && isCropDialogClosed;

  // Verify Focus returned to Ganti Foto button
  const isGantiFotoFocused = await gantiFotoBtn.evaluate((el) => el === document.activeElement);
  console.log("[DIALOG 1] Focus restored to Ganti Foto button:", isGantiFotoFocused);
  results.dialogTests.cropDialogFocusRestored = isGantiFotoFocused;

  // 3. Functional Testing: Peminjaman Saya Tab & Native Dialogs
  console.log("\n--- Testing Tab: Peminjaman Saya ---");
  await page.goto("http://localhost:3000/profil?tab=peminjaman", { waitUntil: "networkidle" });

  // Dialog 2: Ajukan Perpanjangan Pinjaman
  const ajukanBtn = page.locator("button:has-text('Ajukan Perpanjangan')").first();
  await ajukanBtn.click();
  await page.waitForTimeout(400);

  const extendDialog = page.locator("dialog[aria-labelledby='extend-modal-title']");
  const isExtendOpen = await extendDialog.isVisible();
  console.log("[DIALOG 2] Ajukan Perpanjangan Dialog opened:", isExtendOpen);

  // Test Escape key dismiss on Dialog 2
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const isExtendClosedByEsc = !(await extendDialog.isVisible());
  console.log("[DIALOG 2] Dismissed via Escape key:", isExtendClosedByEsc);

  // Re-open and submit with reason
  await ajukanBtn.click();
  await page.waitForTimeout(300);
  const reasonTextarea = extendDialog.locator("textarea#reason");
  await reasonTextarea.fill("Membutuhkan waktu tambahan untuk menyelesaikan modul praktikum.");
  const submitExtendBtn = extendDialog.locator("button:has-text('Kirim Permohonan')");
  await submitExtendBtn.click();
  await page.waitForTimeout(400);

  const isExtendClosedAfterSubmit = !(await extendDialog.isVisible());
  const toastExtend = page.locator("[role='status']");
  const toastExtendText = await toastExtend.textContent();
  console.log("[DIALOG 2] Closed after submit:", isExtendClosedAfterSubmit);
  console.log("[TOAST] Extend toast message:", toastExtendText);
  results.dialogTests.extendDialog = isExtendOpen && isExtendClosedByEsc && isExtendClosedAfterSubmit;

  // Switch to Booking subtab
  const bookingSubtabBtn = page.locator("button:has-text('Booking')");
  await bookingSubtabBtn.click();
  await page.waitForTimeout(300);

  // Dialog 3: Batalkan Booking Dialog
  const batalBookingBtn = page.locator("button:has-text('Batalkan Booking')").first();
  await batalBookingBtn.click();
  await page.waitForTimeout(400);

  const cancelDialog = page.locator("dialog[aria-labelledby='cancel-modal-title']");
  const isCancelDialogOpen = await cancelDialog.isVisible();
  console.log("[DIALOG 3] Batalkan Booking Dialog opened:", isCancelDialogOpen);

  // Test Backdrop dismissal by clicking outside rect
  const dialogBox = await cancelDialog.boundingBox();
  // Click 10px outside top-left of dialog
  await page.mouse.click(dialogBox.x - 20, dialogBox.y - 20);
  await page.waitForTimeout(400);
  const isCancelClosedByBackdrop = !(await cancelDialog.isVisible());
  console.log("[DIALOG 3] Dismissed via Backdrop click:", isCancelClosedByBackdrop);

  // Re-open and confirm cancellation
  await batalBookingBtn.click();
  await page.waitForTimeout(300);
  const confirmCancelBtn = cancelDialog.locator("button:has-text('Ya, Batalkan')");
  await confirmCancelBtn.click();
  await page.waitForTimeout(400);

  const isCancelClosedAfterConfirm = !(await cancelDialog.isVisible());
  const toastCancel = page.locator("[role='status']");
  const toastCancelText = await toastCancel.textContent();
  console.log("[DIALOG 3] Closed after confirmation:", isCancelClosedAfterConfirm);
  console.log("[TOAST] Booking cancel toast message:", toastCancelText);
  results.dialogTests.cancelBookingDialog = isCancelDialogOpen && isCancelClosedByBackdrop && isCancelClosedAfterConfirm;

  // 4. Functional Testing: Buku Favorit Tab
  console.log("\n--- Testing Tab: Buku Favorit ---");
  await page.goto("http://localhost:3000/profil?tab=favorit", { waitUntil: "networkidle" });
  const initialCardsCount = await page.locator("button:has-text('Hapus')").count();
  console.log("[BUKU FAVORIT] Initial favorite books count:", initialCardsCount);

  // Click Hapus on first book
  const firstHapusBtn = page.locator("button:has-text('Hapus')").first();
  await firstHapusBtn.click();
  await page.waitForTimeout(300);

  const remainingCardsCount = await page.locator("button:has-text('Hapus')").count();
  const toastFav = page.locator("[role='status']");
  const toastFavText = await toastFav.textContent();
  console.log("[BUKU FAVORIT] Remaining favorite books count:", remainingCardsCount);
  console.log("[TOAST] Favorite remove toast message:", toastFavText);
  results.formTests.favoriteRemove = remainingCardsCount === initialCardsCount - 1;

  // 5. Functional Testing: Pengaturan Akun Tab
  console.log("\n--- Testing Tab: Pengaturan Akun ---");
  await page.goto("http://localhost:3000/profil?tab=pengaturan", { waitUntil: "networkidle" });

  // Test Password show/hide toggle
  const pwdInput = page.locator("input#pwd-old");
  const eyeBtn = page.locator("button[aria-label='Tampilkan kata sandi']").first();
  await eyeBtn.click();
  const pwdTypeAfterToggle = await pwdInput.getAttribute("type");
  console.log("[PENGATURAN] Password visibility toggle:", pwdTypeAfterToggle === "text");

  // Test Notification Subtab checkboxes
  const notifSubtabBtn = page.locator("button:has-text('Notifikasi')");
  await notifSubtabBtn.click();
  await page.waitForTimeout(300);

  const checkboxes = page.locator("input[type='checkbox']");
  const checkCount = await checkboxes.count();
  console.log("[PENGATURAN] Notification checkboxes count:", checkCount);

  const saveNotifBtn = page.locator("button:has-text('Simpan Perubahan')");
  await saveNotifBtn.click();
  await page.waitForTimeout(300);

  const toastNotif = page.locator("[role='status']");
  const toastNotifText = await toastNotif.textContent();
  console.log("[TOAST] Notification save toast message:", toastNotifText);
  results.formTests.notifSave = toastNotifText.includes("Preferensi notifikasi berhasil disimpan");

  // 6. Functional Testing: Daftar Blokir Tab
  console.log("\n--- Testing Tab: Daftar Blokir ---");
  await page.goto("http://localhost:3000/profil?tab=blokir", { waitUntil: "networkidle" });
  const cleanNotice = page.locator("text='Tidak ada catatan pemblokiran.'");
  const isCleanNoticeVisible = await cleanNotice.isVisible();
  console.log("[DAFTAR BLOKIR] Clean state message visible:", isCleanNoticeVisible);
  results.formTests.cleanBlockNotice = isCleanNoticeVisible;

  // 7. Check Contrast & Layout Viewports (Mobile vs Desktop)
  console.log("\n--- Testing Mobile Viewport (375x667) ---");
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("http://localhost:3000/profil?tab=dashboard", { waitUntil: "networkidle" });

  // Check horizontal tabs scroll bar in mobile
  const mobileNav = page.locator("nav[aria-label='Menu Profil Mobile']");
  const isMobileNavVisible = await mobileNav.isVisible();
  const desktopSidebar = page.locator("aside div.hidden.lg\\:block");
  const isDesktopSidebarHidden = !(await desktopSidebar.isVisible());
  console.log("[MOBILE LAYOUT] Mobile nav visible:", isMobileNavVisible);
  console.log("[MOBILE LAYOUT] Desktop sidebar hidden on mobile:", isDesktopSidebarHidden);
  results.accessibility.mobileResponsive = isMobileNavVisible && isDesktopSidebarHidden;

  // Check horizontal overflow on mobile
  const hasHorizontalScrollbar = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log("[MOBILE LAYOUT] Has horizontal overflow/scrollbar:", hasHorizontalScrollbar);
  results.accessibility.noHorizontalOverflow = !hasHorizontalScrollbar;

  await browser.close();

  console.log("\n=== POST-REFACTOR FUNCTIONAL QA AUDIT COMPLETE ===");
  console.log("Summary Results:", JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.resolve(__dirname, "../docs/03-desain/screenshots/audit-test-results.json"),
    JSON.stringify(results, null, 2)
  );
}

runAudit().catch((err) => {
  console.error("QA Audit failed:", err);
  process.exit(1);
});
