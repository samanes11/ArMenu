"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useNote } from "./note-provider";

export type DishCardData = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  hasModel: boolean;
};

export function DishCard({ dish, href, unit }: { dish: DishCardData; href: string; unit: string }) {
  const { qtyOf, add, decrease } = useNote();
  const qty = qtyOf(dish.id);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[14px] border bg-black transition-colors duration-200 ${
        qty > 0 ? "border-gold-400" : "border-menu-line hover:border-gold-400 focus-within:border-gold-400"
      }`}
    >
      {/* تصویر غذا؛ با لمس، صفحه‌ی جزئیات (و نمایش AR) باز می‌شود */}
      <Link href={href} className="relative block aspect-[7/6] bg-black" aria-label={dish.name}>
        {dish.thumbnailUrl ? (
          <Image
            src={dish.thumbnailUrl}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/15">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.500" stroke="currentColor" strokeWidth="1.400" />
              <circle cx="12" cy="12" r="4.500" stroke="currentColor" strokeWidth="1.400" />
            </svg>
          </div>
        )}
        {dish.hasModel && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-gold-400/50 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-gold-400 backdrop-blur">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3 20 7.500v9L12 21l-8-4.500v-9L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            AR
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col bg-menu-card px-3 pb-2.5 pt-3 text-right">
        <h3 className="text-[15px] font-medium leading-6 text-white">{dish.name}</h3>
        {dish.nameEn && <p className="text-[14px] leading-6 text-white/60">{dish.nameEn}</p>}
        {dish.description && (
          <p className="mt-0.5 line-clamp-3 text-[12.5px] leading-[1.7] text-menu-muted">{dish.description}</p>
        )}
        <p className="mt-auto pt-2 text-[14px] font-medium text-gold-400">
          <span>{formatPrice(dish.price, unit)}</span>
        </p>
      </div>

      {qty === 0 ? (
        <button
          type="button"
          onClick={() => add({ id: dish.id, name: dish.name, price: dish.price })}
          className="h-11 w-full border-t border-menu-line bg-black text-[14px] font-medium text-white transition-colors active:bg-white/10"
        >
          افزودن به یادداشت
        </button>
      ) : (
        <div className="flex h-11 w-full items-center justify-between border-t border-gold-400/60 bg-black px-2">
          <button
            type="button"
            aria-label="افزودن"
            onClick={() => add({ id: dish.id, name: dish.name, price: dish.price })}
            className="pressable h-9 w-9 text-[20px] text-gold-400"
          >
            +
          </button>
          <span className="text-[14px] font-medium text-white">{qty.toLocaleString("fa-IR")}</span>
          <button
            type="button"
            aria-label="کم کردن"
            onClick={() => decrease(dish.id)}
            className="pressable h-9 w-9 text-[20px] text-gold-400"
          >
            −
          </button>
        </div>
      )}
    </article>
  );
}
