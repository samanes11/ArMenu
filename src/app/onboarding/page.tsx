"use client";

import { useActionState } from "react";
import { createRestaurantAction } from "@/lib/actions/restaurant";
import { Button } from "@/components/button";

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createRestaurantAction, undefined);

  return (
    <main className="menu-theme menu-green flex min-h-[100dvh] items-center justify-center px-4">
      <form action={formAction} className="materialize admin-card w-full max-w-md space-y-4 p-6">
        <h1 className="text-title text-gold-400">رستوران خود را بسازید</h1>
        <p className="text-caption text-white/60">این اطلاعات روی منوی عمومی مشتریان نمایش داده می‌شود.</p>

        {state?.error && <p className="admin-error">{state.error}</p>}

        <div className="space-y-1.5">
          <label className="admin-label">نام رستوران</label>
          <input name="name" required className="admin-input" placeholder="مثلاً: رستوران سفره‌خانه" />
        </div>

        <div className="space-y-1.5">
          <label className="admin-label">توضیح کوتاه</label>
          <textarea name="description" className="admin-input" rows={3} />
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "در حال ساخت..." : "ادامه به داشبورد"}
        </Button>
      </form>
    </main>
  );
}
