import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Restaurant } from "@/lib/models/Restaurant";
import { DEFAULT_THEME, type ThemeColors } from "@/lib/theme";
import { SettingsForm } from "./settings-form";
import { ThemeForm } from "./theme-form";

export default async function SettingsPage() {
  const session = await getSession();
  await connectDB();
  const restaurant = await Restaurant.findById(session!.restaurantId).lean();
  if (!restaurant) return null;

  const theme = { ...DEFAULT_THEME } as ThemeColors;
  for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeColors)[]) {
    const value = (restaurant as unknown as Record<string, string | undefined>)[key];
    if (value) theme[key] = value;
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <SettingsForm
        name={restaurant.name}
        description={restaurant.description}
        phone={restaurant.phone || ""}
        address={restaurant.address || ""}
        logoUrl={restaurant.logoUrl || ""}
        slug={restaurant.slug}
      />
      <ThemeForm theme={theme} />
    </div>
  );
}
