"use client";

import { useActionState, useEffect } from "react";
import { createDishAction } from "@/lib/actions/dish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/form-bits";
import { DishFields } from "./dish-fields";

export function DishForm({ onDone }: { onDone?: () => void }) {
  const [state, formAction, pending] = useActionState(createDishAction, undefined);

  useEffect(() => {
    if (state?.success) onDone?.();
  }, [state, onDone]);

  return (
    <Card className="p-5">
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <FormError message={state?.error} className="sm:col-span-2" />
        <DishFields />
        <Button type="submit" disabled={pending} className="w-full sm:col-span-2">
          {pending ? "در حال افزودن..." : "افزودن غذا"}
        </Button>
      </form>
    </Card>
  );
}
