"use client";

import { useState, useTransition } from "react";
import { Check, Palette, Paintbrush } from "lucide-react";
import { applyThemePresetAction } from "@/lib/actions/restaurant";
import { THEME_PRESETS, type ThemeColors, type ThemePresetKey } from "@/lib/theme";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BottomSheet } from "@/components/menu/bottom-sheet";
import { ThemeForm } from "./theme-form";

export function PresetPicker({ active, theme }: { active: ThemePresetKey; theme: ThemeColors }) {
  const [value, setValue] = useState(active);
  const [pending, startTransition] = useTransition();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  return (
    <>
      <Card className="materialize w-full max-w-md p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400 text-black">
            <Palette size={22} />
          </span>
          <div>
            <h1 className="text-title text-gold-400">قالب رنگی</h1>
            <p className="text-footnote text-white/45">ظاهر کل سایت را انتخاب کنید</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(THEME_PRESETS) as ThemePresetKey[]).map((key) => {
            const { label, colors: c } = THEME_PRESETS[key];
            const selected = value === key;
            return (
              <button
                key={key}
                type="button"
                disabled={pending}
                onClick={() => {
                  setValue(key);
                  startTransition(() => {
                    applyThemePresetAction(key);
                  });
                }}
                className={cn(
                  "pressable relative flex flex-col items-center gap-3 rounded-2xl border p-4",
                  selected
                    ? "border-gold-400 bg-gold-400/10 shadow-[0_0_24px_-6px_var(--gold-400)]"
                    : "border-border bg-black/20 hover:border-gold-400/60",
                )}
              >
                <span
                  className="relative block h-[72px] w-[72px] rounded-[22px] border border-white/10 p-3"
                  style={{ background: `linear-gradient(160deg, ${c.bgTop}, ${c.bgBottom})` }}
                >
                  <span className="block h-2.5 w-full rounded-full" style={{ background: c.lineColor }} />
                  <span className="mt-1.5 block h-2.5 w-3/5 rounded-full" style={{ background: c.lineColor }} />
                  <span className="absolute bottom-2.5 end-2.5 h-3 w-3 rounded-full" style={{ background: c.accentColor }} />
                  {selected && (
                    <span className="absolute -bottom-1.5 -end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-black ring-2 ring-black">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className={cn("text-[14px] font-medium", selected ? "text-gold-400" : "text-white/75")}>
                  {label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCustomizeOpen(true)}
            className="pressable relative flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-black/20 p-4 hover:border-gold-400/60"
          >
            <span
              className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[22px] border border-white/10 p-3"
              style={{ background: "linear-gradient(160deg, #3a3a3a, #141414)" }}
            >
              <Paintbrush size={26} className="text-gold-400" strokeWidth={1.8} />
            </span>
            <span className="text-[14px] font-medium text-white/75">کاستومایز</span>
          </button>
        </div>
      </Card>

      <BottomSheet open={customizeOpen} onClose={() => setCustomizeOpen(false)} ariaLabel="ظاهر و رنگ‌بندی">
        <div className="p-4 pb-8">
          <ThemeForm theme={theme} />
        </div>
      </BottomSheet>
    </>
  );
}