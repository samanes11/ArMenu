"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "./bottom-sheet";

export type NoteItem = { id: string; name: string; price: number; qty: number };

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

  if (count === 0) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full px-5 py-3 text-[14px] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.9)]"
      >
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-1.5 text-[12px] font-bold text-gold-400">{fa(count)}</span>
        یادداشت من
      </Button>

      <BottomSheet open={open} onClose={() => setOpen(false)} ariaLabel="یادداشت من">
        <div className="p-5 pb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-gold-400">یادداشت من</h2>
            <button type="button" onClick={clear} className="pressable text-[13px] text-menu-muted">
              پاک کردن همه
            </button>
          </div>

          <ul className="divide-y divide-menu-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] text-white">{item.name}</p>
                  <p className="text-[13px] text-menu-muted">
                    <span dir="ltr" className="inline-block">{formatPrice(item.price, unit, true)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-menu-line">
                  <Button variant="ghost" size="icon" aria-label="افزودن" onClick={() => add(item)} className="rounded-full text-[18px] text-gold-400">+</Button>
                  <span className="w-5 text-center text-[14px]">{fa(item.qty)}</span>
                  <Button variant="ghost" size="icon" aria-label="کم کردن" onClick={() => decrease(item.id)} className="rounded-full text-[18px] text-gold-400">−</Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-menu-line pt-4 text-[16px]">
            <span>جمع کل</span>
            <span dir="ltr" className="font-bold text-gold-400">{formatPrice(total, unit, true)}</span>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
