"use client";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()}
      className="no-print pressable flex items-center gap-2 rounded-xl border border-gold-500 px-4 py-2.5 text-sm text-gold-400">
      <Printer size={16} /> چاپ
    </button>
  );
}