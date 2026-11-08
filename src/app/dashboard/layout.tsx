import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { logoutAction } from "@/lib/actions/auth";
import { BottomNav } from "@/components/admin/bottom-nav";
import { LogOut, UtensilsCrossed } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.restaurantId) redirect("/login");

  await connectDB();
  const restaurant = await Restaurant.findById(session.restaurantId).lean();
  if (!restaurant) redirect("/onboarding");

  return (
    <div className="menu-theme menu-green min-h-[100dvh]">
      <header className="sticky top-0 z-50 rounded-b-[24px] border-b border-x border-white/[0.06] bg-menu-teal/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">

          {/* Restaurant Identity */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-gold-400/20 bg-gold-400/[0.08] shadow-inner">
              <UtensilsCrossed
                size={20}
                strokeWidth={1.7}
                className="text-gold-400"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold tracking-tight text-gold-400">
                {restaurant.name}
              </p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.18em] text-white/40">
                RESTAURANT PANEL
              </p>
            </div>
          </div>

          {/* Logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="خروج از حساب"
              title="خروج از حساب"
              className="group flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/[0.08] bg-white/[0.03] text-white/50 transition-all duration-200 hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-400 active:scale-95"
            >
              <LogOut
                size={18}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-36 pt-7">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}