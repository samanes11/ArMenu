import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { MENU_SECTIONS } from "@/lib/menu-sections";
import { logMenuEvent } from "@/lib/actions/events";
import { BrandLogo } from "@/components/menu/brand-logo";
import { SectionIcon } from "@/components/menu/section-icons";
import { ContactButton } from "@/components/menu/contact-button";

// ارتفاع نسبی هر طاقی: وسطی بلندترین، دو کناری کوتاه‌ترین (مثل طرح اصلی)
const ARCH_ASPECT = ["aspect-[70/96]", "aspect-[70/118]", "aspect-[70/140]", "aspect-[70/118]", "aspect-[70/96]"];
const ARCH_ICON_SHIFT = ["pt-[6%]", "pt-[12%]", "pt-[14%]", "pt-[12%]", "pt-[6%]"];

export default async function Home() {
  await connectDB();

  // چون این سایت فقط برای یک رستوران/کافه استفاده می‌شود، اولین (و تنها) رکورد موجود را می‌گیریم
  const restaurant = await Restaurant.findOne().lean();

  if (!restaurant) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-display text-brand-600">دیش‌آر 🍽️</h1>
        <p className="text-body text-neutral-600">هنوز منویی ثبت نشده است.</p>
        <Link
          href="/register"
          className="pressable shadow-card rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          ساخت حساب مدیریت
        </Link>
      </main>
    );
  }

  // ثبت رویداد اسکن منو (آمار بازدید)؛ کد QR به همین صفحه می‌رسد
  await logMenuEvent(restaurant._id.toString(), "scan");

  const tagline = restaurant.description && restaurant.description.length <= 24 ? restaurant.description : "";
  const hasContact = Boolean(restaurant.phone || restaurant.address);

  return (
    // کل صفحه با بافت سبز تیره
    <main className="menu-theme menu-green relative min-h-[100dvh] overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-3" style={{ paddingTop: "calc(47dvh - 40px)" }}>
        <div className="materialize">
          <BrandLogo name={restaurant.name} tagline={tagline} logoUrl={restaurant.logoUrl || undefined} />
        </div>

        {/* dir=ltr: ترتیب از چپ به راست = صبحانه ... کافه، یعنی کافه سمت راست */}
        <nav dir="ltr" aria-label="بخش‌های منو" className="mt-16 flex items-end justify-center gap-[clamp(3px,1vw,6px)]">
          {MENU_SECTIONS.map((section, i) => (
            <Link
              key={section.key}
              href={`/menu/${section.key}`}
              className="rise-in flex w-[clamp(54px,16vw,72px)] flex-col items-center"
              style={{ ["--delay" as string]: `${i * 70}ms` }}
            >
              <span className={`menu-arch flex w-full items-center justify-center rounded-t-full ${ARCH_ASPECT[i]} ${ARCH_ICON_SHIFT[i]}`}>
                <SectionIcon section={section.key} className="h-[62%] w-[62%]" />
              </span>
              <span dir="rtl" className="mt-3 whitespace-nowrap text-[15px] leading-6 text-white">
                {section.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {hasContact && <ContactButton name={restaurant.name} phone={restaurant.phone || ""} address={restaurant.address || ""} />}

      <p dir="ltr" className="absolute bottom-[3.9rem] right-5 z-10 text-[14px] text-white/45">
        Powered By <span className="text-gold-400">DishAR</span>
      </p>

      <footer className="absolute inset-x-0 bottom-4 z-10 text-center">
        <Link href="/login" className="text-[13px] text-white/45 hover:text-white/80 hover:underline">
          ورود مدیریت
        </Link>
      </footer>
    </main>
  );
}
