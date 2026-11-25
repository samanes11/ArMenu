import { UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FoodBackdrop } from "@/components/menu/food-backdrop";
import { getRestaurant } from "@/lib/get-restaurant";
import { MENU_SECTIONS } from "@/lib/menu-sections";

/* ───────────── لودینگ قالب «طاقی‌ها» ───────────── */
// همان ابعاد و چیدمان HomeClassic
const ARCH_ASPECT = [
  "aspect-[70/96]",
  "aspect-[70/118]",
  "aspect-[70/140]",
  "aspect-[70/118]",
  "aspect-[70/96]",
];

function ClassicLoading() {
  return (
    <main className="menu-theme menu-green relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-3">
        {/* جای لوگو */}
        <Skeleton className="h-16 w-52 !rounded-md" />

        {/* طاقی‌ها با همان شکل و اندازه‌ی اصلی */}
        <nav
          dir="ltr"
          aria-hidden="true"
          className="mt-16 flex items-end justify-center gap-[clamp(3px,1vw,6px)]"
        >
          {MENU_SECTIONS.map((section, i) => (
            <div
              key={section.key}
              className="flex w-[clamp(54px,16vw,72px)] flex-col items-center"
            >
              <div className="w-full opacity-30">
                <div
                  className={`menu-arch w-full animate-pulse rounded-t-full ${ARCH_ASPECT[i]}`}
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              </div>
              <Skeleton className="mt-3 h-4 w-10 !rounded-full" />
            </div>
          ))}
        </nav>
      </div>
    </main>
  );
}

/* ───────────── لودینگ قالب «اسپلش (کارت‌ها)» ───────────── */
const H_NORMAL = "h-[clamp(140px,38vw,170px)] md:h-52 lg:h-64 xl:h-72";
const H_BIG = "h-[clamp(160px,44vw,200px)] md:h-52 lg:h-64 xl:h-72";

function skeletonClass(i: number) {
  if (i === 2) return `${H_BIG} col-span-2 md:col-span-1`;
  if (i === 4) return `${H_NORMAL} md:col-span-2 lg:col-span-1`;
  return H_NORMAL;
}

function SplashLoading() {
  return (
    <main className="menu-theme menu-green relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <div className="food-in absolute inset-0 z-0">
        <FoodBackdrop />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="loading-ring-wrap absolute inset-0">
            <div className="h-full w-full rounded-full border-[1.5px] border-[#C9A640]" />
          </div>
          <div className="loading-logo-wrap relative flex h-full w-full items-center justify-center">
            <div className="flex h-[62%] w-[62%] items-center justify-center">
              <UtensilsCrossed size={34} strokeWidth={1.6} className="text-[#C9A640]" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-5 pb-28 pt-12 md:max-w-2xl lg:max-w-[1400px]">
        <Skeleton className="h-10 w-48" />
        <div className="mt-10 grid w-full grid-cols-2 gap-3 md:gap-4 lg:mt-14 lg:grid-cols-5 lg:gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={`!rounded-[28px] ${skeletonClass(i)}`} />
          ))}
        </div>
      </div>
    </main>
  );
}

/* ───────────── انتخاب بر اساس قالب ───────────── */
export default async function HomeLoading() {
  let template: string = "classic";
  try {
    const restaurant = await getRestaurant(); // همان cache لایه‌ی layout؛ کوئری جدید نمی‌زند
    if (restaurant?.homeTemplate) template = restaurant.homeTemplate;
  } catch {}

  return template === "splash" ? <SplashLoading /> : <ClassicLoading />;
}