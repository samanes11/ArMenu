export function formatToman(amount: number) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export function formatPrice(amount: number, unit = "تومان", grouped = true) {
  return `${amount.toLocaleString("fa-IR", { useGrouping: grouped })} ${unit}`;
}

export function currencyUnit(currency?: string) {
  return currency === "RIAL" ? "ریال" : "تومان";
}

export function formatPriceCompact(amount: number, unit = "تومان") {
  const n = (v: number) =>
    v.toLocaleString("fa-IR", { maximumFractionDigits: 3 });
  if (amount >= 1_000_000) return `${n(amount / 1_000_000)} میلیون ${unit}`;
  if (amount >= 1_000) return `${n(amount / 1_000)} هزار ${unit}`;
  return `${n(amount)} ${unit}`;
}

export function formatPriceParts(amount: number, unit = "تومان") {
  const n = (v: number) =>
    v.toLocaleString("fa-IR", { maximumFractionDigits: 3 });
  if (amount >= 1_000_000)
    return { value: n(amount / 1_000_000), label: `میلیون ${unit}` };
  if (amount >= 1_000)
    return { value: n(amount / 1_000), label: `هزار ${unit}` };
  return { value: n(amount), label: unit };
}
