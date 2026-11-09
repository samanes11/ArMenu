import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({ name, tagline, logoUrl, size = "lg", href }: { name: string; tagline?: string; logoUrl?: string; size?: "lg" | "md"; href?: string }) {
  const content = logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoUrl} alt={name} className={cn("mx-auto h-auto w-[200px] object-contain", size === "lg" ? "max-h-[84px]" : "max-h-[72px]")} />
  ) : (
    <span className="inline-flex max-w-[86vw] flex-col items-start">
      <span className={cn("logo-gold text-right font-black leading-[1.15] tracking-tight", size === "lg" ? "text-[46px]" : "text-[40px]")} style={{ transform: "skewX(-9deg)" }}>
        {name}
      </span>
      <span className="mt-3 h-[3.5px] w-[92%] self-start rounded-full bg-gradient-to-l from-gold-300 via-gold-400 to-gold-500" style={{ transform: "rotate(-1.5deg)" }} />
    </span>
  );
  return href ? (
    <Link href={href} aria-label={name} className="inline-block">
      {content}
    </Link>
  ) : (
    content
  );
}
