import type { SectionKey } from "@/lib/menu-sections";

// آیکن‌های مشکیِ طاقی‌های صفحه‌ی اول، یک آیکن برای هر بخش منو.
const INK = "#0c0c0c";

function Breakfast() {
  return (
    <>
      <circle cx="24" cy="24" r="21" fill={INK} />
      <path
        d="M9.500 19.500c-.6-5 3.600-8.600 8.600-7.800 3 .5 5.400-.6 7.800.6 3.800 1.800 4.600 6.400 2.200 9.600-2 2.600-5.400 3.200-8.400 2.400-3-.8-4.800 1.200-7.800-.2-1.600-.8-2.200-2.800-2.400-4.600z"
        fill="#fff"
      />
      <circle cx="17.500" cy="19" r="4.200" fill={INK} />
      <circle cx="16.200" cy="17.600" r="1.200" fill="#fff" />
      <g transform="rotate(-28 31 32)">
        <rect x="21" y="28" width="20" height="8" rx="4" fill="#fff" />
        <path d="M24 30.500c2 1.600 3.600-1.600 5.600 0s3.600-1.600 5.600 0M24 34c2 1.600 3.600-1.600 5.600 0s3.600-1.600 5.600 0" stroke={INK} strokeWidth="1.300" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

function Lunch() {
  return (
    <>
      <ellipse cx="30.500" cy="17.500" rx="11.500" ry="13" transform="rotate(42 30.500 17.500)" fill={INK} />
      <path d="M12 36l11-11" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="9.500" cy="35.500" r="3.800" fill={INK} />
      <circle cx="13" cy="40" r="3.800" fill={INK} />
      <path d="M31 8.500c3.400-.4 6.400 1.600 7.600 4.600" stroke="#f1dd82" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".85" />
    </>
  );
}

function Dinner() {
  return (
    <>
      <circle cx="24" cy="9.500" r="2.800" fill={INK} />
      <path d="M5 32C5 20 13.500 12.500 24 12.500S43 20 43 32z" fill={INK} />
      <path d="M11 29c.6-6 4.600-10.200 10-11.200" stroke="#f1dd82" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".9" />
      <rect x="2.500" y="34.500" width="43" height="3.400" rx="1.700" fill={INK} />
    </>
  );
}

function Appetizer() {
  return (
    <>
      <path d="M13 22c-3-5 0-9.500 5-9 1.600-3.600 7-4 9 0 4.400-1 7.600 3 5.400 7.200z" fill={INK} />
      <circle cx="31" cy="15" r="3.200" fill={INK} />
      <path d="M17 17c3 1 5 3.200 6 6M27 15c-2 2-3 4-3 6.500" stroke="#f1dd82" strokeWidth="1.500" strokeLinecap="round" fill="none" />
      <path d="M3.500 23.500h41c0 10-8.600 17-20.500 17S3.500 33.500 3.500 23.500z" fill={INK} />
      <rect x="2" y="21.500" width="44" height="3.600" rx="1.800" fill={INK} />
      <path d="M11 29.500c1.600 3.400 4.600 5.400 8.400 6" stroke="#f1dd82" strokeWidth="1.800" strokeLinecap="round" fill="none" opacity=".85" />
    </>
  );
}

function Cafe() {
  return (
    <>
      <path d="M17 5.500c-2.600 3 2.600 5 0 8.500M24.500 5.500c-2.600 3 2.600 5 0 8.500M32 5.500c-2.600 3 2.600 5 0 8.500" stroke={INK} strokeWidth="2.400" strokeLinecap="round" fill="none" />
      <path d="M8 21h27v6.500c0 7.200-5.800 12.500-13.500 12.500S8 34.700 8 27.500z" fill={INK} />
      <path d="M35 24h2.600c3.600 0 5.400 2.400 5.400 5s-1.800 5-5.400 5h-4" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="4" y="41.500" width="35" height="3" rx="1.500" fill={INK} />
    </>
  );
}

const ICONS: Record<SectionKey, () => React.JSX.Element> = {
  breakfast: Breakfast,
  lunch: Lunch,
  dinner: Dinner,
  appetizer: Appetizer,
  cafe: Cafe,
};

export function SectionIcon({ section, className }: { section: SectionKey; className?: string }) {
  const Icon = ICONS[section];
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <Icon />
    </svg>
  );
}
