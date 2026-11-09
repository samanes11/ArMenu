"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { User } from "@/lib/models/User";
import { getSession, setSessionCookie } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";
import { isValidHexColor, DEFAULT_THEME, THEME_FIELD_INFO, THEME_PRESETS, isPresetKey, type ThemeColors } from "@/lib/theme";
import type { ActionState } from "@/lib/actions/auth";

export async function createRestaurantAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "نام رستوران الزامی است." };

  await connectDB();
  const restaurant = await Restaurant.create({
    ownerId: session.userId,
    name,
    description: String(formData.get("description") || ""),
    currency: "TOMAN",
  });
  await User.findByIdAndUpdate(session.userId, { restaurantId: restaurant._id });
  await setSessionCookie({ userId: session.userId, restaurantId: restaurant._id.toString(), email: session.email });
  redirect("/dashboard");
}

export async function updateRestaurantAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");

  const themeColor = String(formData.get("themeColor") || "");
  if (themeColor && !isValidHexColor(themeColor)) return { error: "رنگ انتخاب‌شده معتبر نیست." };

  const currency = String(formData.get("currency") || "");
  if (currency && currency !== "TOMAN" && currency !== "RIAL") return { error: "واحد پول نامعتبر است." };

  await connectDB();
  const logo = formData.get("logo") as File | null;
  const logoUrl = logo && logo.size > 0 ? await saveUploadedFile(logo, session.restaurantId) : "";

  await Restaurant.findByIdAndUpdate(session.restaurantId, {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    phone: String(formData.get("phone") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    ...(logoUrl ? { logoUrl } : {}),
    ...(themeColor ? { themeColor } : {}),
    ...(currency ? { currency } : {}),
  });

  revalidatePath("/", "layout");
  return { error: undefined };
}

const THEME_FIELDS = Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[];

export async function updateThemeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");

  await connectDB();

  if (formData.get("resetTheme")) {
    await Restaurant.findByIdAndUpdate(session.restaurantId, { ...DEFAULT_THEME, themePreset: "green" });
    revalidatePath("/", "layout");
    return { error: undefined };
  }

  const update: Partial<ThemeColors> = {};
  for (const field of THEME_FIELDS) {
    const value = String(formData.get(field) || "");
    if (!value) continue;
    if (!isValidHexColor(value)) return { error: `رنگ «${THEME_FIELD_INFO[field].label}» معتبر نیست.` };
    update[field] = value;
  }

  await Restaurant.findByIdAndUpdate(session.restaurantId, update);
  revalidatePath("/", "layout");
  return { error: undefined };
}

export async function applyThemePresetAction(preset: string) {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");
  if (!isPresetKey(preset)) return;
  await connectDB();
  await Restaurant.findByIdAndUpdate(session.restaurantId, { ...THEME_PRESETS[preset].colors, themePreset: preset });
  revalidatePath("/", "layout");
}