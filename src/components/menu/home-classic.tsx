import Link from "next/link";
import { BrandLogo } from "@/components/menu/brand-logo";
import { SectionIcon } from "@/components/menu/section-icons";
import { ContactButton } from "@/components/menu/contact-button";
import { MENU_SECTIONS } from "@/lib/menu-sections";

const ARCH_ASPECT = [
  "aspect-[70/96]",
  "aspect-[70/118]",
  "aspect-[70/140]",
  "aspect-[70/118]",
  "aspect-[70/96]",
];
const ARCH_ICON_SHIFT = [
  "pt-[6%]",
  "pt-[12%]",
  "pt-[14%]",
  "pt-[12%]",
  "pt-[6%]",
];

export function HomeClassic({
  name,
  tagline,
  logoUrl,
  phone,
  address,
  hasContact,
}: {
  name: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  address: string;
  hasContact: boolean;
}) {
  return (
    <main className="menu-theme menu-green relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-3">
        <div className="materialize">
          <BrandLogo name={name} tagline={tagline} logoUrl={logoUrl} />
        </div>
        <nav
          dir="ltr"
          aria-label="بخش‌های منو"
          className="mt-16 flex items-end justify-center gap-[clamp(3px,1vw,6px)]"
        >
          {MENU_SECTIONS.map((section, i) => (
            <Link
              key={section.key}
              href={`/menu/${section.key}`}
              className="drop-in flex w-[clamp(54px,16vw,72px)] flex-col items-center"
              style={{ ["--delay" as string]: `${300 + i * 150}ms` }}
            >
              <span
                className={`menu-arch flex w-full items-center justify-center rounded-t-full ${ARCH_ASPECT[i]} ${ARCH_ICON_SHIFT[i]}`}
              >
                <SectionIcon
                  section={section.key}
                  className="h-[62%] w-[62%]"
                />
              </span>
              <span
                dir="rtl"
                className="mt-3 whitespace-nowrap text-[15px] leading-6 text-white"
              >
                {section.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {hasContact && (
        <ContactButton name={name} phone={phone} address={address} />
      )}

      <p
        dir="ltr"
        className="absolute bottom-[3.9rem] right-5 z-10 text-[14px] text-white/45"
      >
        Powered By <span className="text-gold-400">Khoodemon</span>
      </p>

      <footer className="absolute inset-x-0 bottom-4 z-10 text-center">
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
