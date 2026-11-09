import { notFound, redirect } from "next/navigation";
import { getSection } from "@/lib/menu-sections";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionKey } = await params;
  const section = getSection(sectionKey);
  if (!section) notFound();

  redirect(`/menu/${section.key}/${encodeURIComponent(section.categories[0].label)}`);
}