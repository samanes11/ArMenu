"use client";

import { useActionState } from "react";
import { createDishAction } from "@/lib/actions/dish";
import { Button } from "@/components/button";
import { MENU_SECTIONS } from "@/lib/menu-sections";

const inputClass = "admin-input";

export function DishForm() {
  const [state, formAction, pending] = useActionState(createDishAction, undefined);

  return (
    <form action={formAction} className="admin-card grid gap-4 p-5 sm:grid-cols-2">
      {state?.error && (
        <p className="admin-error sm:col-span-2">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <label className="admin-label">نام غذا</label>
        <input name="name" required className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">نام انگلیسی (اختیاری)</label>
        <input name="nameEn" dir="ltr" className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">قیمت (تومان)</label>
        <input name="price" type="number" min={0} step={1000} required className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">دسته‌بندی</label>
        <select name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            انتخاب دسته‌بندی
          </option>
          {MENU_SECTIONS.map((section) => (
            <optgroup key={section.key} label={section.label}>
              {section.categories.map((category) => (
                <option key={category.label} value={category.label}>
                  {category.icon} {category.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">تصویر بندانگشتی</label>
        <input name="thumbnail" type="file" accept="image/*" className="admin-file" />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label className="admin-label">توضیحات</label>
        <textarea name="description" rows={2} className={inputClass} />
      </div>

      {/* قرارگیری نزدیک به هم: هر دو فایل مدل سه‌بعدی به یک هدف خدمت می‌کنند —
          نمایش AR روی میز — پس در یک گروه دیده می‌شوند. */}
      <div className="space-y-3 rounded-xl border border-gold-500/40 bg-gold-400/5 p-3 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
        <div className="space-y-1.5">
          <label className="admin-label">مدل سه‌بعدی (GLB) — اندروید و وب</label>
          <input name="modelGlb" type="file" accept=".glb" className="admin-file" />
        </div>
        <div className="space-y-1.5">
          <label className="admin-label">مدل سه‌بعدی (USDZ) — اختیاری، برای آیفون</label>
          <input name="modelUsdz" type="file" accept=".usdz" className="admin-file" />
        </div>
        <p className="text-footnote text-white/50 sm:col-span-2">
          بدون GLB، دکمه‌ی «مشاهده روی میز» برای این غذا نمایش داده نمی‌شود.
        </p>
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:col-span-2">
        {pending ? "در حال افزودن..." : "افزودن غذا"}
      </Button>
    </form>
  );
}
