"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/button";
import { BottomSheet } from "@/components/menu/bottom-sheet";
import { DishForm } from "./dish-form";

export function AddDishButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={16} /> غذای جدید
      </Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="افزودن غذای جدید"
      >
        <div className="p-4 pb-8">
          <DishForm onDone={() => setOpen(false)} />
        </div>
      </BottomSheet>
    </>
  );
}
