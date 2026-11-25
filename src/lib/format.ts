const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function formatPrice(value: number): string {
  return `${nf.format(value)} ل.د`;
}

export function discountPercent(price: number, salePrice: number | null): number | null {
  if (salePrice == null || salePrice >= price || price <= 0) return null;
  return Math.round(((price - salePrice) / price) * 100);
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "مؤكد",
  SHIPPED: "قيد التوصيل",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

export const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
