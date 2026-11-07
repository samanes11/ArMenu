"use client";

import { useActionState } from "react";
import { updateRestaurantAction } from "@/lib/actions/restaurant";
import { Button } from "@/components/button";

export function SettingsForm({
  name,
  description,
  phone,
  address,
  logoUrl,
  slug,
}: {
  name: string;
  description: string;
  phone: string;
  address: string;
  logoUrl: string;
  slug: string;
}) {
  const [state, formAction, pending] = useActionState(updateRestaurantAction, undefined);

  return (
    <form action={formAction} className="materialize admin-card max-w-md space-y-4 p-6">
      <h1 className="text-title text-gold-400">تنظیمات رستوران</h1>

      {state?.error !== undefined && state.error && <p className="admin-error">{state.error}</p>}

      <div className="space-y-1.5">
        <label className="admin-label">نام رستوران</label>
        <input name="name" defaultValue={name} className="admin-input" />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">توضیح کوتاه</label>
        <textarea name="description" defaultValue={description} rows={3} className="admin-input" />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">تلفن (دکمه‌ی «اطلاعات تماس»)</label>
        <input name="phone" type="tel" dir="ltr" defaultValue={phone} className="admin-input" />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">آدرس</label>
        <textarea name="address" defaultValue={address} rows={2} className="admin-input" />
      </div>

      <div className="space-y-1.5">
        <label className="admin-label">لوگو (اختیاری؛ PNG شفاف با نوشته‌ی روشن/طلایی بهترین نتیجه را می‌دهد)</label>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="لوگوی فعلی" className="h-14 rounded-lg bg-black p-2" />
        )}
        <input name="logo" type="file" accept="image/*" className="admin-file" />
      </div>

      <p className="text-footnote text-white/45" dir="ltr">
        slug: /r/{slug} <span dir="rtl">(فعلاً از داشبورد قابل تغییر نیست)</span>
      </p>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "در حال ذخیره..." : "ذخیره"}
      </Button>
    </form>
  );
}
