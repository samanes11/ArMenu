import { redirect } from "next/navigation";
import { LogOut, UtensilsCrossed } from "lucide-react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { logoutAction } from "@/lib/actions/auth";
import { BottomNav } from "@/components/admin/bottom-nav";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");

  await connectDB();
  const restaurant = await Restaurant.findById(session.restaurantId).select("name").lean();
  if (!restaurant) redirect("/onboarding");

  return (
    <div className="menu-theme menu-green min-h-[100dvh]">
      <header className="sticky top-0 z-40 rounded-b-[24px] border-x border-b border-white/[0.06] bg-menu-teal/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-gold-400 bg-gold-400/10">
              <UtensilsCrossed size={20} strokeWidth={1.7} className="text-gold-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold tracking-tight text-gold-400">{restaurant.name}</p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.18em] text-white/40">RESTAURANT PANEL</p>
            </div>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="icon" aria-label="خروج از حساب" title="خروج از حساب" className="h-10 w-10 rounded-[14px] border border-white/[0.08] text-white/50 hover:text-red-400">
              <LogOut size={18} strokeWidth={1.8} />
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-36 pt-7">{children}</div>
      <BottomNav />
    </div>
  );
}
