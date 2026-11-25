import { getRestaurant } from "@/lib/get-restaurant";
import { currencyUnit } from "@/lib/format";
import { NoteProvider, NoteBar } from "@/components/menu/note-provider";

export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const restaurant = await getRestaurant();

  return (
    <NoteProvider unit={currencyUnit(restaurant?.currency)}>
      <div className="menu-theme min-h-[100dvh]">{children}</div>
      <NoteBar />
    </NoteProvider>
  );
}