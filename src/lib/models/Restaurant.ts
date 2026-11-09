import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const restaurantSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    currency: { type: String, enum: ["TOMAN", "RIAL"], default: "TOMAN" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    themeColor: { type: String, default: "#ea580c" },
    accentColor: { type: String, default: "#e2bc3e" },
    bgTop: { type: String, default: "#12261a" },
    bgMid: { type: String, default: "#1a3a24" },
    bgBottom: { type: String, default: "#163220" },
    sidebarBg: { type: String, default: "#1f4a43" },
    cardBg: { type: String, default: "#2a2a2a" },
    lineColor: { type: String, default: "#333333" },
    mutedText: { type: String, default: "#9b9b9b" },
    menuBg: { type: String, default: "#000000" },
  },
  { timestamps: true }
);

export type RestaurantDoc = InferSchemaType<typeof restaurantSchema> & { _id: mongoose.Types.ObjectId };

export const Restaurant: Model<RestaurantDoc> =
  (mongoose.models.Restaurant as Model<RestaurantDoc>) || mongoose.model<RestaurantDoc>("Restaurant", restaurantSchema);
