
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";

export const getRestaurant = cache(async () => {
  await connectDB();
  return Restaurant.findOne().lean();
});
