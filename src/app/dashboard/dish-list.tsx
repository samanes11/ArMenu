"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  toggleDishAvailabilityAction,
  deleteDishAction,
} from "@/lib/actions/dish";
import { formatToman } from "@/lib/format";
import { MENU_SECTIONS } from "@/lib/menu-sections";
import { ToggleSwitch } from "@/components/toggle-switch";
import { Pencil, Trash2 } from "lucide-react";

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

// نرمال‌سازی برای جستجو: ی/ک عربی → فارسی، حذف فاصله‌ی اضافه، حروف کوچک
const norm = (s: string) =>
  s
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim()
    .toLowerCase();

export function DishList({ dishes }: { dishes: DishRow[] }) {
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // دسته‌بندی‌ها به ترتیب بخش‌های منو؛ دسته‌هایی که غذا دارند + «سایر/ناشناخته»
  const groups = useMemo(() => {
    const q = norm(query);
    const filtered = dishes.filter((d) => {
      if (activeCategory !== "all" && d.category !== activeCategory)
        return false;
      if (!q) return true;
      return (
        norm(d.name).includes(q) ||
        norm(d.nameEn || "").includes(q) ||
        norm(d.description || "").includes(q) ||
        norm(d.category).includes(q)
      );
    });

    const known = new Set<string>();
    const result: { section: string; category: string; items: DishRow[] }[] =
      [];

    for (const section of MENU_SECTIONS) {
      for (const cat of section.categories) {
        known.add(cat.label);
        const items = filtered.filter((d) => d.category === cat.label);
        if (items.length)
          result.push({ section: section.label, category: cat.label, items });
      }
    }

    const others = filtered.filter((d) => !known.has(d.category));
    if (others.length)
      result.push({ section: "", category: "سایر", items: others });

    return result;
  }, [dishes, query, activeCategory]);

  // تعداد غذا در هر دسته برای چیپ‌های فیلتر
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of dishes) m.set(d.category, (m.get(d.category) || 0) + 1);
    return m;
  }, [dishes]);

  const fa = (n: number) => n.toLocaleString("fa-IR");

  if (dishes.length === 0) {
    return (
      <p className="text-body py-6 text-center text-white/55">
        هنوز غذایی اضافه نکرده‌اید.
      </p>
    );
  }

  const totalShown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-4">
      {/* جستجو */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجوی غذا (نام فارسی، انگلیسی، توضیحات یا دسته)..."
        className="admin-input"
      />

      {/* فیلتر دسته‌بندی */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {[{ key: "all", label: "همه", count: dishes.length }]
          .concat(
            Array.from(counts.entries()).map(([label, count]) => ({
              key: label,
              label,
              count,
            })),
          )
          .map((chip) => {
            const active = activeCategory === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setActiveCategory(chip.key)}
                className={`pressable shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] ${
                  active
                    ? "border-gold-400 bg-gold-400 font-bold text-black"
                    : "border-menu-line text-white/75 hover:border-gold-400/60"
                }`}
              >
                {chip.label} ({fa(chip.count)})
              </button>
            );
          })}
      </div>

      {totalShown === 0 ? (
        <p className="text-body py-6 text-center text-white/55">
          غذایی با این مشخصات پیدا نشد.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="space-y-2">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-gold-400">
              {group.category}
              {group.section && (
                <span className="text-[12px] font-normal text-white/40">
                  · {group.section}
                </span>
              )}
              <span className="text-[12px] font-normal text-white/40">
                ({fa(group.items.length)})
              </span>
            </h3>

            <ul className="admin-card divide-y divide-white/10 overflow-hidden">
              {group.items.map((dish) => (
                <li
                  key={dish._id}
                  className="flex items-center gap-2.5 p-3 sm:gap-4 sm:p-4"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black sm:h-14 sm:w-14">
                    {dish.thumbnailUrl ? (
                      <Image
                        src={dish.thumbnailUrl}
                        alt={dish.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-headline truncate text-white">
                      {dish.name}
                    </p>
                    <p className="text-caption text-gold-400">
                      {formatToman(dish.price)}
                    </p>
                  </div>

                  <ToggleSwitch
                    size="sm"
                    checked={dish.available}
                    label={dish.available ? "فعال" : "غیرفعال"}
                    onChange={() => toggleDishAvailabilityAction(dish._id)}
                  />

                  <Link
                    href={`/dashboard/edit/${dish._id}`}
                    aria-label="ویرایش"
                    className="pressable flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gold-400 hover:bg-gold-400/10 sm:h-auto sm:w-auto sm:px-2 sm:py-1.5"
                  >
                    <Pencil size={17} strokeWidth={1.8} className="sm:hidden" />
                    <span className="text-caption hidden font-medium sm:inline">
                      ویرایش
                    </span>
                  </Link>

                  <button
                    type="button"
                    aria-label="حذف"
                    onClick={() => {
                      if (
                        window.confirm(
                          `«${dish.name}» حذف شود؟ این عمل قابل بازگشت نیست.`,
                        )
                      ) {
                        startTransition(() => deleteDishAction(dish._id));
                      }
                    }}
                    className="pressable flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-300 hover:bg-red-500/15 sm:h-auto sm:w-auto sm:px-2 sm:py-1.5"
                  >
                    <Trash2 size={17} strokeWidth={1.8} className="sm:hidden" />
                    <span className="text-caption hidden font-medium sm:inline">
                      حذف
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
