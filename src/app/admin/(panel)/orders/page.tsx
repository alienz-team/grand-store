import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice, statusLabel, STATUSES } from "@/lib/format";
import { getI18n } from "@/lib/i18n-server";
import { updateOrderStatus } from "../../actions";
import { StatusPill } from "../status-pill";
import { StatusSelect } from "./status-select";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const [{ status }, { lang, L }] = await Promise.all([searchParams, getI18n()]);
  const filter = STATUSES.find((s) => s === status);
  const db = getDb();
  const [orders, counts] = await Promise.all([
    db.order.findMany({
      where: filter ? { status: filter } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: { select: { id: true, title: true, unitPrice: true, quantity: true } } },
    }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const all = counts.reduce((n, c) => n + c._count._all, 0);
  const dateFmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB", {
    timeZone: "Africa/Tripoli",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const tabs = [
    { key: undefined, label: L("الكل", "All"), n: all },
    ...STATUSES.map((s) => ({ key: s, label: statusLabel(s, lang), n: countOf(s) })),
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-black sm:text-3xl">{L("الطلبات", "Orders")}</h1>

      <nav aria-label={L("تصفية حسب الحالة", "Filter by status")} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
            aria-current={filter === t.key ? "page" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${filter === t.key ? "border-saffron text-gold" : "border-steel text-haze hover:text-mist"}`}
          >
            {t.label} <span className="num text-dim">{t.n}</span>
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-steel p-10 text-center text-haze">
          {filter ? L("لا توجد طلبات بهذه الحالة.", "No orders with this status.") : L("لا توجد طلبات بعد.", "No orders yet.")}
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-steel bg-slab p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="num font-display font-bold text-gold" dir="ltr">
                      #{o.number}
                    </span>
                    <span className="font-semibold">{o.customerName}</span>
                    <StatusPill status={o.status} label={statusLabel(o.status, lang)} />
                  </p>
                  <p className="text-sm text-haze">
                    {o.city} — {L("الهاتف:", "Phone:")}{" "}
                    <a href={`tel:${o.phone}`} className="ltr num text-mist hover:text-gold">
                      {o.phone}
                    </a>
                  </p>
                  <p className="break-words text-sm text-haze">
                    {L("العنوان:", "Address:")} {o.address}
                  </p>
                  {o.notes && (
                    <p className="break-words text-sm text-haze">
                      {L("ملاحظات:", "Notes:")} {o.notes}
                    </p>
                  )}
                  <p className="num text-xs text-dim">{dateFmt.format(o.createdAt)}</p>
                </div>
                <form action={updateOrderStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <label htmlFor={`status-${o.id}`} className="sr-only">
                    {L(`حالة الطلب #${o.number}`, `Status of order #${o.number}`)}
                  </label>
                  <StatusSelect id={`status-${o.id}`} defaultValue={o.status} />
                </form>
              </div>
              <ul className="mt-4 divide-y divide-steel border-t border-steel text-sm">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-4 py-2">
                    <span className="min-w-0">
                      {i.title} <span className="num text-dim">× {i.quantity}</span>
                    </span>
                    <span className="num shrink-0 font-display">{formatPrice(Number(i.unitPrice.toString()) * i.quantity, lang)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex justify-between border-t border-steel pt-3">
                <span className="text-haze">{L("المجموع", "Total")}</span>
                <span className="num font-display text-lg font-extrabold">{formatPrice(Number(o.total.toString()), lang)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
