"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toggleDishAvailabilityAction, deleteDishAction } from "@/lib/actions/dish";
import { formatToman } from "@/lib/format";
import { MENU_SECTIONS } from "@/lib/menu-sections";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "@/components/toggle-switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DishRow = {
  _id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  category: string;
  thumbnailUrl: string;
  available: boolean;
};

const norm = (s: string) => s.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\u200c/g, " ").trim().toLowerCase();
const fa = (n: number) => n.toLocaleString("fa-IR");

export function DishList({ dishes }: { dishes: DishRow[] }) {
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const groups = useMemo(() => {
    const q = norm(query);
    const filtered = dishes.filter(
      (d) =>
        (activeCategory === "all" || d.category === activeCategory) &&
        (!q || [d.name, d.nameEn || "", d.description || "", d.category].some((v) => norm(v).includes(q)))
    );

    const known = new Set<string>();
    const result: { section: string; category: string; items: DishRow[] }[] = [];
    for (const section of MENU_SECTIONS) {
      for (const cat of section.categories) {
        known.add(cat.label);
        const items = filtered.filter((d) => d.category === cat.label);
        if (items.length) result.push({ section: section.label, category: cat.label, items });
      }
    }
    const others = filtered.filter((d) => !known.has(d.category));
    if (others.length) result.push({ section: "", category: "سایر", items: others });
    return result;
  }, [dishes, query, activeCategory]);

  const chips = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of dishes) m.set(d.category, (m.get(d.category) || 0) + 1);
    return [{ key: "all", label: "همه", count: dishes.length }, ...Array.from(m, ([label, count]) => ({ key: label, label, count }))];
  }, [dishes]);

  if (dishes.length === 0) return <p className="text-body py-6 text-center text-white/55">هنوز غذایی اضافه نکرده‌اید.</p>;

  return (
    <div className="space-y-4">
      <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی غذا (نام فارسی، انگلیسی، توضیحات یا دسته)..." />

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {chips.map((chip) => (
          <Button
            key={chip.key}
            type="button"
            size="sm"
            variant={activeCategory === chip.key ? "default" : "ghost"}
            onClick={() => setActiveCategory(chip.key)}
            className={cn("shrink-0 rounded-full border", activeCategory !== chip.key && "border-border text-white/75 hover:border-gold-400")}
          >
            {chip.label} ({fa(chip.count)})
          </Button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="text-body py-6 text-center text-white/55">غذایی با این مشخصات پیدا نشد.</p>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="space-y-2">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-gold-400">
              {group.category}
              {group.section && <span className="text-[12px] font-normal text-white/40">· {group.section}</span>}
              <span className="text-[12px] font-normal text-white/40">({fa(group.items.length)})</span>
            </h3>

            <Card className="overflow-hidden">
              <ul className="divide-y divide-white/10">
                {group.items.map((dish) => (
                  <li key={dish._id} className="flex items-center gap-2.5 p-3 sm:gap-4 sm:p-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black sm:h-14 sm:w-14">
                      {dish.thumbnailUrl && <Image src={dish.thumbnailUrl} alt={dish.name} width={56} height={56} className="h-full w-full object-cover" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-headline truncate text-white">{dish.name}</p>
                      <p className="text-caption text-gold-400">{formatToman(dish.price)}</p>
                    </div>

                    <ToggleSwitch size="sm" checked={dish.available} label={dish.available ? "فعال" : "غیرفعال"} onChange={() => toggleDishAvailabilityAction(dish._id)} />

                    <Button asChild variant="ghost" size="icon" className="text-gold-400" aria-label="ویرایش">
                      <Link href={`/dashboard/edit/${dish._id}`}>
                        <Pencil size={17} strokeWidth={1.8} />
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label="حذف"
                      onClick={() => {
                        if (window.confirm(`«${dish.name}» حذف شود؟ این عمل قابل بازگشت نیست.`)) startTransition(() => deleteDishAction(dish._id));
                      }}
                    >
                      <Trash2 size={17} strokeWidth={1.8} />
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))
      )}
    </div>
  );
}
