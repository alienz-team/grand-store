const COLORS: Record<string, string> = {
  PENDING: "bg-saffron/15 text-saffron",
  CONFIRMED: "bg-sky-400/15 text-sky-300",
  SHIPPED: "bg-violet-400/15 text-violet-300",
  DELIVERED: "bg-mint/15 text-mint",
  CANCELLED: "bg-signal/15 text-signal",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[status] ?? "bg-steel"}`}>{label}</span>;
}
