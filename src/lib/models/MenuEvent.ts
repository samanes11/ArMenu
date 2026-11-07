import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const menuEventSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    dishId: { type: Schema.Types.ObjectId, ref: "Dish", default: null },
    type: { type: String, enum: ["scan", "view"], required: true },
  },
  { timestamps: true }
);

export type MenuEventDoc = InferSchemaType<typeof menuEventSchema> & { _id: mongoose.Types.ObjectId };

export const MenuEvent: Model<MenuEventDoc> =
  (mongoose.models.MenuEvent as Model<MenuEventDoc>) || mongoose.model<MenuEventDoc>("MenuEvent", menuEventSchema);
