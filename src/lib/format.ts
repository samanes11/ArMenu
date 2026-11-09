export function formatToman(amount: number) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export function formatPrice(amount: number, unit = "تومان", grouped = true) {
  return `${amount.toLocaleString("fa-IR", { useGrouping: grouped })} ${unit}`;
}

export function currencyUnit(currency?: string) {
  return currency === "RIAL" ? "ریال" : "تومان";
}
