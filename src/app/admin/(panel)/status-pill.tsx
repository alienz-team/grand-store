const COLORS: Record<string, string> = {
  PENDING: "bg-saffron/15 text-gold",
  CONFIRMED: "bg-sky-400/15 text-sky-300 light:text-sky-700",
  SHIPPED: "bg-violet-400/15 text-violet-300 light:text-violet-700",
  DELIVERED: "bg-mint/15 text-ok",
  CANCELLED: "bg-signal/15 text-danger",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[status] ?? "bg-steel"}`}>{label}</span>;
}
