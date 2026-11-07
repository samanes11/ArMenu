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

// قیمت به سبک منوی عمومی: «T ۲۸۸۰۰۰۰» (ارقام فارسی، بدون جداکننده‌ی هزارگان).
// unit: «T» برای تومان، «R» برای ریال. grouped=true برای جمع کل در یادداشت.
export function formatPrice(amount: number, unit = "T", grouped = false) {
  return `${unit} ${amount.toLocaleString("fa-IR", { useGrouping: grouped })}`;
}

export function currencyUnit(currency?: string) {
  return currency === "RIAL" ? "R" : "T";
}
