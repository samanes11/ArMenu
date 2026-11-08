import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Dish } from "@/lib/models/Dish";
import { DishList } from "./dish-list";
import { DishForm } from "./dish-form";

export default async function DashboardPage() {
  const session = await getSession();
  await connectDB();

  const dishes = await Dish.find({ restaurantId: session!.restaurantId })
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
    <div className="space-y-10">
      <section className="rise-in">
        <h1 className="text-title mb-4 text-gold-400">افزودن غذای جدید</h1>
        <DishForm />
      </section>

      <section className="rise-in" style={{ ["--delay" as string]: "80ms" }}>
        <h2 className="text-title mb-4 text-gold-400">منوی غذاها ({serialized.length})</h2>
        <DishList dishes={serialized} />
      </section>
    </div>
  );
}
