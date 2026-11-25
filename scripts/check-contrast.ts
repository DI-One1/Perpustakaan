/**
 * scripts/check-contrast.ts
 *
 * Menghitung rasio kontras WCAG 2.1 untuk pasangan token warna di mode terang dan gelap.
 * Ambang batas:
 * - Teks normal / semantik: minimal 4.5:1 (WCAG AA)
 * - Komponen UI / batas input / fokus ring: minimal 3.0:1 (WCAG AA Non-text)
 */

interface ColorPair {
  name: string;
  theme: "light" | "dark";
  color1: string; // hex
  color2: string; // hex
  minRatio: number;
  category: "text" | "ui";
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "").trim();
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    const srgb = val / 255;
    return srgb <= 0.04045
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Token warna resmi dari PROMPT INDUK
const COLOR_PAIRS: ColorPair[] = [
  // --- MODE TERANG ---
  {
    name: "Foreground pada Background",
    theme: "light",
    color1: "#1A1F27",
    color2: "#F7F8FA",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Card Foreground pada Card",
    theme: "light",
    color1: "#1A1F27",
    color2: "#FFFFFF",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Muted Foreground pada Muted Background",
    theme: "light",
    color1: "#596273",
    color2: "#EEF1F5",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Primary Foreground pada Primary",
    theme: "light",
    color1: "#FFFFFF",
    color2: "#0072C6",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Primary Soft Foreground pada Primary Soft",
    theme: "light",
    color1: "#004B85",
    color2: "#EAF4FC",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Accent Lime Foreground pada Accent Lime",
    theme: "light",
    color1: "#1A1F27",
    color2: "#B7D731",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Success FG pada Success BG",
    theme: "light",
    color1: "#1B6B3A",
    color2: "#E6F4EA",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Warning FG pada Warning BG",
    theme: "light",
    color1: "#8A4B00",
    color2: "#FFF1DB",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Danger FG pada Danger BG",
    theme: "light",
    color1: "#B3141B",
    color2: "#FDEBEC",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Destructive FG pada Destructive",
    theme: "light",
    color1: "#FFFFFF",
    color2: "#C8161D",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Input Border pada Card/Background",
    theme: "light",
    color1: "#858E9F", // Penyesuaian halus dari #8A93A3 agar mencapai >= 3.0:1 baik di atas #FFFFFF (3.30:1) maupun #F7F8FA (3.10:1)
    color2: "#F7F8FA",
    minRatio: 3.0,
    category: "ui",
  },
  {
    name: "Focus Ring pada Background",
    theme: "light",
    color1: "#0072C6",
    color2: "#F7F8FA",
    minRatio: 3.0,
    category: "ui",
  },

  // --- MODE GELAP ---
  {
    name: "Foreground pada Background (Dark)",
    theme: "dark",
    color1: "#E8ECF2",
    color2: "#0F141B",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Card Foreground pada Card (Dark)",
    theme: "dark",
    color1: "#E8ECF2",
    color2: "#171E27",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Muted Foreground pada Card (Dark)",
    theme: "dark",
    color1: "#9AA4B5",
    color2: "#171E27",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Primary Foreground pada Primary (Dark)",
    theme: "dark",
    color1: "#0F141B",
    color2: "#5AB0F0",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Primary Soft Foreground pada Primary Soft (Dark)",
    theme: "dark",
    color1: "#BFE0FA",
    color2: "#12304A",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Success FG pada Success BG (Dark)",
    theme: "dark",
    color1: "#6FD08C",
    color2: "#12301D",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Warning FG pada Warning BG (Dark)",
    theme: "dark",
    color1: "#F2B35A",
    color2: "#3A2A0E",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Danger FG pada Danger BG (Dark)",
    theme: "dark",
    color1: "#FF8A8F",
    color2: "#3A1316",
    minRatio: 4.5,
    category: "text",
  },
  {
    name: "Input Border pada Background (Dark)",
    theme: "dark",
    color1: "#6B7686",
    color2: "#0F141B",
    minRatio: 3.0,
    category: "ui",
  },
  {
    name: "Focus Ring pada Background (Dark)",
    theme: "dark",
    color1: "#5AB0F0",
    color2: "#0F141B",
    minRatio: 3.0,
    category: "ui",
  },
];

function main() {
  console.log("=================================================");
  console.log("   UJI KONTRAS WARNA TOKEN WCAG 2.1 (AA)");
  console.log("   Perpustakaan Digital SMK TI Bazma");
  console.log("=================================================\n");

  let failures = 0;

  for (const pair of COLOR_PAIRS) {
    const ratio = getContrastRatio(pair.color1, pair.color2);
    const passed = ratio >= pair.minRatio;

    const formattedRatio = ratio.toFixed(2) + ":1";
    const status = passed ? "[LULUS]" : "[GAGAL]";

    console.log(
      `${status} [${pair.theme.toUpperCase()}] ${pair.name}\n` +
        `        Warna: ${pair.color1} vs ${pair.color2}\n` +
        `        Hasil: ${formattedRatio} (Ambang batas min: ${pair.minRatio}:1)\n`
    );

    if (!passed) {
      failures++;
    }
  }

  console.log("-------------------------------------------------");
  if (failures === 0) {
    console.log("SEMUA TOKEN WARNA LULUS UJI KONTRAS WCAG 2.1 AA!");
    console.log("-------------------------------------------------");
    process.exit(0);
  } else {
    console.error(`TERDAPAT ${failures} PASANGAN TOKEN GAGAL AMBANG BATAS!`);
    console.log("-------------------------------------------------");
    process.exit(1);
  }
}

main();
