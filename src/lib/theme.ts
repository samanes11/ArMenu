import type { CSSProperties } from "react";

// از یک رنگ پایه (مثلاً انتخاب‌شده توسط صاحب رستوران)، کل طیف رنگ برند
// (۵۰، ۱۰۰، ۵۰۰، ۶۰۰، ۷۰۰) را می‌سازد تا جایگزین مقادیر پیش‌فرض در globals.css شود.

function hexToHsl(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;

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

export function isValidHexColor(value: string): boolean {
  return HEX_PATTERN.test(value);
}

// ---------------------------------------------------------------------------
// سیستم رنگ‌بندی کامل — هر رنگی که در منوی عمومی، صفحات ورود/ثبت‌نام و پنل
// مدیریت دیده می‌شود از همین چند رنگ پایه (که صاحب رستوران در تنظیمات تعیین
// می‌کند) ساخته می‌شود. رنگ‌های فرعی (مثل سایه‌های روشن/تیره‌ی رنگ تاکیدی)
// به‌صورت خودکار از روی رنگ پایه محاسبه می‌شوند تا صاحب رستوران مجبور نباشد
// ده‌ها رنگ را تک‌تک انتخاب کند.
// ---------------------------------------------------------------------------

export type ThemeColors = {
  accentColor: string; // رنگ تاکیدی (طلایی/اصلی): دکمه‌ها، طاقی‌های صفحه‌ی اول، قیمت و موارد فعال
  bgTop: string; // رنگ بالای گرادیان پس‌زمینه‌ی تیره (کل سایت: منو، ورود/ثبت‌نام، پنل مدیریت)
  bgMid: string; // رنگ میانی همان گرادیان پس‌زمینه
  bgBottom: string; // رنگ پایین همان گرادیان پس‌زمینه
  sidebarBg: string; // پس‌زمینه‌ی نوار کناری دسته‌بندی‌ها و دکمه‌ی «بازگشت»
  cardBg: string; // پس‌زمینه‌ی بخش نام/قیمت روی کارت هر غذا
  lineColor: string; // رنگ خط‌های جداکننده و حاشیه‌ی کارت‌ها، ورودی‌ها و لیست‌ها
  mutedText: string; // رنگ متن‌های کم‌رنگ‌تر (توضیحات، برچسب‌ها، متن‌های فرعی)
};

export const DEFAULT_THEME: ThemeColors = {
  accentColor: "#e2bc3e",
  bgTop: "#12261a",
  bgMid: "#1a3a24",
  bgBottom: "#163220",
  sidebarBg: "#1f4a43",
  cardBg: "#2a2a2a",
  lineColor: "#333333",
  mutedText: "#9b9b9b",
};

// توضیح هر رنگ برای نمایش در پنل مدیریت (صفحه‌ی تنظیمات ظاهری)
export const THEME_FIELD_INFO: Record<keyof ThemeColors, { label: string; description: string }> = {
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
    description: "رنگ میانی همان گرادیان پس‌زمینه؛ معمولاً روشن‌ترین نقطه‌ی بافت پشت صفحه.",
  },
  bgBottom: {
    label: "پس‌زمینه — پایین",
    description: "پایین‌ترین رنگ گرادیان پس‌زمینه؛ به سمت پایین صفحه محو می‌شود.",
  },
  sidebarBg: {
    label: "رنگ نوار دسته‌بندی",
    description: "پس‌زمینه‌ی نوار کناری ثابت (لیست دسته‌ها در صفحات منو) و دکمه‌ی «بازگشت» بالای هر دسته.",
  },
  cardBg: {
    label: "رنگ زمینه‌ی کارت غذا",
    description: "پس‌زمینه‌ی بخش پایین کارتِ هر غذا، همان قسمتی که نام، توضیح و قیمت در آن نوشته می‌شود.",
  },
  lineColor: {
    label: "رنگ خطوط و حاشیه‌ها",
    description: "رنگ خط‌های جداکننده بین آیتم‌ها، حاشیه‌ی کارت غذاها، و حاشیه‌ی فیلدهای فرم در پنل مدیریت.",
  },
  mutedText: {
    label: "رنگ متن فرعی",
    description:
      "رنگ متن‌های کم‌اهمیت‌تر: توضیح کوتاه زیر نام غذا، برچسب فیلدها در پنل مدیریت، و متن‌های راهنما.",
  },
};

function safeHex(hex: string | undefined | null, fallback: string): string {
  return hex && isValidHexColor(hex) ? hex : fallback;
}

// یک سایه‌ی روشن‌تر/تیره‌تر (lDelta) و در صورت نیاز کمی اشباع‌تر/کم‌رنگ‌تر (sDelta)
// از یک رنگ پایه می‌سازد — پایه‌ی ساخت کل طیف رنگ تاکیدی و گرادیان طاقی‌ها.
function shade(hex: string, lDelta: number, sDelta = 0): string {
  const [h, s, l] = hexToHsl(hex);
  const nextS = Math.min(100, Math.max(0, s + sDelta));
  const nextL = Math.min(97, Math.max(6, l + lDelta));
  return hslToHex(h, nextS, nextL);
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

// استایل inline روی عنصر <html> که تمام متغیرهای CSS رنگی سایت را از روی
// تنظیمات ذخیره‌شده‌ی صاحب رستوران بازنویسی می‌کند. مقادیر نامعتبر یا خالی
// با همان رنگ پیش‌فرض طرح اصلی جایگزین می‌شوند تا هیچ صفحه‌ای بدون رنگ نماند.
export function buildThemeStyleVars(theme: Partial<ThemeColors>): CSSProperties {
  const accent = safeHex(theme.accentColor, DEFAULT_THEME.accentColor);
  const bgTop = safeHex(theme.bgTop, DEFAULT_THEME.bgTop);
  const bgMid = safeHex(theme.bgMid, DEFAULT_THEME.bgMid);
  const bgBottom = safeHex(theme.bgBottom, DEFAULT_THEME.bgBottom);
  const sidebarBg = safeHex(theme.sidebarBg, DEFAULT_THEME.sidebarBg);
  const cardBg = safeHex(theme.cardBg, DEFAULT_THEME.cardBg);
  const lineColor = safeHex(theme.lineColor, DEFAULT_THEME.lineColor);
  const mutedText = safeHex(theme.mutedText, DEFAULT_THEME.mutedText);

  const accentPalette = buildAccentPalette(accent);
  const arch = buildArchPalette(accent);

  return {
    ["--gold-100" as string]: accentPalette[100],
    ["--gold-300" as string]: accentPalette[300],
    ["--gold-400" as string]: accentPalette[400],
    ["--gold-500" as string]: accentPalette[500],
    ["--gold-700" as string]: accentPalette[700],
    ["--menu-teal" as string]: sidebarBg,
    ["--menu-card" as string]: cardBg,
    ["--menu-line" as string]: lineColor,
    ["--menu-muted" as string]: mutedText,
    ["--bg-top" as string]: bgTop,
    ["--bg-mid" as string]: bgMid,
    ["--bg-bottom" as string]: bgBottom,
    ["--arch-top" as string]: arch.top,
    ["--arch-mid" as string]: arch.mid,
    ["--arch-bottom" as string]: arch.bottom,
    ["--arch-border" as string]: arch.border,
  };
}

export function buildBrandPalette(baseHex: string) {
  const safeHex = isValidHexColor(baseHex) ? baseHex : "#ea580c";
  const [h, s, l] = hexToHsl(safeHex);

  return {
    50: hslToHex(h, Math.min(s, 85), 97),
    100: hslToHex(h, Math.min(s, 80), 91),
    500: hslToHex(h, s, Math.min(l + 8, 62)),
    600: safeHex,
    700: hslToHex(h, s, Math.max(l - 10, 18)),
  };
}

// استایل inline که روی عنصر اصلی هر صفحه‌ی عمومی منو قرار می‌گیرد تا
// متغیرهای CSS برند (که در globals.css و tailwind.config.ts تعریف شده‌اند) را بازنویسی کند.
export function buildBrandStyleVars(baseHex: string): CSSProperties {
  const palette = buildBrandPalette(baseHex);
  return {
    ["--brand-50" as string]: palette[50],
    ["--brand-100" as string]: palette[100],
    ["--brand-500" as string]: palette[500],
    ["--brand-600" as string]: palette[600],
    ["--brand-700" as string]: palette[700],
  };
}
