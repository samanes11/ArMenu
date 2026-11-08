import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { Dish } from "@/lib/models/Dish";
import { getCategory, getSection } from "@/lib/menu-sections";
import { currencyUnit } from "@/lib/format";
import { BrandLogo } from "@/components/menu/brand-logo";
import { DishCard } from "@/components/menu/dish-card";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ section: string; category: string }>;
}) {
  const { section: sectionKey, category: categoryParam } = await params;
  const categoryLabel = decodeURIComponent(categoryParam);

  const section = getSection(sectionKey);
  const category = getCategory(sectionKey, categoryLabel);
  if (!section || !category) notFound();

  await connectDB();
  const restaurant = await Restaurant.findOne().lean();
  if (!restaurant) notFound();

  const dishes = await Dish.find({
    restaurantId: restaurant._id,
    category: categoryLabel,
    available: true,
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const unit = currencyUnit(restaurant.currency);
  const tagline =
    restaurant.description && restaurant.description.length <= 24
      ? restaurant.description
      : "";

  return (
    <div className="relative px-3 pb-28 pt-6 sm:px-6">
      <Link
        href="/"
        className="pressable pop-in absolute right-0 top-6 z-20 flex items-center gap-2 rounded-l-full bg-menu-teal py-2 pl-4 pr-3 text-[15px] text-white"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3z" />
        </svg>
        بازگشت
      </Link>

      <div className="materialize flex justify-center pt-10">
        <BrandLogo
          name={restaurant.name}
          tagline={tagline}
          logoUrl={restaurant.logoUrl || undefined}
          size="md"
          href="/"
        />
      </div>

      <h1
        className="rise-in mt-9 text-center text-[34px] font-medium leading-tight text-white"
        style={{ ["--delay" as string]: "60ms" }}
      >
        {category.label}
      </h1>

      {dishes.length === 0 ? (
        <p
          className="rise-in py-20 text-center text-[15px] text-menu-muted"
          style={{ ["--delay" as string]: "100ms" }}
        >
          فعلاً غذایی در این دسته موجود نیست.
        </p>
      ) : (
        <div className="mx-auto mt-9 grid max-w-[620px] grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-7 lg:max-w-[860px] lg:grid-cols-4">
          {dishes.map((dish, i) => (
            <div
              key={dish._id.toString()}
              className="rise-in"
              style={{
                ["--delay" as string]: `${100 + Math.min(i, 10) * 35}ms`,
              }}
            >
              <DishCard
                unit={unit}
                href={`/r/${restaurant.slug}/${dish._id.toString()}`}
                dish={{
                  id: dish._id.toString(),
                  name: dish.name,
                  nameEn: dish.nameEn || "",
                  description: dish.description || "",
                  price: dish.price,
                  thumbnailUrl: dish.thumbnailUrl || "",
                  hasModel: Boolean(dish.modelUrlGlb),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
