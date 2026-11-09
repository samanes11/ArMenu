"use client";

import { useActionState, useState } from "react";
import { updateThemeAction } from "@/lib/actions/restaurant";
import { THEME_FIELD_INFO, type ThemeColors } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/form-bits";

const FIELD_ORDER = Object.keys(THEME_FIELD_INFO) as (keyof ThemeColors)[];

function ColorField({ name, label, description, defaultValue }: { name: string; label: string; description: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-1.5">
      <Label className="font-medium text-white/90">{label}</Label>
      <p className="text-footnote text-white/45">{description}</p>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          aria-label={`${label} — انتخاب‌گر رنگ`}
          className="h-11 w-11 shrink-0 cursor-pointer appearance-none rounded-md border border-input bg-transparent p-[3px] [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Input name={name} dir="ltr" value={value} onChange={(e) => setValue(e.target.value)} pattern="^#[0-9a-fA-F]{6}$" />
      </div>
    </div>
  );
}

export function ThemeForm({ theme }: { theme: ThemeColors }) {
  const [state, formAction, pending] = useActionState(updateThemeAction, undefined);

  return (
    <Card className="materialize w-full max-w-md p-6" style={{ ["--delay" as string]: "90ms" }}>
      <form action={formAction} className="space-y-4">
        <div>
          <h1 className="text-title text-gold-400">ظاهر و رنگ‌بندی</h1>
          <p className="text-footnote mt-1 text-white/45">
            هر رنگی که در منوی عمومی، صفحات ورود/ثبت‌نام و همین پنل مدیریت دیده می‌شود از این چند رنگ ساخته می‌شود. سایه‌های روشن‌تر و تیره‌تر لازم (مثل گرادیان طاقی‌های صفحه‌ی اول) به‌طور خودکار محاسبه می‌شوند.
          </p>
        </div>

        <FormError message={state?.error} />

        {FIELD_ORDER.map((field) => (
          <ColorField key={field} name={field} label={THEME_FIELD_INFO[field].label} description={THEME_FIELD_INFO[field].description} defaultValue={theme[field]} />
        ))}

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={pending} className="flex-1">
            {pending ? "در حال ذخیره..." : "ذخیره‌ی رنگ‌بندی"}
          </Button>
          <Button type="submit" name="resetTheme" value="1" variant="ghost" disabled={pending} className="border border-border py-2.5 text-[13px] text-white/70">
            بازگردانی به پیش‌فرض
          </Button>
        </div>
      </form>
    </Card>
  );
}
