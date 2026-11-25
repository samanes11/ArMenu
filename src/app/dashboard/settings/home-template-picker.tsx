"use client";

import { useState, useTransition } from "react";
import { Check, LayoutTemplate } from "lucide-react";
import { updateHomeTemplateAction } from "@/lib/actions/restaurant";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HomeTemplateKey = "classic" | "splash" | "petals";

function ClassicPreview() {
  const heights = [24, 32, 38, 32, 24];
  return (
    <svg viewBox="0 0 100 80" className="h-full w-full">
      <rect width="100" height="80" fill="#12261a" />
      <rect x="35" y="8" width="30" height="5" rx="2.5" fill="#e2bc3e" />
      {heights.map((h, i) => {
        const x = 14 + i * 15;
        const top = 66 - h;
        return (
          <path
            key={i}
            d={`M${x} 66V${top + 6}a6 6 0 0 1 12 0V66z`}
            fill="#e2bc3e"
          />
        );
      })}
    </svg>
  );
}

function SplashPreview() {
  const cards = [
    [12, 28, 36],
    [52, 28, 36],
    [12, 45, 36],
    [52, 45, 36],
    [32, 62, 36],
  ];
  return (
    <svg viewBox="0 0 100 80" className="h-full w-full">
      <rect width="100" height="80" fill="#12261a" />
      <circle
        cx="50"
        cy="14"
        r="6"
        fill="none"
        stroke="#c9a640"
        strokeWidth="1.2"
      />
      {cards.map(([x, y, w], i) => (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width={w}
            height="14"
            rx="4"
            fill="#0c2417"
            stroke="#c9a640"
            strokeWidth="1"
          />
          <rect
            x={x + 4}
            y={y + 9}
            width="14"
            height="2"
            rx="1"
            fill="#e3c766"
          />
        </g>
      ))}
    </svg>
  );
}

function PetalsPreview() {
  const cx = 50,
    cy = 47,
    R = 30;
  return (
    <svg viewBox="0 0 100 80" className="h-full w-full">
      <rect width="100" height="80" style={{ fill: "var(--bg-top)" }} />
      <rect
        x="34"
        y="6"
        width="32"
        height="4"
        rx="2"
        style={{ fill: "var(--gold-400)" }}
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const pts = [[cx, cy]];
        for (let k = 0; k <= 4; k++) {
          const a = ((-36 + (72 * k) / 4) * Math.PI) / 180;
          pts.push([cx + R * Math.sin(a), cy - R * Math.cos(a)]);
        }
        return (
          <polygon
            key={i}
            points={pts
              .map((p) => p.map((v) => v.toFixed(1)).join(","))
              .join(" ")}
            style={{
              fill: "var(--menu-card)",
              stroke: "var(--gold-400)",
              strokeWidth: 0.8,
            }}
            transform={`rotate(${i * 72} ${cx} ${cy}) translate(0 -1.8)`}
          />
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r="6.5"
        style={{
          fill: "var(--menu-bg)",
          stroke: "var(--gold-400)",
          strokeWidth: 1.2,
        }}
      />
    </svg>
  );
}

const TEMPLATES: {
  key: HomeTemplateKey;
  label: string;
  desc: string;
  Preview: () => React.JSX.Element;
}[] = [
  {
    key: "classic",
    label: "کلاسیک (طاقی‌ها)",
    desc: "صفحه‌ی اول فعلی با طاقی‌های سبز و لوگوی بالای صفحه",
    Preview: ClassicPreview,
  },
  {
    key: "splash",
    label: "اسپلش (کارت‌ها)",
    desc: "انیمیشن باز شدن لوگو + پس‌زمینه‌ی آیکون غذا + کارت‌های بخش‌ها",
    Preview: SplashPreview,
  },
  {
    key: "petals",
    label: "گلبرگ (چرخ منو)",
    desc: "بخش‌ها به شکل گلبرگ دور آیکون مرکزی، با انیمیشن شکفتن",
    Preview: PetalsPreview,
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

      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map(({ key, label, desc, Preview }) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              disabled={pending}
              onClick={() => {
                setValue(key);
                startTransition(() => {
                  updateHomeTemplateAction(key);
                });
              }}
              className={cn(
                "pressable relative flex flex-col items-stretch gap-2 rounded-2xl border p-3 text-right",
                selected
                  ? "border-gold-400 bg-gold-400/10 shadow-[0_0_24px_-6px_var(--gold-400)]"
                  : "border-border bg-black/20 hover:border-gold-400/60",
              )}
            >
              {selected && (
                <span className="absolute -top-2 -left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-black ring-2 ring-black">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
              <div className="aspect-[5/4] w-full overflow-hidden rounded-xl border border-white/10">
                <Preview />
              </div>
              <span
                className={cn(
                  "text-[14px] font-bold",
                  selected ? "text-gold-400" : "text-white/85",
                )}
              >
                {label}
              </span>
              <span className="text-[12px] leading-5 text-white/50">
                {desc}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
