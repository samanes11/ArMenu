"use client";

import Image from "next/image";
import { useTransition } from "react";
import {
  toggleDishAvailabilityAction,
  deleteDishAction,
} from "@/lib/actions/dish";
import { formatToman } from "@/lib/format";
import { ToggleSwitch } from "@/components/toggle-switch";
import Link from "next/link";

type DishRow = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  thumbnailUrl: string;
  available: boolean;
};

export function DishList({ dishes }: { dishes: DishRow[] }) {
  const [, startTransition] = useTransition();

  if (dishes.length === 0) {
    return (
      <p className="text-body py-6 text-center text-white/55">
        هنوز غذایی اضافه نکرده‌اید.
      </p>
    );
  }

  return (
    <ul className="admin-card divide-y divide-white/10 overflow-hidden">
      {dishes.map((dish, i) => (
        <li
          key={dish._id}
          className="rise-in flex items-center gap-4 p-4"
          style={{ ["--delay" as string]: `${Math.min(i, 6) * 35}ms` }}
        >
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black">
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
            <p className="text-headline truncate text-gold-400">{dish.name}</p>
            <p className="text-caption text-white/55">
              {dish.category} · {formatToman(dish.price)}
            </p>
          </div>

          <ToggleSwitch
            checked={dish.available}
            label={dish.available ? "فعال" : "غیرفعال"}
            onChange={() => toggleDishAvailabilityAction(dish._id)}
          />

          <Link
            href={`/dashboard/edit/${dish._id}`}
            className="pressable text-caption shrink-0 rounded-lg px-2 py-1.5 font-medium text-gold-400 hover:bg-gold-400/10"
          >
            ویرایش
          </Link>

          <button
            onClick={() => {
              if (
                window.confirm(
                  `«${dish.name}» حذف شود؟ این عمل قابل بازگشت نیست.`,
                )
              ) {
                startTransition(() => deleteDishAction(dish._id));
              }
            }}
            className="pressable text-caption shrink-0 rounded-lg px-2 py-1.5 font-medium text-red-300 hover:bg-red-500/15"
          >
            حذف
          </button>
        </li>
      ))}
    </ul>
  );
}
