"use client";

import { useActionState } from "react";
import { updateDishAction } from "@/lib/actions/dish";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/form-bits";
import { DishFields, type DishFormData } from "../../dish-fields";

export function EditDishForm({ dish }: { dish: DishFormData }) {
  const [state, formAction, pending] = useActionState(updateDishAction, undefined);

  return (
    <Card className="p-5">
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <FormError message={state?.error} className="sm:col-span-2" />
        <DishFields dish={dish} />
        <Button type="submit" disabled={pending} className="w-full sm:col-span-2">
          {pending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </form>
    </Card>
  );
}
