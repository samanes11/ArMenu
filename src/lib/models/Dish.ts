import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const dishSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    nameEn: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "سایر" },
    thumbnailUrl: { type: String, default: "" },
    blurDataUrl: { type: String, default: "" },
    modelUrlGlb: { type: String, default: "" },
    modelUrlUsdz: { type: String, default: "" },
    order: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type DishDoc = InferSchemaType<typeof dishSchema> & { _id: mongoose.Types.ObjectId };

export const Dish: Model<DishDoc> = (mongoose.models.Dish as Model<DishDoc>) || mongoose.model<DishDoc>("Dish", dishSchema);
