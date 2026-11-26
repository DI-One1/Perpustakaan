import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("BILIK - Pengujian Aksesibilitas WCAG & Image System", () => {
  test("Beranda memenuhi WCAG 2.1 AA dan tidak ada broken image", async ({ page }) => {
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    // Cek Axe Core Accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"]) // Check-contrast token terpisah mandiri
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Cek Image naturalWidth > 0
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.filter((img) => img.naturalWidth === 0).length;
    });
    expect(brokenImages).toBe(0);
  });

  test("Katalog memenuhi WCAG 2.1 AA dan fallback cover bekerja", async ({ page }) => {
    await page.goto("http://localhost:3000/katalog", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs.filter((img) => img.naturalWidth === 0).length;
    });
    expect(brokenImages).toBe(0);
  });

  test("Detail Buku memenuhi WCAG 2.1 AA", async ({ page }) => {
    await page.goto("http://localhost:3000/buku/buku-1", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
