"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  ClipboardPlus,
  Maximize2,
  Share2,
  X,
} from "lucide-react";
import { formatPriceCompact } from "@/lib/format";
import type { DishCardData } from "./dish-card";
import { useNote } from "./note-provider";

export function DishModal({
  dishes,
  unit,
  open,
  index,
  onIndexChange,
  onClose,
}: {
  dishes: DishCardData[];
  unit: string;
  open: boolean;
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const { qtyOf, add } = useNote();
  const scroller = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const dish = dishes[index];

  useEffect(() => setExpanded(false), [index]);

  // موقع باز شدن، کارتِ آیتم انتخاب‌شده را وسط carousel بیاور
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const card = scroller.current?.children[index] as HTMLElement | undefined;
      card?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "instant",
      });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!dish) return null;

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = scroller.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const center = box.left + box.width / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const r = child.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== index) onIndexChange(best);
    });
  };

  const share = async () => {
    const url = `${location.origin}/dish/${dish.id}`;
    try {
      if (navigator.share)
        await navigator.share({ title: dish.nameEn || dish.name, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };

  const qty = qtyOf(dish.id);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 m-auto flex h-[min(92dvh,820px)] w-[calc(100%-24px)] max-w-[420px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#141414] p-3.5 outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10"
        >
          <DialogPrimitive.Title className="sr-only">
            {dish.name}
          </DialogPrimitive.Title>

          {/* تصویر */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl bg-black">
            <AnimatePresence initial={false}>
              <motion.div
                key={dish.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {dish.thumbnailUrl ? (
                  <Image
                    src={dish.thumbnailUrl}
                    alt={dish.name}
                    fill
                    sizes="420px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-menu-card" />
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={share}
              aria-label="اشتراک‌گذاری"
              className="pressable absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
            >
              <Share2 size={17} />
            </button>
            <DialogPrimitive.Close
              aria-label="بستن"
              className="pressable absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
            >
              <X size={18} />
            </DialogPrimitive.Close>
            <Link
              href={`/dish/${dish.id}`}
              aria-label="نمایش کامل / AR"
              className="pressable absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
            >
              <Maximize2 size={16} />
            </Link>
          </div>

          {/* Carousel توضیحات */}
          <div
            ref={scroller}
            onScroll={onScroll}
            className="no-scrollbar -mx-3.5 mt-3 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-[9%]"
          >
            {dishes.map((d, i) => (
              <div
                key={d.id}
                className="w-[82%] shrink-0 snap-center snap-always rounded-3xl bg-white p-4 text-right text-neutral-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[17px] font-bold leading-7">
                    {d.nameEn || d.name}
                  </h3>
                  {d.description.length > 90 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-200 px-3 py-1 text-[12px] font-medium"
                    >
                      {expanded && i === index ? (
                        <ArrowDown size={13} />
                      ) : (
                        <ArrowUp size={13} />
                      )}
                      {expanded && i === index ? "کمتر" : "بیشتر"}
                    </button>
                  )}
                </div>
                {d.nameEn && (
                  <p className="text-[13px] text-neutral-500">{d.name}</p>
                )}
                <p
                  className={`mt-2 text-[13px] leading-7 text-neutral-600 ${expanded && i === index ? "max-h-40 overflow-y-auto" : "line-clamp-3"}`}
                >
                  {d.description || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* نوار پایین */}
          <div className="mt-3 flex items-center justify-between px-1.5">
            <button
              type="button"
              onClick={() =>
                add({
                  id: dish.id,
                  name: dish.name,
                  price: dish.price,
                  thumbnailUrl: dish.thumbnailUrl,
                })
              }
              aria-label="افزودن به یادداشت"
              className="pressable relative flex h-12 w-12 items-center justify-center rounded-full bg-[#5a0a0a] text-white"
            >
              <ClipboardPlus size={21} />
              {qty > 0 && (
                <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[11px] font-bold text-black">
                  {qty.toLocaleString("fa-IR")}
                </span>
              )}
            </button>
            <p className="text-[17px] font-bold text-white">
              {formatPriceCompact(dish.price, unit)}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
