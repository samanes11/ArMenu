import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Local disk storage. For Vercel/serverless swap with S3-compatible upload (same signature).
export async function saveUploadedFile(file: File, restaurantId: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = `${crypto.randomUUID()}${path.extname(file.name) || ""}`;
  const dir = path.join(process.cwd(), "public", "uploads", restaurantId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);
  return `/uploads/${restaurantId}/${fileName}`;
}
