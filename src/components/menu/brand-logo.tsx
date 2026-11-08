import Link from "next/link";

// لوگوی رستوران: اگر تصویر لوگو در تنظیمات آپلود شده باشد همان، وگرنه نام رستوران
// به‌شکل لوگوی متنی طلایی (با خط زیرین و زیرنویس کوتاه) نمایش داده می‌شود.
export function BrandLogo({
  name,
  tagline,
  logoUrl,
  size = "lg",
  href,
}: {
  name: string;
  tagline?: string;
  logoUrl?: string;
  size?: "lg" | "md";
  href?: string;
}) {
  const content = logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={name}
      className={`mx-auto h-auto object-contain ${size === "lg" ? "max-h-[84px] w-[200px]" : "max-h-[72px] w-[200px]"}`}
    />
  ) : (
    <span className="inline-flex max-w-[86vw] flex-col items-start">
      <span
        className={`logo-gold text-right font-black leading-[1.15] tracking-tight ${size === "lg" ? "text-[46px]" : "text-[40px]"}`}
        style={{ transform: "skewX(-9deg)" }}
      >
        {name}
      </span>
      <span
        className="mt-3 h-[3.5px] w-[92%] self-start rounded-full bg-gradient-to-l from-gold-300 via-gold-400 to-gold-500"
        style={{ transform: "rotate(-1.5deg)" }}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={name} className="inline-block">
        {content}
      </Link>
    );
  }
  return content;
}
