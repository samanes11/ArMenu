"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import {
  Box,
  ChevronDown,
  ChevronUp,
  ClipboardPlus,
  X,
} from "lucide-react";
import { formatPriceParts } from "@/lib/format";
import type { DishCardData } from "./dish-card";
import { useNote } from "./note-provider";

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -48 }),
};

const lift = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function DishModal({
  dishes,
  unit,
  open,
  index,
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
  const [expanded, setExpanded] = useState(false);
  const direction = useRef(1);
  const dish = dishes[index];

  useEffect(() => setExpanded(false), [index]);

  useEffect(() => {
    if (!open || !dish?.hasModel) return;
    if (customElements.get("model-viewer")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
    document.head.appendChild(script);
  }, [open, dish?.hasModel]);

  const arRef = useRef<
    (HTMLElement & { activateAR: () => void; canActivateAR: boolean }) | null
  >(null);

  if (!dish) return null;

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
  const longDesc = dish.description.length > 90;
  const fa = (n: number) => n.toLocaleString("fa-IR");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          dir="ltr"
          className="fixed inset-0 z-50 m-auto flex h-[min(92dvh,780px)] w-[80vw] max-w-[400px] flex-col gap-3 font-vazir outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10"
        >
          <DialogPrimitive.Title className="sr-only">
            {dish.name}
          </DialogPrimitive.Title>

          {/* هدر: دکمه سه‌بعدی و بستن؛ بدون شمارنده */}
          <div className="flex shrink-0 items-center justify-between px-1">
            <div className="justify-self-start">
              {dish.hasModel ? (
                <button
                  type="button"
                  onClick={openAr}
                  aria-label="مشاهده سه‌بعدی روی میز"
                  className="pressable flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-[13px] font-bold text-gold-400 ring-1 ring-gold-400/40 backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  <Box size={15} /> 3D
                </button>
              ) : null}
            </div>

            <DialogPrimitive.Close
              aria-label="بستن"
              className="pressable flex h-9 w-9 items-center justify-center justify-self-end rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X size={17} />
            </DialogPrimitive.Close>
          </div>

          {/* کارت اصلی؛ ابعاد و موقعیت آن با حرکت موس تغییر نمی‌کند */}
          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0">
              {/* سایه‌ی شناور زیر کارت */}
              <div
                aria-hidden
                className="absolute inset-x-6 -bottom-3 top-12 rounded-[36px] bg-black/65 blur-2xl"
              />

              {/* لایه‌ی عکس (تمام‌قد) */}
              <div className="absolute inset-0 overflow-hidden rounded-[26px] border border-white/20 sm:rounded-[32px] bg-black shadow-[0_24px_55px_-24px_rgba(0,0,0,0.8)] ring-1 ring-gold-400/30">
                {/* تصویر فقط در باکس بالایی قرار می‌گیرد و وارد محدوده پنل قیمت نمی‌شود */}
                <div className="absolute inset-x-0 top-0 bottom-[24%] overflow-hidden">
                  <AnimatePresence initial={false} custom={direction.current}>
                    <motion.div
                      key={dish.id}
                      custom={direction.current}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      {dish.thumbnailUrl ? (
                        <Image
                          src={dish.thumbnailUrl}
                          alt={dish.name}
                          fill
                          sizes="(max-width: 420px) 100vw, 420px"
                          className="object-cover object-center"
                          priority
                          placeholder={dish.blurDataUrl ? "blur" : "empty"}
                          blurDataURL={dish.blurDataUrl || undefined}
                        />
                      ) : (
                        <div className="h-full w-full bg-menu-card" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent"
                  />
                  {/* محو شدن کامل انتهای عکس در پس‌زمینه مشکی کارت */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-b from-transparent via-black/70 to-black"
                  />
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] sm:rounded-[32px]"
                />
              </div>

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
                <div
                  className="pointer-events-none absolute inset-x-0 top-[28%] z-10 flex justify-center"
                >
                  <span className="-rotate-12 rounded-2xl border-[3px] border-black bg-white px-7 py-3 text-[22px] font-extrabold text-black shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)]">
                    تمام شد
                  </span>
                </div>
              )}

              {/* پنل اطلاعات و قیمت؛ روی تصویر قرار می‌گیرد اما محدوده‌ی عکس از قبل برای آن خالی شده است */}
              <div
                dir="rtl"
                className="absolute bottom-3 left-1/2 z-20 w-[90%] -translate-x-1/2 rounded-[22px] bg-black/75 p-3 sm:rounded-[26px] sm:p-4 text-right text-white ring-1 ring-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_30px_-16px_rgba(0,0,0,0.8)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={dish.id}
                    variants={lift}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h3 className="text-[18px] font-extrabold leading-7 sm:text-[20px] sm:leading-8">
                      {dish.name}
                    </h3>
                    {dish.nameEn && (
                      <p
                        dir="ltr"
                        className="text-right text-[12px] font-medium text-gold-400 sm:text-[13px]"
                      >
                        {dish.nameEn}
                      </p>
                    )}

                    <p
                      className={`mt-1.5 text-[12px] leading-[1.85] text-white/75 sm:mt-2 sm:text-[13px] sm:leading-[1.9] ${
                        expanded
                          ? "no-scrollbar max-h-36 overflow-y-auto"
                          : "line-clamp-2"
                      }`}
                    >
                      {dish.description || "—"}
                    </p>

                    {longDesc && (
                      <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="mt-1 flex items-center gap-1 text-[12px] font-bold text-gold-400"
                      >
                        {expanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                        {expanded ? "کمتر" : "ادامه‌ی توضیحات"}
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="my-2 h-px bg-gradient-to-l sm:my-3 from-transparent via-white/20 to-transparent" />

                {/* قیمت + افزودن */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[21px] font-extrabold leading-none tabular-nums text-white sm:text-[24px]">
                      {priceParts.value}
                    </span>
                    <span className="text-[12px] font-bold text-gold-400">
                      {priceParts.label}
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
                    className="pressable relative flex h-10 items-center gap-1.5 rounded-full bg-gold-400 pl-4 pr-3 text-[13px] sm:h-12 sm:gap-2 sm:pl-5 sm:pr-4 sm:text-[14px] font-extrabold text-black shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-3px_0_rgba(0,0,0,0.18),0_10px_18px_-6px_rgba(0,0,0,0.6)] transition-transform active:translate-y-px active:scale-95 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45 disabled:shadow-none"
                  >
                    <ClipboardPlus size={19} />
                    {dish.available ? "افزودن" : "ناموجود"}
                    {dish.available && qty > 0 && (
                      <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-bold text-gold-400 ring-1 ring-gold-400/60">
                        {fa(qty)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}