"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "./bottom-sheet";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatPrice, formatPriceCompact } from "@/lib/format";

export type NoteItem = { id: string; name: string; price: number; qty: number; thumbnailUrl?: string };

type NoteContextValue = {
  items: NoteItem[];
  count: number;
  total: number;
  unit: string;
  qtyOf: (id: string) => number;
  add: (item: Omit<NoteItem, "qty">) => void;
  decrease: (id: string) => void;
  clear: () => void;
};

const NoteContext = createContext<NoteContextValue | null>(null);
const STORAGE_KEY = "dishar-note";

export function useNote() {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error("useNote must be used inside <NoteProvider>");
  return ctx;
}

export function NoteProvider({ unit, children }: { unit: string; children: React.ReactNode }) {
  const [items, setItems] = useState<NoteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((item: Omit<NoteItem, "qty">) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)) : [...prev, { ...item, qty: 1 }]
    );
  }, []);

  const decrease = useCallback((id: string) => {
    setItems((prev) => prev.flatMap((i) => (i.id !== id ? [i] : i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : [])));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<NoteContextValue>(
    () => ({
      items,
      unit,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      qtyOf: (id) => items.find((i) => i.id === id)?.qty ?? 0,
      add,
      decrease,
      clear,
    }),
    [items, unit, add, decrease, clear]
  );

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

const fa = (n: number) => n.toLocaleString("fa-IR");

export function NoteBar() {
  const { items, count, total, unit, add, decrease, clear } = useNote();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (count === 0) setOpen(false);
  }, [count]);

  return (
    <>
      {count > 0 && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full px-5 py-3 text-[14px] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.9)]"
        >
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-1.5 text-[12px] font-bold text-gold-400">{fa(count)}</span>
          یادداشت من
        </Button>
      )}

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            className="fixed inset-0 z-50 flex flex-col items-center gap-3 p-4 outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8"
          >
            <DialogPrimitive.Title className="sr-only">یادداشت من</DialogPrimitive.Title>

            <div className="flex min-h-0 w-full max-w-md flex-1 flex-col rounded-3xl border border-white/10 bg-black/45 p-3 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-[16px] font-bold text-gold-400">یادداشت من</h2>
                <button type="button" onClick={clear} className="pressable text-[12px] text-menu-muted">پاک کردن همه</button>
              </div>

              <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black">
                      {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt={item.name} width={56} height={56} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="truncate text-[15px] text-white">{item.name}</p>
                      <p className="text-[13px] text-white/80">{formatPriceCompact(item.price * item.qty, unit)}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/10 px-1">
                      <button type="button" aria-label="افزودن" onClick={() => add(item)} className="pressable h-8 w-8 text-[18px] text-white">+</button>
                      <span className="w-6 text-center text-[14px] font-medium text-white">{fa(item.qty)}</span>
                      <button type="button" aria-label="کم کردن" onClick={() => decrease(item.id)} className="pressable h-8 w-8 text-[18px] text-white">−</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#3d0000] px-4 py-3.5 text-[14px] font-medium text-white">
                <span>مبلغ کل:</span>
                <span>{formatPriceCompact(total, unit)}</span>
              </div>
            </div>

            <div className="flex w-full max-w-md justify-end px-2">
              <DialogPrimitive.Close className="pressable flex flex-col items-center gap-1.5 text-[13px] text-white">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4a0505]"><X size={22} /></span>
                بستن
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}