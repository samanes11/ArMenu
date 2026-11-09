"use client";

import { useActionState, useState } from "react";
import { updateRestaurantAction } from "@/lib/actions/restaurant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormError } from "@/components/form-bits";
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
  const [state, formAction, pending] = useActionState(updateRestaurantAction, undefined);
  const [isRial, setIsRial] = useState(currency === "RIAL");

  return (
    <Card className="materialize w-full max-w-md p-6">
      <form action={formAction} className="space-y-4">
        <h1 className="text-title text-gold-400">تنظیمات رستوران</h1>
        <FormError message={state?.error} />

        <Field label="نام رستوران">
          <Input name="name" defaultValue={name} />
        </Field>
        <Field label="توضیح کوتاه">
          <Textarea name="description" defaultValue={description} rows={3} />
        </Field>
        <Field label="تلفن (دکمه‌ی «اطلاعات تماس»)">
          <Input name="phone" type="tel" dir="ltr" defaultValue={phone} />
        </Field>
        <Field label="آدرس">
          <Textarea name="address" defaultValue={address} rows={2} />
        </Field>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-white/90">واحد پول نمایشی</p>
            <p className="text-footnote text-white/45">قیمت غذاها روی منوی عمومی با این واحد نشان داده می‌شود.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-caption text-white/70">{isRial ? "ریال" : "تومان"}</span>
            <ToggleSwitch size="sm" checked={isRial} label="نمایش قیمت به ریال" onChange={() => setIsRial((v) => !v)} />
          </div>
        </div>
        <input type="hidden" name="currency" value={isRial ? "RIAL" : "TOMAN"} />

        <Field label="لوگو (اختیاری؛ PNG شفاف با نوشته‌ی روشن/طلایی بهترین نتیجه را می‌دهد)">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="لوگوی فعلی" className="h-14 rounded-lg bg-black p-2" />
          )}
          <Input name="logo" type="file" accept="image/*" />
        </Field>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </form>
    </Card>
  );
}
