
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home } from "lucide-react";
import { getRestaurant } from "@/lib/get-restaurant";
import { Dish } from "@/lib/models/Dish";
import { getCategory } from "@/lib/menu-sections";
import { currencyUnit } from "@/lib/format";
import { DishGrid } from "@/components/menu/dish-grid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ section: string; category: string }>;
}) {
  const { section: sectionKey, category: categoryParam } = await params;

  const categoryLabel = decodeURIComponent(categoryParam);
  const category = getCategory(sectionKey, categoryLabel);

  if (!category) notFound();

  const restaurant = await getRestaurant();
  if (!restaurant) notFound();

  const dishes = await Dish.find({
    restaurantId: restaurant._id,
    category: categoryLabel,
  })
    .sort({ available: -1, order: 1, createdAt: -1 })
    .lean();

  const unit = currencyUnit(restaurant.currency);

  return (
    <div className="relative px-3 pb-28 pt-6 sm:px-6">
      <Link
        href="/"
        className="pressable pop-in absolute right-0 top-6 z-20 flex items-center gap-2 rounded-l-full bg-menu-teal py-2 pl-4 pr-3 text-[15px] text-white"
      >
        <Home size={19} fill="currentColor" aria-hidden="true" />
        بازگشت
      </Link>

      <h1
        className="rise-in mt-9 text-center text-[34px] font-medium leading-tight text-white"
        style={{ ["--delay" as string]: "60ms" }}
      >
        {category.label}
      </h1>

      <div
        aria-hidden="true"
        className="cat-divider rise-in mt-3"
        style={{ ["--delay" as string]: "80ms" }}
      >
        <span className="cat-divider-dot" />
      </div>

      {dishes.length === 0 ? (
        <p
          className="rise-in py-20 text-center text-[15px] text-menu-muted"
          style={{ ["--delay" as string]: "100ms" }}
        >
          فعلاً غذایی در این دسته موجود نیست.
        </p>
      ) : (
        <DishGrid
          unit={unit}
          dishes={dishes.map((dish) => ({
            id: dish._id.toString(),
            name: dish.name,
            nameEn: dish.nameEn || "",
            description: dish.description || "",
            price: dish.price,
            thumbnailUrl: dish.thumbnailUrl || "",
            blurDataUrl: dish.blurDataUrl || "",
            hasModel: Boolean(dish.modelUrlGlb),
            modelUrlGlb: dish.modelUrlGlb || "",
            modelUrlUsdz: dish.modelUrlUsdz || "",
            available: dish.available,
          }))}
        />
      )}
    </div>
  );
}
