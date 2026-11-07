import { notFound, redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { Dish } from "@/lib/models/Dish";
import { getSection } from "@/lib/menu-sections";

// صفحه‌ی بخش مستقیماً به اولین دسته‌ای می‌رود که غذا دارد (وگرنه اولین دسته)
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionKey } = await params;
  const section = getSection(sectionKey);
  if (!section) notFound();

  await connectDB();
  const restaurant = await Restaurant.findOne().select("_id").lean();

  let target = section.categories[0].label;
  if (restaurant) {
    const filled = await Dish.distinct("category", {
      restaurantId: restaurant._id,
      available: true,
      category: { $in: section.categories.map((c) => c.label) },
    });
    const first = section.categories.find((c) => filled.includes(c.label));
    if (first) target = first.label;
  }

  redirect(`/menu/${section.key}/${encodeURIComponent(target)}`);
}
