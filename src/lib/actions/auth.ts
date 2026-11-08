"use server";

import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export type ActionState = { error?: string; success?: boolean } | undefined;

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 6) {
    return { error: "نام، ایمیل و رمز عبور (حداقل ۶ کاراکتر) الزامی است." };
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return { error: "این ایمیل قبلاً ثبت شده است." };
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, restaurantId: null });

  await setSessionCookie({
    userId: user._id.toString(),
    restaurantId: null,
    email: user.email,
  });

  redirect("/onboarding");
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) return { error: "ایمیل یا رمز عبور اشتباه است." };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: "ایمیل یا رمز عبور اشتباه است." };

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
