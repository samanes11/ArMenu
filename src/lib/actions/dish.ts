"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Dish } from "@/lib/models/Dish";
import { getSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";
import type { ActionState } from "@/lib/actions/auth";
import { findByCategory } from "@/lib/menu-sections";

export async function toggleDishAvailabilityAction(dishId: string) {
  const restaurantId = await requireRestaurant();
  await connectDB();
  const dish = await Dish.findOneAndUpdate(
    { _id: dishId, restaurantId },
    [{ $set: { available: { $not: "$available" } } }],
    { new: true },
  );
  revalidatePath("/dashboard");
  if (dish) {
    const found = findByCategory(dish.category);
    if (found)
      revalidatePath(
        `/menu/${found.section.key}/${encodeURIComponent(found.category.label)}`,
      );
  }
}

async function resolveAsset(
  formData: FormData,
  fileKey: string,
  urlKey: string,
  restaurantId: string,
): Promise<string | null> {
  const file = formData.get(fileKey) as File | null;
  if (file && file.size > 0) return saveUploadedFile(file, restaurantId);
  const url = String(formData.get(urlKey) || "").trim();
  return url && /^(https?:\/\/|\/)/i.test(url) ? url : null;
}

async function requireRestaurant() {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");
  return session.restaurantId as string;
}

const INVALID = { error: "نام غذا و قیمت معتبر (به تومان) الزامی است." };

export async function createDishAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const restaurantId = await requireRestaurant();
  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price") || 0);
  if (!name || !Number.isFinite(price) || price < 0) return INVALID;

  await connectDB();
  const [thumbnailUrl, modelUrlGlb, modelUrlUsdz] = await Promise.all([
    resolveAsset(formData, "thumbnail", "thumbnailUrl", restaurantId),
    resolveAsset(formData, "modelGlb", "modelUrlGlb", restaurantId),
    resolveAsset(formData, "modelUsdz", "modelUrlUsdz", restaurantId),
  ]);

  await Dish.create({
    restaurantId,
    name,
    nameEn: String(formData.get("nameEn") || "").trim(),
    description: String(formData.get("description") || ""),
    price,
    category: String(formData.get("category") || "سایر"),
    thumbnailUrl: thumbnailUrl ?? "",
    modelUrlGlb: modelUrlGlb ?? "",
    modelUrlUsdz: modelUrlUsdz ?? "",
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateDishAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const restaurantId = await requireRestaurant();
  const dishId = String(formData.get("dishId") || "");
  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price") || 0);
  if (!dishId || !name || !Number.isFinite(price) || price < 0) return INVALID;

  await connectDB();
  const dish = await Dish.findOne({ _id: dishId, restaurantId });
  if (!dish) return { error: "غذا پیدا نشد." };

  const [t, g, u] = await Promise.all([
    resolveAsset(formData, "thumbnail", "thumbnailUrl", restaurantId),
    resolveAsset(formData, "modelGlb", "modelUrlGlb", restaurantId),
    resolveAsset(formData, "modelUsdz", "modelUrlUsdz", restaurantId),
  ]);
  if (t !== null) dish.thumbnailUrl = t;
  if (g !== null) dish.modelUrlGlb = g;
  if (u !== null) dish.modelUrlUsdz = u;

  dish.name = name;
  dish.nameEn = String(formData.get("nameEn") || "").trim();
  dish.description = String(formData.get("description") || "");
  dish.price = price;
  dish.category = String(formData.get("category") || dish.category);
  await dish.save();

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteDishAction(dishId: string) {
  const restaurantId = await requireRestaurant();
  await connectDB();
  await Dish.deleteOne({ _id: dishId, restaurantId });
  revalidatePath("/dashboard");
}
