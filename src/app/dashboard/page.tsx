import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Dish } from "@/lib/models/Dish";
import { DishList } from "./dish-list";
import { AddDishButton } from "./add-dish-button";

export default async function DashboardPage() {
  const session = await getSession();
  await connectDB();

  const dishes = await Dish.find({ restaurantId: session!.restaurantId })
    .select("name nameEn description price category thumbnailUrl available")
    .sort({ order: 1, createdAt: -1 })
    .lean();

  const serialized = dishes.map((d) => ({
    _id: d._id.toString(),
    name: d.name,
    nameEn: d.nameEn || "",
    description: d.description,
    price: d.price,
    category: d.category,
    thumbnailUrl: d.thumbnailUrl,
    available: d.available,
  }));

  return (
    <section className="rise-in space-y-4" style={{ ["--delay" as string]: "80ms" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-title text-white">منوی غذاها ({serialized.length})</h2>
        <AddDishButton />
      </div>
      <DishList dishes={serialized} />
    </section>
  );
}
