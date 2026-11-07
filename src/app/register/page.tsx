"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/button";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <main className="menu-theme menu-green flex min-h-[100dvh] items-center justify-center px-4">
      <form action={formAction} className="materialize admin-card w-full max-w-sm space-y-4 p-6">
        <h1 className="text-title text-gold-400">ثبت‌نام صاحب رستوران</h1>

        {state?.error && <p className="admin-error">{state.error}</p>}

        <div className="space-y-1.5">
          <label className="admin-label">نام</label>
          <input name="name" required className="admin-input" />
        </div>

        <div className="space-y-1.5">
          <label className="admin-label">ایمیل</label>
          <input name="email" type="email" required dir="ltr" className="admin-input" />
        </div>

        <div className="space-y-1.5">
          <label className="admin-label">رمز عبور (حداقل ۶ کاراکتر)</label>
          <input name="password" type="password" required minLength={6} dir="ltr" className="admin-input" />
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "در حال ساخت حساب..." : "ساخت حساب"}
        </Button>

        <p className="text-caption text-center text-white/60">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="text-gold-400 hover:underline">
            ورود
          </Link>
        </p>
      </form>
    </main>
  );
}
