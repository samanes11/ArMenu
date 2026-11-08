
import type { CategoryIconKey } from "@/components/menu/category-icons";

export type SectionKey = "breakfast" | "lunch" | "dinner" | "appetizer" | "cafe";

export type MenuCategory = {
  label: string;
  labelEn: string;
  icon: CategoryIconKey;
};

export type MenuSectionDef = {
  key: SectionKey;
  label: string;
  categories: MenuCategory[];
};

export const MENU_SECTIONS: MenuSectionDef[] = [
  {
    key: "breakfast",
    label: "صبحانه",
    categories: [
      { label: "املت و تخم‌مرغ", labelEn: "Eggs", icon: "eggs" },
      { label: "صبحانه کامل", labelEn: "Breakfast", icon: "fullBreakfast" },
      { label: "پنکیک و وافل", labelEn: "Pancake", icon: "pancake" },
    ],
  },
  {
    key: "lunch",
    label: "ناهار",
    categories: [
      { label: "برگر", labelEn: "Burger", icon: "burger" },
      { label: "ساندویچ", labelEn: "Sandwich", icon: "sandwich" },
      { label: "غذای اصلی", labelEn: "Main course", icon: "mainCourse" },
    ],
  },
  {
    key: "dinner",
    label: "شام",
    categories: [
      { label: "استیک", labelEn: "Steak", icon: "steak" },
      { label: "پیتزا", labelEn: "pizza", icon: "pizza" },
      { label: "پاستا", labelEn: "Pasta", icon: "pasta" },
      { label: "سوخاری", labelEn: "Fried", icon: "fried" },
      { label: "خوراک", labelEn: "Grill", icon: "grill" },
    ],
  },
  {
    key: "appetizer",
    label: "پیش غذا",
    categories: [
      { label: "پیش‌غذا", labelEn: "Appetizer", icon: "appetizer" },
      { label: "سالاد", labelEn: "Salad", icon: "salad" },
      { label: "سوپ", labelEn: "Soup", icon: "soup" },
    ],
  },
  {
    key: "cafe",
    label: "کافه",
    categories: [
      { label: "قهوه گرم", labelEn: "Hot coffee", icon: "hotCoffee" },
      { label: "قهوه سرد", labelEn: "Iced coffee", icon: "icedCoffee" },
      { label: "چای و دمنوش", labelEn: "Tea", icon: "tea" },
      { label: "نوشیدنی سرد", labelEn: "Cold drinks", icon: "coldDrinks" },
      { label: "شیک و اسموتی", labelEn: "Shake", icon: "shake" },
      { label: "شیرینی و کیک", labelEn: "Cake", icon: "cake" },
      { label: "دسر", labelEn: "Dessert", icon: "dessert" },
    ],
  },
];

export function getSection(key: string): MenuSectionDef | undefined {
  return MENU_SECTIONS.find((s) => s.key === key);
}

export function getCategory(sectionKey: string, categoryLabel: string): MenuCategory | undefined {
  return getSection(sectionKey)?.categories.find((c) => c.label === categoryLabel);
}

export function findByCategory(categoryLabel: string) {
  for (const section of MENU_SECTIONS) {
    const category = section.categories.find((c) => c.label === categoryLabel);
    if (category) return { section, category };
  }
  return undefined;
}
