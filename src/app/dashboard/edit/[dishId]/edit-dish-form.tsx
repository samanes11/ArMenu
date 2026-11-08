"use client";

import { useActionState } from "react";
import { updateDishAction } from "@/lib/actions/dish";
import { Button } from "@/components/button";
import { MENU_SECTIONS } from "@/lib/menu-sections";

const inputClass = "admin-input";

export function EditDishForm({
  dish,
}: {
  dish: {
    _id: string;
    name: string;
    nameEn: string;
    description: string;
    modelUrlGlb: string;
    modelUrlUsdz: string;
    price: number;
    category: string;
    thumbnailUrl: string;
  };
}) {
  const [state, formAction, pending] = useActionState(
    updateDishAction,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="admin-card grid gap-4 p-5 sm:grid-cols-2"
    >
      <input type="hidden" name="dishId" value={dish._id} />

      {state?.error && (
        <p className="admin-error sm:col-span-2">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <label className="admin-label">نام غذا</label>
        <input
          name="name"
          defaultValue={dish.name}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">نام انگلیسی (اختیاری)</label>
        <input
          name="nameEn"
          dir="ltr"
          defaultValue={dish.nameEn}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">قیمت (تومان)</label>
        <input
          name="price"
          type="number"
          min={0}
          step={1000}
          defaultValue={dish.price}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">دسته‌بندی</label>
        <select
          name="category"
          required
          defaultValue={dish.category}
          className={inputClass}
        >
          {MENU_SECTIONS.map((section) => (
            <optgroup key={section.key} label={section.label}>
              {section.categories.map((category) => (
                <option key={category.label} value={category.label}>
                  {category.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">
          تصویر بندانگشتی (برای تغییر، فایل جدید انتخاب کنید)
        </label>
        {dish.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.thumbnailUrl}
            alt={dish.name}
            className="h-16 w-16 rounded-lg bg-black object-cover"
          />
        )}
        <input
          name="thumbnail"
          type="file"
          accept="image/*"
          className="admin-file"
        />
      </div>

      <input
        name="thumbnailUrl"
        type="url"
        dir="ltr"
        defaultValue={dish.thumbnailUrl}
        placeholder="یا لینک تصویر"
        className={`${inputClass} mt-2`}
      />

      <div className="space-y-1.5 sm:col-span-2">
        <label className="admin-label">توضیحات</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={dish.description}
          className={inputClass}
        />
      </div>

      <div className="space-y-3 rounded-xl border border-gold-500/40 bg-gold-400/5 p-3 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
        <div className="space-y-1.5">
          <label className="admin-label">
            مدل سه‌بعدی (GLB) — برای تغییر، فایل جدید انتخاب کنید
          </label>
          <input
            name="modelGlb"
            type="file"
            accept=".glb"
            className="admin-file"
          />
        </div>

        <input
          name="modelUrlGlb"
          type="url"
          dir="ltr"
          defaultValue={dish.modelUrlGlb}
          placeholder="یا لینک GLB"
          className={`${inputClass} mt-2`}
        />
        <div className="space-y-1.5">
          <label className="admin-label">مدل سه‌بعدی (USDZ) — اختیاری</label>
          <input
            name="modelUsdz"
            type="file"
            accept=".usdz"
            className="admin-file"
          />
        </div>

        <input
          name="modelUrlUsdz"
          type="url"
          dir="ltr"
          defaultValue={dish.modelUrlUsdz}
          placeholder="یا لینک USDZ"
          className={`${inputClass} mt-2`}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:col-span-2">
        {pending ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
