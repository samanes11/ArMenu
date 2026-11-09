"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FormError } from "@/components/form-bits";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <main className="menu-theme menu-green flex min-h-[100dvh] items-center justify-center px-4">
      <Card className="materialize w-full max-w-sm p-6">
        <form action={formAction} className="space-y-4">
          <h1 className="text-title text-gold-400">ثبت‌نام صاحب رستوران</h1>
          <FormError message={state?.error} />
          <Field label="نام">
            <Input name="name" required />
          </Field>
          <Field label="ایمیل">
            <Input name="email" type="email" required dir="ltr" />
          </Field>
          <Field label="رمز عبور (حداقل ۶ کاراکتر)">
            <Input name="password" type="password" required minLength={6} dir="ltr" />
          </Field>
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
      </Card>
    </main>
  );
}
