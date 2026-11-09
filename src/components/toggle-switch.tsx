"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";

export function ToggleSwitch({
  checked,
  onChange,
  label,
  size = "md",
}: {
  checked: boolean;
  onChange: () => void | Promise<void>;
  label?: string;
  size?: "sm" | "md";
}) {
  const [value, setValue] = useState(checked);
  const [, startTransition] = useTransition();

  return (
    <Switch
      checked={value}
      aria-label={label}
      className={size === "sm" ? "h-[22px] w-10 [&>span]:h-[18px] [&>span]:w-[18px] [&>span]:data-[state=checked]:translate-x-[18px] rtl:[&>span]:data-[state=checked]:-translate-x-[18px]" : undefined}
      onCheckedChange={() => {
        setValue((v) => !v);
        startTransition(() => {
          onChange();
        });
      }}
    />
  );
}
