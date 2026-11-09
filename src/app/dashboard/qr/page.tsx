import QRCode from "qrcode";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrintButton } from "./print-button";

export default async function QrPage() {
  const session = await getSession();
  await connectDB();

  const restaurant = await Restaurant.findById(session!.restaurantId).select("name").lean();
  if (!restaurant) return null;

  const menuUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const qrDataUrl = await QRCode.toDataURL(menuUrl, { width: 480, margin: 2 });

  return (
    <Card className="print-sheet materialize mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
      <h2 className="text-display text-white">{restaurant.name}</h2>
      <h1 className="text-title text-gold-400">برای دیدن منو اسکن کنید</h1>
      <p className="no-print text-caption text-white/60">این کد را چاپ و روی میزها نصب کنید.</p>

      <div className="rounded-2xl bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrDataUrl} alt="QR کد منو" className="h-56 w-56" />
      </div>

      <p dir="ltr" className="text-caption text-white/45">{menuUrl}</p>

      <div className="no-print flex gap-3">
        <PrintButton />
        <Button asChild>
          <a href={qrDataUrl} download="qr-menu.png">دانلود تصویر QR</a>
        </Button>
      </div>
    </Card>
  );
}
