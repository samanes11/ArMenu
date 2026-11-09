import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["var(--font-vazir)", "Tahoma", "sans-serif"],
        en: ["var(--font-en)", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        // shadcn tokens (mapped to the restaurant theme variables)
        border: "var(--menu-line)",
        input: "var(--input)",
        ring: "var(--gold-400)",
        background: "#000",
        foreground: "#fff",
        primary: { DEFAULT: "var(--gold-400)", foreground: "#000" },
        muted: { DEFAULT: "var(--menu-line)", foreground: "var(--menu-muted)" },
        accent: { DEFAULT: "var(--accent-soft)", foreground: "var(--gold-400)" },
        destructive: { DEFAULT: "#7f1d1d", foreground: "#fecaca" },
        card: { DEFAULT: "var(--card)", foreground: "#fff" },
        gold: { 100: "var(--gold-100)", 300: "var(--gold-300)", 400: "var(--gold-400)", 500: "var(--gold-500)", 700: "var(--gold-700)" },
        menu: { teal: "var(--menu-teal)", card: "var(--menu-card)", line: "var(--menu-line)", muted: "var(--menu-muted)" },
        brand: { 50: "var(--brand-50)", 100: "var(--brand-100)", 500: "var(--brand-500)", 600: "var(--brand-600)", 700: "var(--brand-700)" },
      },
      borderRadius: { lg: "1rem", md: "0.65rem", sm: "0.5rem" },
      boxShadow: {
        chip: "0 8px 24px -8px rgba(0, 0, 0, 0.35)",
        card: "0 1px 2px rgba(15, 15, 13, 0.04), 0 8px 24px -12px rgba(15, 15, 13, 0.1)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
