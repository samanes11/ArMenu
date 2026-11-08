import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    // middleware (بررسی ورود، روی /dashboard و /onboarding) باید کل بدنه‌ی درخواست را
    // بافر کند؛ پیش‌فرض Next.js فقط ۱۰ مگابایت است که برای فرم افزودن غذا (تصویر +
    // مدل سه‌بعدی GLB/USDZ) کم بود و باعث قطع ناقص فرم و خطای «Unexpected end of form»
    // می‌شد. این مقدار باید هم‌اندازه یا بیشتر از bodySizeLimit بالا باشد.
    middlewareClientMaxBodySize: "50mb",
    staleTimes: {
    dynamic: 900, 
    static: 900,
  },
  },
};

export default nextConfig;
