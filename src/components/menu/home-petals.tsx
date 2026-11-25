"use client";

import Link from "next/link";
import { useState } from "react";
import { Coffee } from "lucide-react";
import { MENU_SECTIONS } from "@/lib/menu-sections";
import { ContactButton } from "@/components/menu/contact-button";
import { HomeMotion } from "./home-motion";

const EXTS = ["jpg", "png", "webp", "jpeg"];

function wedgePolygon(n: number) {
  const half = 180 / n;
  const pts = ["50% 50%"];
  for (let k = 0; k <= 6; k++) {
    const a = ((-half + (2 * half * k) / 6) * Math.PI) / 180;
    pts.push(
      `${(50 + 50 * Math.sin(a)).toFixed(2)}% ${(50 - 50 * Math.cos(a)).toFixed(2)}%`,
    );
  }
  return `polygon(${pts.join(",")})`;
}

function PetalImage({
  sectionKey,
  image,
}: {
  sectionKey: string;
  image?: string;
}) {
  const [i, setI] = useState(0);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={i}
      src={image ?? `/uploads/${sectionKey}.${EXTS[i]}`}
      alt=""
      loading="lazy"
      onError={() =>
        image || i >= EXTS.length - 1 ? setFailed(true) : setI(i + 1)
      }
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
    />
  );
}

export function HomePetals({
  name,
  logoUrl,
  phone,
  address,
  hasContact,
}: {
  name: string;
  logoUrl?: string;
  phone: string;
  address: string;
  hasContact: boolean;
}) {
  const n = MENU_SECTIONS.length;
  const step = 360 / n;
  const clip = wedgePolygon(n);

  return (
    <main className="menu-theme menu-green relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-28 pt-10">
      <HomeMotion />

      <header
        className="reveal flex flex-col items-center gap-2 text-gold-400"
        style={{ ["--delay" as string]: "0.1s" }}
      >
        <Coffee size={44} strokeWidth={1.4} />
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold-400/60 sm:w-14" />
          <h1 className="text-[32px] font-black leading-tight sm:text-[42px]">
            {name}
          </h1>
          <span className="h-px w-8 bg-gold-400/60 sm:w-14" />
        </div>
        <span className="h-2 w-2 rotate-45 bg-gold-400" />
      </header>

      <nav
        aria-label="بخش‌های منو"
        className="relative mt-8 aspect-square w-[min(92vw,520px)]"
      >
        {MENU_SECTIONS.map((section, i) => {
          const rot = i * step;
          const rad = (rot * Math.PI) / 180;
          return (
            <div
              key={section.key}
              className="pointer-events-none absolute inset-0"
              style={{
                filter:
                  "drop-shadow(0 0 1px var(--gold-400)) drop-shadow(0 8px 10px rgba(0,0,0,.55))",
              }}
            >
              <Link
                href={`/menu/${section.key}`}
                aria-label={section.label}
                className="petal group pointer-events-auto absolute inset-0 block outline-none"
                style={{
                  clipPath: clip,
                  transform: `rotate(${rot}deg) translateY(-7px)`,
                  ["--rot" as string]: `${rot}deg`,
                  ["--delay" as string]: `${0.5 + i * 0.12}s`,
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 aspect-square w-[145%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `translate(-50%,-50%) rotate(${-rot}deg)`,
                    background:
                      "radial-gradient(circle at 30% 20%, #1d4d34, #0c2417)",
                  }}
                >
                  <PetalImage sectionKey={section.key} image={section.image} />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle closest-side at 50% 50%, rgba(8,26,16,.92) 0, rgba(8,26,16,.55) 38%, transparent 62%)",
                    }}
                  />
                  <div
                    className="absolute flex flex-col items-center gap-1"
                    style={{
                      left: `${50 + 24 * Math.sin(rad)}%`,
                      top: `${50 - 24 * Math.cos(rad)}%`,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <span className="whitespace-nowrap text-[14px] font-bold text-[#E3C766] drop-shadow-[0_2px_8px_rgba(0,0,0,.85)] sm:text-[17px]">
                      {section.label}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="pop-in flex h-[22%] w-[22%] items-center justify-center overflow-hidden rounded-full border-2 border-gold-400 bg-[var(--menu-bg)] text-gold-400 shadow-[0_6px_16px_-6px_rgba(0,0,0,.8)]"
            style={{ ["--delay" as string]: "1.1s" }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={name}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <Coffee size={30} strokeWidth={1.5} />
            )}
          </div>
        </div>
      </nav>

      {hasContact && (
        <div className="reveal-fade" style={{ ["--delay" as string]: "1.4s" }}>
          <ContactButton name={name} phone={phone} address={address} />
        </div>
      )}

      <p
        dir="ltr"
        className="reveal absolute bottom-[3.9rem] right-5 z-10 text-[13px] text-white/45"
        style={{ ["--delay" as string]: "1.4s" }}
      >
        Powered By <span className="text-gold-400">Khoodemon</span>
      </p>

      <footer
        className="reveal absolute inset-x-0 bottom-4 z-10 text-center"
        style={{ ["--delay" as string]: "1.4s" }}
      >
        <Link
          href="/login"
          className="text-[13px] text-white/45 hover:text-white/80 hover:underline"
        >
          ورود مدیریت
        </Link>
      </footer>
    </main>
  );
}
