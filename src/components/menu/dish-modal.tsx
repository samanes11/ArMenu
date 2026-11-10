"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Box, ClipboardPlus, X } from "lucide-react";
import { formatPriceParts } from "@/lib/format";
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

  const arRef = useRef<
    (HTMLElement & { activateAR: () => void; canActivateAR: boolean }) | null
  >(null);

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

  const openAr = () => {
    const el = arRef.current;
    if (!el) return;
    if (!el.canActivateAR) {
      alert(
        "نمایش سه‌بعدی روی این دستگاه پشتیبانی نمی‌شود. با گوشی امتحان کنید.",
      );
      return;
    }
    el.activateAR();
  };

  const qty = qtyOf(dish.id);
  const priceParts = formatPriceParts(dish.price, unit);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          dir="ltr"
          className="fixed inset-0 z-50 m-auto flex h-[min(90dvh,760px)] w-[calc(100%-20px)] max-w-[400px] flex-col gap-2 outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10"
        >
          <DialogPrimitive.Title className="sr-only">
            {dish.name}
          </DialogPrimitive.Title>

          {/* هدر: دکمه‌ی 3D سمت چپ، بستن سمت راست — بالای عکس، نه روی خود عکس */}
          <div className="flex shrink-0 items-center justify-between px-0.5">
            {dish.hasModel ? (
              <button
                type="button"
                onClick={openAr}
                aria-label="مشاهده سه‌بعدی روی میز"
                className="pressable flex h-9 items-center gap-1.5 rounded-full border border-gold-400 bg-black/55 px-3 text-[13px] font-bold text-gold-400 backdrop-blur"
              >
                <Box size={15} /> 3D
              </button>
            ) : (
              <span />
            )}

            <DialogPrimitive.Close
              aria-label="بستن"
              className="pressable flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
            >
              <X size={17} />
            </DialogPrimitive.Close>
          </div>

          {/* عکس */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-black">
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
                    sizes="400px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-menu-card" />
                )}
              </motion.div>
            </AnimatePresence>

            {dish.hasModel && (
              <model-viewer
                key={dish.id}
                ref={arRef}
                src={dish.modelUrlGlb}
                ios-src={dish.modelUrlUsdz || undefined}
                alt={dish.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                ar-placement="floor"
                loading="eager"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
            )}

            {!dish.available && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <span className="-rotate-12 rounded-2xl border-[3px] border-black bg-white px-7 py-3 text-[22px] font-extrabold tracking-wide text-black shadow-xl">
                  تمام شد
                </span>
              </div>
            )}
          </div>

          {/* کارت توضیحات */}
          <div
            ref={scroller}
            onScroll={onScroll}
            className="no-scrollbar flex shrink-0 snap-x snap-mandatory gap-2.5 overflow-x-auto px-6"
          >
            {dishes.map((d, i) => (
              <div
                key={d.id}
                dir="rtl"
                className="w-[95%] shrink-0 snap-center snap-always rounded-[28px] bg-white px-4 py-4 text-right text-neutral-900"
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
                  className={`mt-1.5 text-[13px] leading-[1.7] text-neutral-600 ${
                    expanded && i === index
                      ? "max-h-40 overflow-y-auto"
                      : "line-clamp-2"
                  }`}
                >
                  {d.description || "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="flex w-full shrink-0 items-center justify-between rounded-full bg-menu-teal py-2 pl-5 pr-2 backdrop-blur">
            <div className="flex items-center gap-2">
              <span
                className="text-[14px] font-vazir font-extrabold text-gold-400"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {priceParts.label}
              </span>
              <span dir="rtl" className="text-[16px] font-vazir  text-white">
                {priceParts.value}
              </span>
            </div>

            <button
              type="button"
              disabled={!dish.available}
              onClick={() =>
                dish.available &&
                add({
                  id: dish.id,
                  name: dish.name,
                  price: dish.price,
                  thumbnailUrl: dish.thumbnailUrl,
                })
              }
              aria-label={
                dish.available ? "افزودن به یادداشت" : "این غذا موجود نیست"
              }
              className="pressable relative flex h-12 w-12 items-center justify-center rounded-full bg-gold-400 text-black disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
            >
              <ClipboardPlus size={21} />
              {dish.available && qty > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-bold text-gold-400">
                  {qty.toLocaleString("fa-IR")}
                </span>
              )}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
