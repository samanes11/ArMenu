"use client";

import { useState, useTransition } from "react";
import { Check, LayoutTemplate } from "lucide-react";
import { updateHomeTemplateAction } from "@/lib/actions/restaurant";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HomeTemplateKey = "classic" | "splash";

const TEMPLATES: { key: HomeTemplateKey; label: string; desc: string }[] = [
  {
    key: "classic",
    label: "کلاسیک (طاقی‌ها)",
    desc: "صفحه‌ی اول فعلی با طاقی‌های سبز و لوگوی بالای صفحه",
  },
  {
    key: "splash",
    label: "اسپلش (کارت‌ها)",
    desc: "انیمیشن باز شدن لوگو + پس‌زمینه‌ی آیکون غذا + کارت‌های بخش‌ها",
  },
];

export function HomeTemplatePicker({ active }: { active: HomeTemplateKey }) {
  const [value, setValue] = useState(active);
  const [pending, startTransition] = useTransition();

  return (
    <Card className="materialize w-full max-w-md p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400 text-black">
          <LayoutTemplate size={22} />
        </span>
        <div>
          <h1 className="text-title text-gold-400">قالب صفحه‌ی اول</h1>
          <p className="text-footnote text-white/45">
            ظاهر صفحه‌ی خانه‌ی منوی عمومی را انتخاب کنید
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TEMPLATES.map((t) => {
          const selected = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              disabled={pending}
              onClick={() => {
                setValue(t.key);
                startTransition(() => {
                  updateHomeTemplateAction(t.key);
                });
              }}
              className={cn(
                "pressable relative flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-right",
                selected
                  ? "border-gold-400 bg-gold-400/10 shadow-[0_0_24px_-6px_var(--gold-400)]"
                  : "border-border bg-black/20 hover:border-gold-400/60",
              )}
            >
              {selected && (
                <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-black ring-2 ring-black">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
              <span
                className={cn(
                  "text-[14px] font-bold",
                  selected ? "text-gold-400" : "text-white/85",
                )}
              >
                {t.label}
              </span>
              <span className="text-[12px] leading-5 text-white/50">
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
