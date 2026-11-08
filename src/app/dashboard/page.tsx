import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Dish } from "@/lib/models/Dish";
import { MenuEvent } from "@/lib/models/MenuEvent";
import { DishList } from "./dish-list";
import { AddDishButton } from "./add-dish-button";

export default async function DashboardPage() {
  const session = await getSession();
  await connectDB();

  const rid = new mongoose.Types.ObjectId(session!.restaurantId as string);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 86400000);

  const [dishes, scansToday, scansWeek, viewsWeek, topRaw] = await Promise.all([
    Dish.find({ restaurantId: rid }).sort({ order: 1, createdAt: -1 }).lean(),
    MenuEvent.countDocuments({
      restaurantId: rid,
      type: "scan",
      createdAt: { $gte: startOfDay },
    }),
    MenuEvent.countDocuments({
      restaurantId: rid,
      type: "scan",
      createdAt: { $gte: weekAgo },
    }),
    MenuEvent.countDocuments({
      restaurantId: rid,
      type: "view",
      createdAt: { $gte: weekAgo },
    }),
    MenuEvent.aggregate<{ _id: mongoose.Types.ObjectId; n: number }>([
      {
        $match: {
          restaurantId: rid,
          type: "view",
          dishId: { $ne: null },
          createdAt: { $gte: weekAgo },
        },
      },
      { $group: { _id: "$dishId", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const names = new Map(dishes.map((d) => [d._id.toString(), d.name]));
  const top = topRaw
    .filter((t) => names.has(t._id.toString()))
    .map((t) => ({ name: names.get(t._id.toString())!, n: t.n }));

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
    <div className="space-y-8">
      <section className="rise-in" style={{ ["--delay" as string]: "80ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title text-white">
            منوی غذاها ({serialized.length})
          </h2>
          <AddDishButton />
        </div>
        <DishList dishes={serialized} />
      </section>
    </div>
  );
}
