import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { currencyUnit } from "@/lib/format";
import { NoteProvider, NoteBar } from "@/components/menu/note-provider";
import Script from "next/script";

export default async function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();
  const restaurant = await Restaurant.findOne().select("currency").lean();

  return (
    <NoteProvider unit={currencyUnit(restaurant?.currency)}>
      <div className="menu-theme min-h-[100dvh]">{children}</div>
      <NoteBar />
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
        strategy="afterInteractive"
      />
    </NoteProvider>
  );
}
