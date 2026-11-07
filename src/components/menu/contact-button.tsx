"use client";

import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";

// دکمه‌ی طلایی «اطلاعات تماس» (پایین-چپ صفحه‌ی اول) + برگه‌ی نمایش تلفن و آدرس
export function ContactButton({ name, phone, address }: { name: string; phone: string; address: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pressable fixed bottom-14 left-0 z-20 flex items-center gap-2 rounded-r-full bg-[#c9a640] py-2.5 pl-4 pr-3.5 text-[15px] font-medium text-[#1d1700]"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.600 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.25c1.100.37 2.300.57 3.600.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.600 21 3 13.400 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.300.2 2.500.57 3.600a1 1 0 0 1-.25 1z" />
        </svg>
        اطلاعات تماس
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} ariaLabel="اطلاعات تماس">
        <div className="p-6 pb-9 text-right">
          <h2 className="mb-4 text-[18px] font-bold text-gold-400">{name}</h2>

          {phone && (
            <a href={`tel:${phone}`} className="pressable mb-3 flex items-center justify-between rounded-2xl border border-menu-line px-4 py-3">
              <span className="text-[14px] text-menu-muted">تلفن</span>
              <span dir="ltr" className="text-[16px] font-medium text-white">
                {phone}
              </span>
            </a>
          )}

          {address && (
            <div className="mb-3 rounded-2xl border border-menu-line px-4 py-3">
              <p className="mb-1 text-[14px] text-menu-muted">آدرس</p>
              <p className="text-[15px] leading-7 text-white">{address}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="pressable mt-2 w-full rounded-2xl bg-gold-400 py-3 text-[15px] font-bold text-black"
          >
            بستن
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
