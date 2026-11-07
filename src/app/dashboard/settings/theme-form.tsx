"use client";

import { useActionState, useState } from "react";
import { updateThemeAction } from "@/lib/actions/restaurant";
import { THEME_FIELD_INFO, type ThemeColors } from "@/lib/theme";
import { Button } from "@/components/button";

const FIELD_ORDER: (keyof ThemeColors)[] = [
  "accentColor",
  "bgTop",
  "bgMid",
  "bgBottom",
  "sidebarBg",
  "cardBg",
  "lineColor",
  "mutedText",
];

// یک ردیف رنگ: برچسب + توضیح کامل + انتخاب‌گر رنگ (چرخ‌دنده‌ی رنگ مرورگر) +
// فیلد متنی هگز برای وارد کردن دقیق کد رنگ. هر دو با هم هماهنگ می‌مانند.
function ColorField({
  name,
  label,
  description,
  defaultValue,
}: {
  name: string;
  label: string;
  description: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-1.5">
      <label className="admin-label font-medium text-white/90">{label}</label>
      <p className="text-footnote text-white/45">{description}</p>
      <div className="admin-color-row">
        <input
          type="color"
          aria-label={`${label} — انتخاب‌گر رنگ`}
          className="admin-color-swatch"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="text"
          name={name}
          dir="ltr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          pattern="^#[0-9a-fA-F]{6}$"
          className="admin-input"
        />
      </div>
    </div>
  );
}

export function ThemeForm({ theme }: { theme: ThemeColors }) {
  const [state, formAction, pending] = useActionState(updateThemeAction, undefined);

  return (
    <form
      action={formAction}
      className="materialize admin-card max-w-md space-y-4 p-6"
      style={{ ["--delay" as string]: "90ms" }}
    >
      <div>
        <h1 className="text-title text-gold-400">ظاهر و رنگ‌بندی</h1>
        <p className="text-footnote mt-1 text-white/45">
          هر رنگی که در منوی عمومی، صفحات ورود/ثبت‌نام و همین پنل مدیریت دیده می‌شود از این چند رنگ ساخته
          می‌شود. سایه‌های روشن‌تر و تیره‌تر لازم (مثل گرادیان طاقی‌های صفحه‌ی اول) به‌طور خودکار محاسبه می‌شوند.
        </p>
      </div>

      {state?.error !== undefined && state.error && <p className="admin-error">{state.error}</p>}

      {FIELD_ORDER.map((field) => (
        <ColorField
          key={field}
          name={field}
          label={THEME_FIELD_INFO[field].label}
          description={THEME_FIELD_INFO[field].description}
          defaultValue={theme[field]}
        />
      ))}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "در حال ذخیره..." : "ذخیره‌ی رنگ‌بندی"}
        </Button>
        <button
          type="submit"
          name="resetTheme"
          value="1"
          disabled={pending}
          className="pressable text-caption rounded-lg border border-menu-line px-3 py-2.5 font-medium text-white/70 hover:bg-white/5"
        >
          بازگردانی به پیش‌فرض
        </button>
      </div>
    </form>
  );
}
