"use server";

import { connectDB } from "@/lib/db";
import { MenuEvent } from "@/lib/models/MenuEvent";

export async function logMenuEvent(restaurantId: string, type: "scan" | "view", dishId?: string) {
  try {
    await connectDB();
    await MenuEvent.create({ restaurantId, dishId: dishId || null, type });
  } catch {
    // ثبت آمار نباید تجربه‌ی کاربر را مختل کند
  }
}
