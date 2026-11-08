import type { Metadata } from "next";
import Script from "next/script";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { buildBrandStyleVars, buildThemeStyleVars, DEFAULT_THEME, type ThemeColors } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "دیش‌آر | منوی واقعیت‌افزوده رستوران",
  description: "منوی AR روی میز: غذا را قبل از سفارش به‌صورت سه‌بعدی ببینید.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // رنگ‌بندی انتخابی صاحب رستوران این‌جا یک‌بار خوانده می‌شود تا کل سایت
  // (منوی عمومی، صفحه‌ی ورود/ثبت‌نام و پنل مدیریت) یکدست همین رنگ‌ها را بگیرد.
  let themeColor = "#ea580c";
  const theme: Partial<ThemeColors> = {};
  try {
    await connectDB();
    const restaurant = await Restaurant.findOne()
      .select(["themeColor", ...Object.keys(DEFAULT_THEME)].join(" "))
      .lean();
    if (restaurant?.themeColor) themeColor = restaurant.themeColor;
    if (restaurant) {
      for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[]) {
        const value = (restaurant as unknown as Record<string, string | undefined>)[key];
        if (value) theme[key] = value;
      }
    }
  } catch {
  }

  return (
    <html lang="fa" dir="rtl" style={{ ...buildBrandStyleVars(themeColor), ...buildThemeStyleVars(theme) }}>
      <body className="font-vazir bg-neutral-50 text-neutral-900 antialiased">
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
