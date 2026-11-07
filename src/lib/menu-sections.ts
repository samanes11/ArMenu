// ساختار ثابت منو: ۵ بخش (صبحانه، ناهار، شام، پیش غذا، کافه) که روی صفحه‌ی اول به‌شکل
// طاقی نمایش داده می‌شوند؛ هر بخش چند دسته‌بندی دارد که در نوار کناری صفحه‌ی منو می‌آید.
// برچسب (label) هر دسته‌بندی در کل منو یکتاست، چون در فیلد category هر غذا ذخیره می‌شود.
// این لیست هم در فرم افزودن غذا (داشبورد) و هم در صفحات عمومی منو استفاده می‌شود.

export type SectionKey = "breakfast" | "lunch" | "dinner" | "appetizer" | "cafe";

export type MenuCategory = {
  label: string;
  labelEn: string;
  icon: string; // ایموجی جایگزین، وقتی هنوز هیچ غذایی با تصویر در آن دسته نیست
};

export type MenuSectionDef = {
  key: SectionKey;
  label: string;
  categories: MenuCategory[];
};

// ترتیب منطقی: صبحانه ← کافه. در صفحه‌ی اول (چون راست‌به‌چپ است) از چپ به راست چیده می‌شود.
export const MENU_SECTIONS: MenuSectionDef[] = [
  {
    key: "breakfast",
    label: "صبحانه",
    categories: [
      { label: "املت و تخم‌مرغ", labelEn: "Eggs", icon: "🍳" },
      { label: "صبحانه کامل", labelEn: "Breakfast", icon: "🥞" },
      { label: "پنکیک و وافل", labelEn: "Pancake", icon: "🧇" },
    ],
  },
  {
    key: "lunch",
    label: "ناهار",
    categories: [
      { label: "برگر", labelEn: "Burger", icon: "🍔" },
      { label: "ساندویچ", labelEn: "Sandwich", icon: "🥪" },
      { label: "غذای اصلی", labelEn: "Main course", icon: "🍝" },
    ],
  },
  {
    key: "dinner",
    label: "شام",
    categories: [
      { label: "استیک", labelEn: "Steak", icon: "🥩" },
      { label: "پیتزا", labelEn: "pizza", icon: "🍕" },
      { label: "پاستا", labelEn: "Pasta", icon: "🍝" },
      { label: "سوخاری", labelEn: "Fried", icon: "🍗" },
      { label: "خوراک", labelEn: "Grill", icon: "🍲" },
    ],
  },
  {
    key: "appetizer",
    label: "پیش غذا",
    categories: [
      { label: "پیش‌غذا", labelEn: "Appetizer", icon: "🍟" },
      { label: "سالاد", labelEn: "Salad", icon: "🥗" },
      { label: "سوپ", labelEn: "Soup", icon: "🍜" },
    ],
  },
  {
    key: "cafe",
    label: "کافه",
    categories: [
      { label: "قهوه گرم", labelEn: "Hot coffee", icon: "☕" },
      { label: "قهوه سرد", labelEn: "Iced coffee", icon: "🧊" },
      { label: "چای و دمنوش", labelEn: "Tea", icon: "🍵" },
      { label: "نوشیدنی سرد", labelEn: "Cold drinks", icon: "🥤" },
      { label: "شیک و اسموتی", labelEn: "Shake", icon: "🍓" },
      { label: "شیرینی و کیک", labelEn: "Cake", icon: "🧁" },
      { label: "دسر", labelEn: "Dessert", icon: "🍰" },
    ],
  },
];

export function getSection(key: string): MenuSectionDef | undefined {
  return MENU_SECTIONS.find((s) => s.key === key);
}

export function getCategory(sectionKey: string, categoryLabel: string): MenuCategory | undefined {
  return getSection(sectionKey)?.categories.find((c) => c.label === categoryLabel);
}

// پیدا کردن بخش و دسته‌ی یک غذا از روی برچسب دسته‌اش (برای دکمه‌ی بازگشت در صفحه‌ی جزئیات غذا)
export function findByCategory(categoryLabel: string) {
  for (const section of MENU_SECTIONS) {
    const category = section.categories.find((c) => c.label === categoryLabel);
    if (category) return { section, category };
  }
  return undefined;
}
