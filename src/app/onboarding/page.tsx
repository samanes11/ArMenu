"use client";

import { useActionState } from "react";
import { createRestaurantAction } from "@/lib/actions/restaurant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormError } from "@/components/form-bits";

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createRestaurantAction, undefined);

  return (
    <main className="menu-theme menu-green flex min-h-[100dvh] items-center justify-center px-4">
      <Card className="materialize w-full max-w-md p-6">
        <form action={formAction} className="space-y-4">
          <h1 className="text-title text-gold-400">رستوران خود را بسازید</h1>
          <p className="text-caption text-white/60">این اطلاعات روی منوی عمومی مشتریان نمایش داده می‌شود.</p>
          <FormError message={state?.error} />
          <Field label="نام رستوران">
            <Input name="name" required placeholder="مثلاً: رستوران سفره‌خانه" />
          </Field>
          <Field label="توضیح کوتاه">
            <Textarea name="description" rows={3} />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "در حال ساخت..." : "ادامه به داشبورد"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
