import Link from "next/link";
import { MENU_SECTIONS } from "@/lib/menu-sections";
import { SectionCard } from "@/components/menu/section-card";
import { FoodBackdrop } from "@/components/menu/food-backdrop";
import { ContactButton } from "@/components/menu/contact-button";
import { HomeMotion } from "./home-motion";

const H_NORMAL = "h-[clamp(140px,38vw,170px)] md:h-52 lg:h-64 xl:h-72";
const H_BIG = "h-[clamp(160px,44vw,200px)] md:h-52 lg:h-64 xl:h-72";

function cardClass(i: number, n: number) {
  if (n === 5) {
    if (i === 2) return `${H_BIG} col-span-2 md:col-span-1`;
    if (i === 4) return `${H_NORMAL} md:col-span-2 lg:col-span-1`;
    return H_NORMAL;
  }
  return `${H_NORMAL} [&:last-child:nth-child(odd)]:col-span-2 lg:[&:last-child:nth-child(odd)]:col-span-1`;
}

export function HomeSplash({
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
  return (
    <main className="menu-theme menu-green relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <HomeMotion />
      <FoodBackdrop />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      >
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="splash-ring-wrap absolute inset-0">
            <div className="splash-ring h-full w-full rounded-full border-[1.5px] border-[#C9A640]" />
          </div>
          <div className="splash-logo-wrap relative flex h-full w-full items-center justify-center">
            <div className="splash-logo flex h-[62%] w-[62%] items-center justify-center">
              {logoUrl ? (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundColor: "#C9A640",
                    WebkitMaskImage: `url(${logoUrl})`,
                    maskImage: `url(${logoUrl})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
              ) : (
                <span className="text-center text-lg font-semibold leading-tight text-[#C9A640]">
                  {name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-5 pb-28 pt-12 md:max-w-2xl lg:max-w-[1400px]">
        <h1
          className="reveal text-center text-[34px] font-bold text-[#C9A640] lg:text-[44px]"
          style={{ ["--delay" as string]: "2.2s" }}
        >
          کافه خودمون
        </h1>

        <nav
          aria-label="بخش‌های منو"
          dir="rtl"
          className="mt-10 grid w-full grid-cols-2 gap-3 md:gap-4 lg:mt-14 lg:grid-cols-5 lg:gap-5"
        >
          {MENU_SECTIONS.map((section, i) => (
            <SectionCard
              key={section.key}
              href={`/menu/${section.key}`}
              label={section.label}
              sectionKey={section.key}
              image={section.image}
              delay={`${2.5 + i * 0.12}s`}
              className={cardClass(i, MENU_SECTIONS.length)}
            />
          ))}
        </nav>
      </div>

      {hasContact && (
        <div className="reveal-fade" style={{ ["--delay" as string]: "3.3s" }}>
          <ContactButton name={name} phone={phone} address={address} />
        </div>
      )}

      <p
        dir="ltr"
        className="reveal absolute bottom-[3.9rem] right-5 z-10 text-[13px] text-[#C9A640]/50"
        style={{ ["--delay" as string]: "3.3s" }}
      >
        Powered By <span className="text-[#C9A640]">Khoodemon</span>
      </p>

      <footer
        className="reveal absolute inset-x-0 bottom-4 z-10 text-center"
        style={{ ["--delay" as string]: "3.3s" }}
      >
        <Link
          href="/login"
          className="text-[13px] text-[#C9A640]/60 hover:text-[#C9A640] hover:underline"
        >
          ورود مدیریت
        </Link>
      </footer>
    </main>
  );
}
