"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FormError } from "@/components/form-bits";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="menu-theme menu-green flex min-h-[100dvh] items-center justify-center px-4">
      <Card className="materialize w-full max-w-sm p-6">
        <form action={formAction} className="space-y-4">
          <h1 className="text-title text-gold-400">ورود به داشبورد رستوران</h1>
          <FormError message={state?.error} />
          <Field label="ایمیل">
            <Input name="email" type="email" required dir="ltr" />
          </Field>
          <Field label="رمز عبور">
            <Input name="password" type="password" required dir="ltr" />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "در حال ورود..." : "ورود"}
          </Button>
          <p className="text-caption text-center text-white/60">
            حساب ندارید؟{" "}
            <Link href="/register" className="text-gold-400 hover:underline">
              ثبت‌نام
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}
