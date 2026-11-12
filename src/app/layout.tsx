
import type { Metadata } from "next";
import { Vazirmatn, Space_Grotesk } from "next/font/google";
import { getRestaurant } from "@/lib/get-restaurant";
import {
  buildBrandStyleVars,
  buildThemeStyleVars,
  DEFAULT_THEME,
  type ThemeColors,
} from "@/lib/theme";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const en = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});

export const metadata: Metadata = {
  title: "دیش‌آر | منوی واقعیت‌افزوده رستوران",
  description: "منوی AR روی میز: غذا را قبل از سفارش به‌صورت سه‌بعدی ببینید.",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeColor = "#ea580c";
  let preset = "green";
  const theme: Partial<ThemeColors> = {};

  try {
    const restaurant = await getRestaurant();

    if (restaurant) {
      if (restaurant.themePreset === "silver") {
        preset = "silver";
      }

      if (restaurant.themeColor) {
        themeColor = restaurant.themeColor;
      }

      const r = restaurant as unknown as Record<
        string,
        string | undefined
      >;

      for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[]) {
        if (r[key]) {
          theme[key] = r[key];
        }
      }
    }
  } catch {}

  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme={preset}
      className={`${vazir.variable} ${en.variable}`}
      style={{
        ...buildBrandStyleVars(themeColor),
        ...buildThemeStyleVars(theme),
      }}
    >
      <body className="bg-neutral-50 font-vazir text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
