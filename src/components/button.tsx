import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-gold-400 text-black font-bold hover:bg-gold-300 disabled:opacity-40",
  secondary: "border border-gold-500 text-gold-400 bg-transparent hover:bg-gold-400/10 disabled:opacity-40",
  ghost: "text-white/80 hover:bg-white/10 disabled:opacity-40",
  danger: "text-red-300 hover:bg-red-500/15 disabled:opacity-40",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`pressable inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
