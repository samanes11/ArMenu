import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { logoutAction } from "@/lib/actions/auth";
import { BottomNav } from "@/components/admin/bottom-nav";
import { LogOut } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");

  await connectDB();
  const restaurant = await Restaurant.findById(session.restaurantId).lean();
  if (!restaurant) redirect("/onboarding");

  return (
    <div className="menu-theme menu-green min-h-[100dvh]">
      <header className="sticky top-0 z-10 border-b border-black/30 bg-menu-teal/80 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-headline text-gold-400">{restaurant.name}</p>
            <p className="text-footnote text-white/50" dir="ltr">
              /r/{restaurant.slug}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="خروج"
              className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 hover:bg-gold-400/10"
            >
              <LogOut size={18} strokeWidth={1.8} />
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-36 pt-7">{children}</div>

      <BottomNav />
    </div>
  );
}