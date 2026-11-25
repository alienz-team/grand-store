import type { Lang } from "./i18n";

const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatPrice(value: number, lang: Lang = "ar"): string {
  return `${nf.format(value)} ${lang === "en" ? "LYD" : "ل.د"}`;
}

export function discountPercent(price: number, salePrice: number | null): number | null {
  if (salePrice == null || salePrice >= price || price <= 0) return null;
  return Math.round(((price - salePrice) / price) * 100);
}

export const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = (typeof STATUSES)[number];

const STATUS_LABELS: Record<OrderStatus, [ar: string, en: string]> = {
  PENDING: ["قيد المراجعة", "Pending review"],
  CONFIRMED: ["مؤكد", "Confirmed"],
  SHIPPED: ["قيد التوصيل", "Out for delivery"],
  DELIVERED: ["تم التسليم", "Delivered"],
  CANCELLED: ["ملغي", "Cancelled"],
};

export function statusLabel(status: string, lang: Lang = "ar"): string {
  const pair = STATUS_LABELS[status as OrderStatus];
  return pair ? pair[lang === "en" ? 1 : 0] : status;
}
