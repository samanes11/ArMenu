
"use client";

import Link from "next/link";
import { useState } from "react";
import { Coffee } from "lucide-react";
import { MENU_SECTIONS } from "@/lib/menu-sections";
import { ContactButton } from "@/components/menu/contact-button";
import { HomeMotion } from "./home-motion";

const EXTS = ["jpg", "png", "webp", "jpeg"];
type Pt = { x: number; y: number };

const C = 50, R = 50, r0 = 12, g = 0.6, rc = 1;
const SCALE = 1.45;

function petalPath(n: number) {
  const half = Math.PI / n;
  const s = Math.sin(half), c = Math.cos(half);

  const pt = (t: number, side: 1 | -1): Pt => ({
    x: C + side * (t * s - g * c),
    y: C - t * c - g * s,
  });

  const tO = Math.sqrt(R * R - g * g);
  const A = pt(r0, 1), B = pt(tO, 1);
  const E = pt(tO, -1), D = pt(r0, -1);

  const th = Math.atan2(B.x - C, C - B.y);
  const ph = rc / R;

  const arc = (a: number): Pt => ({
    x: C + R * Math.sin(a),
    y: C - R * Math.cos(a),
  });

  const a1 = arc(th - ph);
  const a2 = arc(-th + ph);

  const P = (p: Pt) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  const mv = (p: Pt, dx: number, dy: number): Pt => ({
    x: p.x + dx * rc,
    y: p.y + dy * rc,
  });

  return [
    `M${P(mv(D, 1, 0))}`,
    `L${P(mv(A, -1, 0))}`,
    `Q${P(A)} ${P(mv(A, s, -c))}`,
    `L${P(mv(B, -s, c))}`,
    `Q${P(B)} ${P(a1)}`,
    `A${R} ${R} 0 0 0 ${P(a2)}`,
    `Q${P(E)} ${P(mv(E, s, c))}`,
    `L${P(mv(D, -s, -c))}`,
    `Q${P(D)} ${P(mv(D, 1, 0))}`,
    "Z",
  ].join(" ");
}

const toCont = (v: number) => 50 + (v - 50) / SCALE;

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
    <img
      key={i}
      src={image ?? `/uploads/${sectionKey}.${EXTS[i]}`}
      alt=""
      loading="lazy"
      onError={() =>
        image || i >= EXTS.length - 1
          ? setFailed(true)
          : setI(i + 1)
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
  const d = petalPath(n);

  return (
    <main className="menu-theme menu-green relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-28 pt-10">
      <HomeMotion />

      <header
        className="reveal flex flex-col items-center gap-2 text-gold-400"
        style={{ ["--delay" as string]: "0.1s" }}
      >
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
        className="relative mt-8 aspect-square w-[min(100vw,720px)]"
      >
        <svg
          width="0"
          height="0"
          className="absolute"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id="petal-clip" clipPathUnits="objectBoundingBox">
              <path d={d} transform="scale(0.01)" />
            </clipPath>
          </defs>
        </svg>

        {MENU_SECTIONS.map((section, i) => {
          const rot = i * step;
          const rad = (rot * Math.PI) / 180;
          const sx = Math.sin(rad);
          const sy = Math.cos(rad);

          // محل متن در بخش بیرونی و میانی گلبرگ
          const labelX = 50 + sx * 25;
          const labelY = 50 - sy * 25;

          return (
            <div
              key={section.key}
              className="pointer-events-none absolute inset-0"
              style={{
                filter: "drop-shadow(0 8px 10px rgba(0,0,0,.45))",
              }}
            >
              <Link
                href={`/menu/${section.key}`}
                aria-label={section.label}
                className="petal group pointer-events-auto absolute inset-0 block outline-none"
                style={{
                  clipPath: "url(#petal-clip)",
                  WebkitClipPath: "url(#petal-clip)",
                  transform: `rotate(${rot}deg)`,
                  ["--rot" as string]: `${rot}deg`,
                  ["--delay" as string]: `${0.4 + i * 0.12}s`,
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 aspect-square"
                  style={{
                    width: `${SCALE * 100}%`,
                    transform: `translate(-50%,-50%) rotate(${-rot}deg)`,
                    background: "var(--menu-card)",
                  }}
                >
                  <PetalImage
                    sectionKey={section.key}
                    image={section.image}
                  />

                  {/* متن مستقیم روی تصویر گلبرگ */}
                  <div
                    dir="rtl"
                    className="petal-label absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[14px] font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] sm:text-[17px]"
                    style={{
                      left: `${toCont(labelX)}%`,
                      top: `${toCont(labelY)}%`,
                      textShadow: "0 2px 8px rgba(0,0,0,.95)",
                      ["--delay" as string]: `${0.4 + i * 0.12}s`,
                    }}
                  >
                    {section.label}
                  </div>
                </div>

                <svg
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--gold-400)"
                    strokeWidth="0.9"
                  />
                </svg>
              </Link>
            </div>
          );
        })}

        {/* لوگوی مرکزی */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="pop-in flex h-[17%] w-[17%] items-center justify-center overflow-hidden rounded-full border-2 border-gold-400 bg-[var(--menu-bg)] text-gold-400 shadow-[0_6px_16px_-6px_rgba(0,0,0,.8)]"
            style={{ ["--delay" as string]: "1.1s" }}
          >
            {logoUrl ? (
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
        <div
          className="reveal-fade"
          style={{ ["--delay" as string]: "1.4s" }}
        >
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
