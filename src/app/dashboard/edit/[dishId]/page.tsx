import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Dish } from "@/lib/models/Dish";
import { EditDishForm } from "./edit-dish-form";

export default async function EditDishPage({
  params,
}: {
  params: Promise<{ dishId: string }>;
}) {
  const { dishId } = await params;
  const session = await getSession();
  await connectDB();

  const dish = await Dish.findOne({
    _id: dishId,
    restaurantId: session!.restaurantId,
  }).lean();
  if (!dish) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-title text-gold-400">ویرایش غذا</h1>
      <EditDishForm
        dish={{
          _id: dish._id.toString(),
          name: dish.name,
          nameEn: dish.nameEn || "",
          description: dish.description || "",
          price: dish.price,
          category: dish.category,
          thumbnailUrl: dish.thumbnailUrl || "",
          modelUrlGlb: dish.modelUrlGlb || "",
          modelUrlUsdz: dish.modelUrlUsdz || "",
        }}
      />
    </div>
  );
}
