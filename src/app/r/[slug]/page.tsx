import { notFound, redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";

// آدرسی که روی کد QR چاپ می‌شود (/r/<slug>) همان صفحه‌ی اول منو است.
export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  const exists = await Restaurant.exists({ slug });
  if (!exists) notFound();

  redirect("/");
}
