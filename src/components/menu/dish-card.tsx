"use client";

import Image from "next/image";
import { Box, Circle, CircleDot } from "lucide-react";
import { formatPriceStack } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useNote } from "./note-provider";

export type DishCardData = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  blurDataUrl: string;
  hasModel: boolean;
  modelUrlGlb: string;
  modelUrlUsdz: string;
  available: boolean;
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
  const price = formatPriceStack(dish.price, unit);
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
            className={cn("object-cover", !dish.available && "opacity-55")}
            placeholder={dish.blurDataUrl ? "blur" : "empty"}
            blurDataURL={dish.blurDataUrl || undefined}
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

        {!dish.available && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="-rotate-12 rounded-xl border-[2.5px] border-black bg-white px-4 py-1.5 text-[14px] font-extrabold tracking-wide text-black shadow-lg">
              تمام شد
            </span>
          </div>
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

        <div className="mt-auto flex items-center gap-1.5 pt-2 text-white">
          <span className="text-[19px] font-bold leading-none">
            {price.num}
          </span>
          <span className="flex flex-col text-[11px] font-medium leading-[1.25]">
            {price.scale && <span>{price.scale}</span>}
            <span>{price.unit}</span>
          </span>
        </div>
      </div>

      {!dish.available ? (
        <div className="flex h-11 w-full items-center justify-center border-t border-menu-line bg-[var(--menu-bg)] text-[13px] text-white/40">
          موجود نیست
        </div>
      ) : qty === 0 ? (
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
