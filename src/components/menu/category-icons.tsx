import {
  EggFried, Croissant, Cookie,
  Beef, Sandwich, UtensilsCrossed,
  Pizza, Soup, Drumstick, Flame,
  ChefHat, Salad,
  Coffee, CupSoda, Leaf, GlassWater, Milk, CakeSlice, IceCreamCone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryIconKey =
  | "eggs" | "fullBreakfast" | "pancake"
  | "burger" | "sandwich" | "mainCourse"
  | "steak" | "pizza" | "pasta" | "fried" | "grill"
  | "appetizer" | "salad" | "soup"
  | "hotCoffee" | "icedCoffee" | "tea" | "coldDrinks" | "shake" | "cake" | "dessert";

const ICONS: Record<CategoryIconKey, LucideIcon> = {
  eggs: EggFried,
  fullBreakfast: Croissant,
  pancake: Cookie,

  burger: Beef,
  sandwich: Sandwich,
  mainCourse: UtensilsCrossed,

  steak: Beef,
  pizza: Pizza,
  pasta: Soup,
  fried: Drumstick,
  grill: Flame,

  appetizer: ChefHat,
  salad: Salad,
  soup: Soup,

  hotCoffee: Coffee,
  icedCoffee: CupSoda,
  tea: Leaf,
  coldDrinks: GlassWater,
  shake: Milk,
  cake: CakeSlice,
  dessert: IceCreamCone,
};

export function CategoryIcon({ icon, className }: { icon: CategoryIconKey; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}