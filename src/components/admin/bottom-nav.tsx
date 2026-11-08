"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { UtensilsCrossed, QrCode, Settings, Store } from "lucide-react";

const ITEMS = [
  {
    href: "/dashboard",
    label: "غذاها",
    icon: UtensilsCrossed,
    match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/edit"),
  },
  {
    href: "/dashboard/qr",
    label: "کد QR",
    icon: QrCode,
    match: (p: string) => p.startsWith("/dashboard/qr"),
  },
  {
    href: "/dashboard/settings",
    label: "تنظیمات",
    icon: Settings,
    match: (p: string) => p.startsWith("/dashboard/settings"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
      <nav
        aria-label="ناوبری پنل مدیریت"
        className="material-chip pop-in flex items-center gap-0.5 rounded-full px-1.5 py-2 shadow-chip"
      >
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="pressable relative flex flex-col items-center gap-0.5 rounded-full px-3 py-2"
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-full bg-gold-400"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative flex flex-col items-center gap-0.5">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={active ? "text-black" : "text-white/70"}
                />
                <span
                  className={`hidden text-[10px] font-medium sm:block ${active ? "text-black" : "text-white/70"}`}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}

        <span className="mx-1 h-8 w-px bg-white/15" aria-hidden="true" />

        <Link
          href="/"
          target="_blank"
          className="pressable flex flex-col items-center gap-0.5 rounded-full px-3 py-2 text-white/70"
        >
          <Store size={20} strokeWidth={1.8} />
          <span className="hidden text-[10px] font-medium sm:block">منوی عمومی</span>
        </Link>
      </nav>
    </div>
  );
}
