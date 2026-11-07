import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { Dish } from "@/lib/models/Dish";
import { getSection } from "@/lib/menu-sections";
import { CategorySidebar } from "@/components/menu/category-sidebar";

export default async function SectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section: sectionKey } = await params;
  const section = getSection(sectionKey);
  if (!section) notFound();

  await connectDB();
  const restaurant = await Restaurant.findOne().select("_id").lean();
  if (!restaurant) notFound();

  // تصویر دایره‌ی هر دسته در نوار کناری = تصویر اولین غذای دارای تصویر در همان دسته
  const withThumbs = await Dish.find({
    restaurantId: restaurant._id,
    available: true,
    thumbnailUrl: { $ne: "" },
    category: { $in: section.categories.map((c) => c.label) },
  })
    .sort({ order: 1, createdAt: -1 })
    .select("category thumbnailUrl")
    .lean();

  const thumbByCategory = new Map<string, string>();
  for (const dish of withThumbs) {
    if (!thumbByCategory.has(dish.category)) thumbByCategory.set(dish.category, dish.thumbnailUrl);
  }

  const categories = section.categories.map((c) => ({
    label: c.label,
    labelEn: c.labelEn,
    icon: c.icon,
    thumb: thumbByCategory.get(c.label) || "",
  }));

  return (
    <>
      <CategorySidebar sectionKey={section.key} categories={categories} />
      <div className="min-h-[100dvh] pl-[87px]">{children}</div>
    </>
  );
}
