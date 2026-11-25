"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

const EXTS = ["jpg", "png", "webp", "jpeg"];

type Props = {
  href: string;
  label: string;
  sectionKey: string;
  image?: string;
  delay: string;
  className?: string;
};

export function SectionCard({
  href,
  label,
  sectionKey,
  image,
  delay,
  className = "",
}: Props) {
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const src = image ?? `/uploads/${sectionKey}.${EXTS[extIdx]}`;

  const imgRef = useRef<HTMLImageElement>(null);

  const onError = () => {
    if (!image && extIdx < EXTS.length - 1) setExtIdx(extIdx + 1);
    else setFailed(true);
  };

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) onError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <Link
      href={href}
      dir="rtl"
      style={{ ["--delay" as string]: delay }}
      className={`reveal group relative block rounded-[28px] border border-gold-500/70 bg-[var(--card)]/50 p-[5px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)] outline-none transition-all duration-500 hover:-translate-y-1 hover:border-gold-300 hover:shadow-[0_22px_44px_-16px_rgba(0,0,0,0.4)] focus-visible:border-gold-300 ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-gold-400/25 bg-[radial-gradient(circle_at_30%_20%,var(--bg-mid),var(--bg-top))]">
        {!failed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            key={src}
            src={src}
            alt={label}
            loading="lazy"
            onError={onError}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
        )}

        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[var(--bg-top)]/95 via-[var(--bg-top)]/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1.5 p-2 min-[360px]:gap-2 min-[360px]:p-3 md:p-4">
          <span className="text-[14px] font-semibold min-[360px]:text-[16px] md:text-[19px] text-gold-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {label}
          </span>
          <span className="flex h-6 w-6 shrink-0 min-[360px]:h-8 min-[360px]:w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-gold-400/80 bg-black/25 text-gold-400 backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold-400 group-hover:text-[var(--bg-top)]">
            <ArrowLeft className="h-3 w-3 min-[360px]:h-3.5 min-[360px]:w-3.5 md:h-4 md:w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
