"use client";

import { useActionState, useState } from "react";
import { updateRestaurantAction } from "@/lib/actions/restaurant";
import { Button } from "@/components/button";
import { ToggleSwitch } from "@/components/toggle-switch";

export function SettingsForm({
  name,
  description,
  phone,
  address,
  logoUrl,
  currency,
}: {
  name: string;
  description: string;
  phone: string;
  address: string;
  logoUrl: string;
  currency: "TOMAN" | "RIAL";
}) {
  const [state, formAction, pending] = useActionState(
    updateRestaurantAction,
    undefined,
  );
  const [isRial, setIsRial] = useState(currency === "RIAL");

  return (
    <form
      action={formAction}
      className="materialize admin-card max-w-md space-y-4 p-6"
    >
      <h1 className="text-title text-gold-400">تنظیمات رستوران</h1>

      {state?.error !== undefined && state.error && (
        <p className="admin-error">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <label className="admin-label">نام رستوران</label>
        <input name="name" defaultValue={name} className="admin-input" />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">توضیح کوتاه</label>
        <textarea
          name="description"
          defaultValue={description}
          rows={3}
          className="admin-input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">تلفن (دکمه‌ی «اطلاعات تماس»)</label>
        <input
          name="phone"
          type="tel"
          dir="ltr"
          defaultValue={phone}
          className="admin-input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">آدرس</label>
        <textarea
          name="address"
          defaultValue={address}
          rows={2}
          className="admin-input"
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-menu-line p-3">
        <div className="min-w-0">
          <p className="admin-label font-medium text-white/90">
            واحد پول نمایشی
          </p>
          <p className="text-footnote text-white/45">
            قیمت غذاها روی منوی عمومی با این واحد نشان داده می‌شود.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-caption text-white/70">
            {isRial ? "ریال" : "تومان"}
          </span>
          <ToggleSwitch
            size="sm"
            checked={isRial}
            label="نمایش قیمت به ریال"
            onChange={() => setIsRial((v) => !v)}
          />
        </div>
      </div>
      <input type="hidden" name="currency" value={isRial ? "RIAL" : "TOMAN"} />

      <div className="space-y-1.5">
        <label className="admin-label">
          لوگو (اختیاری؛ PNG شفاف با نوشته‌ی روشن/طلایی بهترین نتیجه را می‌دهد)
        </label>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="لوگوی فعلی"
            className="h-14 rounded-lg bg-black p-2"
          />
        )}
        <input
          name="logo"
          type="file"
          accept="image/*"
          className="admin-file"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "در حال ذخیره..." : "ذخیره"}
      </Button>
    </form>
  );
}
