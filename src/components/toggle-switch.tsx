"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";

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

  const toggle = () => {
    setValue((v) => !v);
    startTransition(() => {
      onChange();
    });
  };

  // sm: ۴۰×۲۲ با دایره‌ی ۱۸؛ md: ۴۸×۲۸ با دایره‌ی ۲۴
  const small = size === "sm";
  const knob = small ? 18 : 24;
  const offset = 2;
  const travel = (small ? 40 : 48) - knob - offset;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={toggle}
      className={`pressable-subtle relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        small ? "h-[22px] w-10" : "h-7 w-12"
      }`}
      style={{
        backgroundColor: value ? "#e2bc3e" : "rgba(255,255,255,0.2)",
        transition: "background-color 220ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <motion.span
        className="absolute top-0.5 rounded-full bg-white shadow-chip"
        style={{ width: knob, height: knob }}
        animate={{ right: value ? offset : travel }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
    </button>
  );
}