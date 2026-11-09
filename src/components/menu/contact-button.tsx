"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "./bottom-sheet";

export function ContactButton({ name, phone, address }: { name: string; phone: string; address: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pressable fixed bottom-14 left-0 z-20 flex items-center gap-2 rounded-r-full bg-[#c9a640] py-2.5 pl-4 pr-3.5 text-[15px] font-medium text-[#1d1700]"
      >
        <Phone size={17} fill="currentColor" aria-hidden="true" />
        اطلاعات تماس
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} ariaLabel="اطلاعات تماس">
        <div className="p-6 pb-9 text-right">
          <h2 className="mb-4 text-[18px] font-bold text-gold-400">{name}</h2>
          {phone && (
            <a href={`tel:${phone}`} className="pressable mb-3 flex items-center justify-between rounded-2xl border border-menu-line px-4 py-3">
              <span className="text-[14px] text-menu-muted">تلفن</span>
              <span dir="ltr" className="text-[16px] font-medium text-white">{phone}</span>
            </a>
          )}
          {address && (
            <div className="mb-3 rounded-2xl border border-menu-line px-4 py-3">
              <p className="mb-1 text-[14px] text-menu-muted">آدرس</p>
              <p className="text-[15px] leading-7 text-white">{address}</p>
            </div>
          )}
          <Button className="mt-2 w-full rounded-2xl py-3 text-[15px]" onClick={() => setOpen(false)}>
            بستن
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
