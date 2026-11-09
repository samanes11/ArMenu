import type { CSSProperties } from "react";

function hexToHsl(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const r = parseInt(n.substring(0, 2), 16) / 255;
  const g = parseInt(n.substring(2, 4), 16) / 255;
  const b = parseInt(n.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return [h, Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;
export const isValidHexColor = (value: string) => HEX_PATTERN.test(value);

export type ThemeColors = {
  accentColor: string;
  bgTop: string;
  bgMid: string;
  menuBg: string;
  bgBottom: string;
  sidebarBg: string;
  cardBg: string;
  lineColor: string;
  mutedText: string;
};

export const DEFAULT_THEME: ThemeColors = {
  accentColor: "#e2bc3e",
  bgTop: "#12261a",
  bgMid: "#1a3a24",
  menuBg: "#000000",
  bgBottom: "#163220",
  sidebarBg: "#1f4a43",
  cardBg: "#2a2a2a",
  lineColor: "#333333",
  mutedText: "#9b9b9b",
};

export const THEME_FIELD_INFO: Record<
  keyof ThemeColors,
  { label: string; description: string }
> = {
  accentColor: {
    label: "رنگ تاکیدی (طلایی)",
    description:
      "مهم‌ترین رنگ منو: روی دکمه‌ها، طاقی‌های صفحه‌ی اول، نام غذاها، دسته‌ی فعال در نوار کناری، لبه‌ی کارتِ انتخاب‌شده و تمرکز فیلدهای پنل مدیریت دیده می‌شود. سایه‌های روشن‌تر و تیره‌تر آن (برای گرادیان طاقی‌ها و حالت‌های دیگر) به‌طور خودکار از همین یک رنگ ساخته می‌شوند.",
  },
  bgTop: {
    label: "پس‌زمینه — بالا",
    description:
      "بالاترین رنگ گرادیان تیره‌ای که پشت کل سایت (صفحه‌ی اول منو، صفحات ورود و ثبت‌نام، و پنل مدیریت) قرار دارد.",
  },
  bgMid: {
    label: "پس‌زمینه — میانی",
    description:
      "رنگ میانی همان گرادیان پس‌زمینه؛ معمولاً روشن‌ترین نقطه‌ی بافت پشت صفحه.",
  },
  bgBottom: {
    label: "پس‌زمینه — پایین",
    description:
      "پایین‌ترین رنگ گرادیان پس‌زمینه؛ به سمت پایین صفحه محو می‌شود.",
  },
  menuBg: {
    label: "رنگ زمینه‌ی منو",
    description: "رنگ پس‌زمینه‌ی صفحات دسته‌بندی و جزئیات غذا (پیش‌فرض مشکی).",
  },
  sidebarBg: {
    label: "رنگ نوار دسته‌بندی",
    description:
      "پس‌زمینه‌ی نوار کناری ثابت (لیست دسته‌ها در صفحات منو) و دکمه‌ی «بازگشت» بالای هر دسته.",
  },
  cardBg: {
    label: "رنگ زمینه‌ی کارت غذا",
    description:
      "پس‌زمینه‌ی بخش پایین کارتِ هر غذا، همان قسمتی که نام، توضیح و قیمت در آن نوشته می‌شود.",
  },
  lineColor: {
    label: "رنگ خطوط و حاشیه‌ها",
    description:
      "رنگ خط‌های جداکننده بین آیتم‌ها، حاشیه‌ی کارت غذاها، و حاشیه‌ی فیلدهای فرم در پنل مدیریت.",
  },
  mutedText: {
    label: "رنگ متن فرعی",
    description:
      "رنگ متن‌های کم‌اهمیت‌تر: توضیح کوتاه زیر نام غذا، برچسب فیلدها در پنل مدیریت، و متن‌های راهنما.",
  },
};

const safeHex = (hex: string | undefined | null, fallback: string) =>
  hex && isValidHexColor(hex) ? hex : fallback;

function shade(hex: string, lDelta: number, sDelta = 0): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(
    h,
    Math.min(100, Math.max(0, s + sDelta)),
    Math.min(97, Math.max(6, l + lDelta)),
  );
}

export function buildAccentPalette(baseHex: string) {
  const safe = safeHex(baseHex, DEFAULT_THEME.accentColor);
  return {
    100: shade(safe, 23, 3),
    300: shade(safe, 10, 1),
    400: safe,
    500: shade(safe, -12, 3),
    700: shade(safe, -24, 5),
  };
}

function buildArchPalette(baseHex: string) {
  const p = buildAccentPalette(baseHex);
  return {
    top: p[100],
    mid: shade(p[400], 3),
    bottom: p[500],
    border: shade(p[500], -6, 10),
  };
}

export function buildThemeStyleVars(
  theme: Partial<ThemeColors>,
): CSSProperties {
  const t = { ...DEFAULT_THEME };
  for (const k of Object.keys(t) as (keyof ThemeColors)[])
    t[k] = safeHex(theme[k], DEFAULT_THEME[k]);
  const a = buildAccentPalette(t.accentColor);
  const arch = buildArchPalette(t.accentColor);
  const vars: Record<string, string> = {
    "--gold-100": a[100],
    "--gold-300": a[300],
    "--gold-400": a[400],
    "--gold-500": a[500],
    "--gold-700": a[700],
    "--menu-teal": t.sidebarBg,
    "--menu-card": t.cardBg,
    "--menu-line": t.lineColor,
    "--menu-muted": t.mutedText,
    "--menu-bg": t.menuBg,
    "--bg-top": t.bgTop,
    "--bg-mid": t.bgMid,
    "--bg-bottom": t.bgBottom,
    "--arch-top": arch.top,
    "--arch-mid": arch.mid,
    "--arch-bottom": arch.bottom,
    "--arch-border": arch.border,
  };
  return vars as CSSProperties;
}

export function buildBrandStyleVars(baseHex: string): CSSProperties {
  const base = isValidHexColor(baseHex) ? baseHex : "#ea580c";
  const [h, s, l] = hexToHsl(base);
  const vars: Record<string, string> = {
    "--brand-50": hslToHex(h, Math.min(s, 85), 97),
    "--brand-100": hslToHex(h, Math.min(s, 80), 91),
    "--brand-500": hslToHex(h, s, Math.min(l + 8, 62)),
    "--brand-600": base,
    "--brand-700": hslToHex(h, s, Math.max(l - 10, 18)),
  };
  return vars as CSSProperties;
}
