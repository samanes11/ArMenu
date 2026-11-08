// نمایش قیمت به تومان با جداکننده‌ی هزارگان فارسی
export function formatToman(amount: number) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-");
}

export function formatPrice(amount: number, unit = "تومان", grouped = true) {
  return `${amount.toLocaleString("fa-IR", { useGrouping: grouped })} ${unit}`;
}

export function currencyUnit(currency?: string) {
  return currency === "RIAL" ? "ریال" : "تومان";
}
