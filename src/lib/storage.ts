import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// ذخیره‌سازی ساده‌ی فایل روی دیسک محلی (public/uploads/<restaurantId>/...).
// برای دیپلوی روی Vercel/سرورهای بدون دیسک پایدار، این تابع را با
// آپلود به یک سرویس S3-سازگار (مثل Cloudflare R2 یا MinIO) جایگزین کنید؛
// امضای تابع (ورودی/خروجی) همان می‌ماند تا بقیه‌ی کد تغییر نکند.
export async function saveUploadedFile(file: File, restaurantId: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || "";
  const fileName = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", restaurantId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);
  return `/uploads/${restaurantId}/${fileName}`;
}
