import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { logoutAction } from "@/lib/actions/auth";

const navLink = "pressable rounded-lg px-3 py-2 font-medium text-white/85 hover:bg-white/10 hover:text-gold-400";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");

  await connectDB();
  const restaurant = await Restaurant.findById(session.restaurantId).lean();
  if (!restaurant) redirect("/onboarding");

  return (
    <div className="menu-theme menu-green min-h-[100dvh]">
      <header className="sticky top-0 z-10 border-b border-black/30 bg-menu-teal shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <div>
            <p className="text-headline text-gold-400">{restaurant.name}</p>
            <p className="text-footnote text-white/50" dir="ltr">
              /r/{restaurant.slug}
            </p>
          </div>
          <nav className="text-caption flex flex-wrap items-center gap-1">
            <Link href="/dashboard" className={navLink}>
              غذاها
            </Link>
            <Link href="/dashboard/qr" className={navLink}>
              کد QR
            </Link>
            <Link href="/dashboard/settings" className={navLink}>
              تنظیمات
            </Link>
            <Link href="/" target="_blank" className={navLink}>
              منوی عمومی
            </Link>
            <form action={logoutAction}>
              <button className="pressable mr-1 rounded-lg border border-gold-500 px-3 py-1.5 font-medium text-gold-400 hover:bg-gold-400/10">
                خروج
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-7">{children}</div>
    </div>
  );
}
