import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { HomeClassic } from "@/components/menu/home-classic";
import { HomeSplash } from "@/components/menu/home-splash";
import { Button } from "@/components/ui/button";

export default async function Home() {
  await connectDB();
  const restaurant = await Restaurant.findOne().lean();

  if (!restaurant) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-display text-brand-600">دیش‌آر 🍽️</h1>
        <p className="text-body text-neutral-600">هنوز منویی ثبت نشده است.</p>
        <Button asChild className="bg-brand-600 text-white hover:bg-brand-700">
          <Link href="/register">ساخت حساب مدیریت</Link>
        </Button>
      </main>
    );
  }

  const tagline =
    restaurant.description && restaurant.description.length <= 24
      ? restaurant.description
      : "";
  const hasContact = Boolean(restaurant.phone || restaurant.address);
  const logoUrl = restaurant.logoUrl || undefined;
  const phone = restaurant.phone || "";
  const address = restaurant.address || "";

  if (restaurant.homeTemplate === "splash") {
    return (
      <HomeSplash
        name={restaurant.name}
        logoUrl={logoUrl}
        phone={phone}
        address={address}
        hasContact={hasContact}
      />
    );
  }

  return (
    <HomeClassic
      name={restaurant.name}
      tagline={tagline}
      logoUrl={logoUrl}
      phone={phone}
      address={address}
      hasContact={hasContact}
    />
  );
}
