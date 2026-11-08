import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
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

  const categories = section.categories;

  return (
    <>
      <CategorySidebar sectionKey={section.key} categories={categories} />
      <div className="min-h-[100dvh] pl-[68px] min-[400px]:pl-[87px]">{children}</div>
    </>
  );
}
