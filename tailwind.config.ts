import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["var(--font-vazir)", "Tahoma", "sans-serif"],
        en: ["var(--font-en)", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        // پالت منوی عمومی (تیره، طلایی و سبز-فیروزه‌ای) — مقادیر از متغیرهای CSS
        // خوانده می‌شوند تا با رنگ‌بندیِ انتخابی صاحب رستوران (پنل مدیریت) هماهنگ باشند
        gold: {
          100: "var(--gold-100)",
          300: "var(--gold-300)",
          400: "var(--gold-400)",
          500: "var(--gold-500)",
          700: "var(--gold-700)",
        },
        menu: {
          teal: "var(--menu-teal)",
          card: "var(--menu-card)",
          line: "var(--menu-line)",
          muted: "var(--menu-muted)",
        },
        brand: {
          50: "var(--brand-50)",
          100: "var(--brand-100)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
        "spring-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      boxShadow: {
        chip: "0 8px 24px -8px rgba(0, 0, 0, 0.35)",
        card: "0 1px 2px rgba(15, 15, 13, 0.04), 0 8px 24px -12px rgba(15, 15, 13, 0.1)",
        "card-hover":
          "0 2px 4px rgba(15, 15, 13, 0.05), 0 16px 32px -12px rgba(15, 15, 13, 0.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;
