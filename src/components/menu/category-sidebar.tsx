"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "motion/react";

export type SidebarCategory = {
  label: string;
  labelEn: string;
  icon: string;
  thumb: string; // تصویر اولین غذای آن دسته؛ اگر نبود ایموجی نمایش داده می‌شود
};

// نوار کناری ثابت (سمت چپ صفحه) با دایره‌ی تصویر هر دسته. چون در layout قرار دارد
// هنگام جابه‌جایی بین دسته‌ها دوباره ساخته نمی‌شود و جای اسکرولش حفظ می‌شود.
export function CategorySidebar({ sectionKey, categories }: { sectionKey: string; categories: SidebarCategory[] }) {
  const params = useParams<{ category?: string }>();
  const active = params.category ? decodeURIComponent(params.category) : "";
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <nav
      aria-label="دسته‌بندی‌ها"
      className="fixed bottom-0 left-0 top-0 z-30 w-[87px] overflow-y-auto bg-menu-teal pb-8 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex flex-col gap-5">
        {categories.map((category) => {
          const isActive = category.label === active;
          return (
            <li key={category.label}>
              <Link
                ref={isActive ? activeRef : undefined}
                href={`/menu/${sectionKey}/${encodeURIComponent(category.label)}`}
                aria-current={isActive ? "page" : undefined}
                className="pressable relative flex flex-col items-center px-1 text-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="category-active-indicator"
                    className="absolute inset-y-0 right-0 w-1 bg-gold-400"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <motion.span
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="relative flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-black text-[22px]"
                >
                  {category.thumb ? (
                    <Image src={category.thumb} alt="" fill sizes="50px" className="object-cover" />
                  ) : (
                    category.icon
                  )}
                </motion.span>
                <span className="mt-2 text-[15px] leading-6 text-white">{category.label}</span>
                <span className="min-h-5 text-[13px] leading-5 text-white/80">{category.labelEn}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
