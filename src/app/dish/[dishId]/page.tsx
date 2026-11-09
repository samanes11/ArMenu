import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Box, ChevronRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { Dish } from "@/lib/models/Dish";
import { currencyUnit, formatPrice } from "@/lib/format";
import { findByCategory } from "@/lib/menu-sections";
import { ArViewer } from "@/components/ar-viewer";

export default async function DishDetailPage({ params }: { params: Promise<{ dishId: string }> }) {
  const { dishId } = await params;
  await connectDB();

  const restaurant = await Restaurant.findOne().select("_id currency").lean();
  if (!restaurant) notFound();

  const dish = await Dish.findOne({ _id: dishId, restaurantId: restaurant._id }).lean();
  if (!dish) notFound();

  const found = findByCategory(dish.category);
  const backHref = found ? `/menu/${found.section.key}/${encodeURIComponent(found.category.label)}` : "/";
  const unit = currencyUnit(restaurant.currency);

  return (
    <main className="menu-theme mx-auto min-h-[100dvh] max-w-2xl px-4 py-5">
      {dish.modelUrlGlb && (
        <Script type="module" src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js" strategy="afterInteractive" />
      )}
      <div className="relative">
        <Link href={backHref} className="pressable material-chip pop-in absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-chip" aria-label="بازگشت به منو">
          <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>

        {dish.modelUrlGlb ? (
          <ArViewer glbSrc={dish.modelUrlGlb} usdzSrc={dish.modelUrlUsdz} alt={dish.name} posterSrc={dish.thumbnailUrl} />
        ) : dish.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.thumbnailUrl} alt={dish.name} className="materialize h-72 w-full rounded-[1.75rem] border border-menu-line object-cover" />
        ) : (
          <div className="materialize flex h-64 items-center justify-center rounded-[1.75rem] border border-menu-line bg-menu-card text-menu-muted">
            <p className="text-body">مدل سه‌بعدی برای این غذا ثبت نشده است</p>
          </div>
        )}
      </div>

      <div className="rise-in mt-6 text-center" style={{ ["--delay" as string]: "140ms" }}>
        <h1 className="text-[26px] font-bold leading-snug text-white">{dish.name}</h1>
        {dish.nameEn && <p className="text-[16px] text-white">{dish.nameEn}</p>}
        <p className="mt-2 text-[18px] font-medium text-gold-400">{formatPrice(dish.price, unit)}</p>
        {dish.description && <p className="mt-3 text-[15px] leading-8 text-menu-muted">{dish.description}</p>}

        {dish.modelUrlGlb && (
          <p className="mt-5 flex items-center gap-1.5 text-[12px] text-menu-muted">
            <Box size={14} strokeWidth={1.6} aria-hidden="true" />
            با زدن «مشاهده روی میز»، دوربین گوشی باز می‌شود و غذا را در اندازه‌ی واقعی روی میزتان می‌بینید.
          </p>
        )}
      </div>
    </main>
  );
}
