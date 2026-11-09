"use server";

import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export type ActionState = { error?: string; success?: boolean } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) || "");

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = str(formData, "name").trim();
  const email = str(formData, "email").trim().toLowerCase();
  const password = str(formData, "password");

  if (!name || !email || password.length < 6) return { error: "نام، ایمیل و رمز عبور (حداقل ۶ کاراکتر) الزامی است." };

  await connectDB();
  if (await User.exists({ email })) return { error: "این ایمیل قبلاً ثبت شده است." };

  const user = await User.create({ name, email, passwordHash: await hashPassword(password), restaurantId: null });
  await setSessionCookie({ userId: user._id.toString(), restaurantId: null, email: user.email });
  redirect("/onboarding");
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = str(formData, "email").trim().toLowerCase();
  const password = str(formData, "password");

  await connectDB();
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return { error: "ایمیل یا رمز عبور اشتباه است." };

  await setSessionCookie({
    userId: user._id.toString(),
    restaurantId: user.restaurantId ? user.restaurantId.toString() : null,
    email: user.email,
  });
  redirect(user.restaurantId ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
