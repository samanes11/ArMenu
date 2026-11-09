"use client";

import { useState } from "react";
import { DishCard, type DishCardData } from "./dish-card";
import { DishModal } from "./dish-modal";

export function DishGrid({
  dishes,
  unit,
}: {
  dishes: DishCardData[];
  unit: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className="mx-auto mt-9 grid max-w-[620px] grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-7 lg:max-w-[860px] lg:grid-cols-4">
        {dishes.map((dish, i) => (
          <div
            key={dish.id}
            className="rise-in"
            style={{ ["--delay" as string]: `${100 + Math.min(i, 10) * 35}ms` }}
          >
            <DishCard
              unit={unit}
              dish={dish}
              onOpen={() => {
                setIndex(i);
                setOpen(true);
              }}
            />
          </div>
        ))}
      </div>
      <DishModal
        dishes={dishes}
        unit={unit}
        open={open}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
