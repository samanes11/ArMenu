
import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/get-restaurant";
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

  const restaurant = await getRestaurant();
  if (!restaurant) notFound();

  return (
    <>
      <CategorySidebar
        sectionKey={section.key}
        categories={section.categories}
      />

      <div className="min-h-[100dvh] pl-[68px] min-[400px]:pl-[87px]">
        {children}
      </div>
    </>
  );
}
