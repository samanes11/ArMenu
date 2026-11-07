"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void | Promise<void>;
  label?: string;
}) {
  // Optimistic local value: the switch flips the instant it's touched
  // (respond on pointer-down, not on the server round-trip), and the
  // server call happens underneath without blocking input.
  const [value, setValue] = useState(checked);
  const [, startTransition] = useTransition();

  const toggle = () => {
    setValue((v) => !v);
    startTransition(() => {
      onChange();
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={toggle}
      className="pressable-subtle relative h-7 w-12 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        backgroundColor: value ? "#e2bc3e" : "rgba(255,255,255,0.2)",
        transition: "background-color 220ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <motion.span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-chip"
        animate={{ right: value ? 2 : 22 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
    </button>
  );
}
