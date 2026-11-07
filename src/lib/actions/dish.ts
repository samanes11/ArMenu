"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Dish } from "@/lib/models/Dish";
import { getSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";
import type { ActionState } from "@/lib/actions/auth";

async function requireRestaurant() {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");
  return session!.restaurantId as string;
}

export async function createDishAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const restaurantId = await requireRestaurant();

  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price") || 0);
  if (!name || !Number.isFinite(price) || price < 0) {
    return { error: "نام غذا و قیمت معتبر (به تومان) الزامی است." };
  }

  await connectDB();

  const thumbnail = formData.get("thumbnail") as File | null;
  const glb = formData.get("modelGlb") as File | null;
  const usdz = formData.get("modelUsdz") as File | null;

  const thumbnailUrl = thumbnail && thumbnail.size > 0 ? await saveUploadedFile(thumbnail, restaurantId) : "";
  const modelUrlGlb = glb && glb.size > 0 ? await saveUploadedFile(glb, restaurantId) : "";
  const modelUrlUsdz = usdz && usdz.size > 0 ? await saveUploadedFile(usdz, restaurantId) : "";

  await Dish.create({
    restaurantId,
    name,
    nameEn: String(formData.get("nameEn") || "").trim(),
    description: String(formData.get("description") || ""),
    price,
    category: String(formData.get("category") || "سایر"),
    thumbnailUrl,
    modelUrlGlb,
    modelUrlUsdz,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function toggleDishAvailabilityAction(dishId: string) {
  const restaurantId = await requireRestaurant();
  await connectDB();
  const dish = await Dish.findOne({ _id: dishId, restaurantId });
  if (!dish) return;
  dish.available = !dish.available;
  await dish.save();
  revalidatePath("/dashboard");
}

export async function deleteDishAction(dishId: string) {
  const restaurantId = await requireRestaurant();
  await connectDB();
  await Dish.deleteOne({ _id: dishId, restaurantId });
  revalidatePath("/dashboard");
}
