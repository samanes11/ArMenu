"use client";

import Image from "next/image";
import { Box, Circle, CircleDot } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
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

export function DishCard({
  dish,
  unit,
  onOpen,
}: {
  dish: DishCardData;
  unit: string;
  onOpen: () => void;
}) {
  const { qtyOf, add, decrease } = useNote();
  const qty = qtyOf(dish.id);
  const item = {
    id: dish.id,
    name: dish.name,
    price: dish.price,
    thumbnailUrl: dish.thumbnailUrl,
  };

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[14px] border bg-[var(--menu-bg)] transition-colors duration-200",
        qty > 0
          ? "border-gold-400"
          : "border-menu-line hover:border-gold-400 focus-within:border-gold-400",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[7/6] w-full bg-[var(--menu-bg)]"
        aria-label={dish.name}
      >
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
            <span className="relative">
              <Circle size={44} strokeWidth={1.4} />
              <CircleDot
                size={22}
                strokeWidth={1.4}
                className="absolute inset-0 m-auto"
              />
            </span>
          </div>
        )}

        {dish.hasModel && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-gold-400 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-gold-400 backdrop-blur">
            <Box size={10} strokeWidth={2} aria-hidden="true" />
            AR
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col bg-menu-card px-3 pb-2.5 pt-3 text-right">
        <h3 className="text-[15px] font-medium leading-6 text-white">
          {dish.name}
        </h3>

        {dish.nameEn && (
          <p className="text-[14px] leading-6 text-white/60">{dish.nameEn}</p>
        )}

        {dish.description && (
          <p className="mt-0.5 line-clamp-3 text-[12.5px] leading-[1.7] text-menu-muted">
            {dish.description}
          </p>
        )}

        <p className="mt-auto pt-2 text-[14px] font-medium text-gold-400">
          {formatPrice(dish.price, unit)}
        </p>
      </div>

      {qty === 0 ? (
        <button
          type="button"
          onClick={() => add(item)}
          className="h-11 w-full border-t border-menu-line bg-[var(--menu-bg)] text-[14px] font-medium text-white transition-colors active:bg-white/10"
        >
          افزودن به یادداشت
        </button>
      ) : (
        <div className="flex h-11 w-full items-center justify-between border-t border-gold-400 bg-[var(--menu-bg)] px-2">
          <button
            type="button"
            aria-label="افزودن"
            onClick={() => add(item)}
            className="pressable h-9 w-9 text-[20px] text-gold-400"
          >
            +
          </button>

          <span className="text-[14px] font-medium text-white">
            {qty.toLocaleString("fa-IR")}
          </span>

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
