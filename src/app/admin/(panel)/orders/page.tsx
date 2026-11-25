import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice, STATUS_LABELS, STATUSES } from "@/lib/format";
import { updateOrderStatus } from "../../actions";
import { StatusPill } from "../status-pill";
import { StatusSelect } from "./status-select";

const dateFmt = new Intl.DateTimeFormat("ar-LY-u-nu-latn", {
  timeZone: "Africa/Tripoli",
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
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

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black">الطلبات</h1>

      <nav aria-label="تصفية حسب الحالة" className="flex flex-wrap gap-2">
        {[{ key: undefined, label: "الكل", n: all }, ...STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], n: countOf(s) }))].map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
            aria-current={filter === t.key ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-sm ${filter === t.key ? "border-saffron text-saffron" : "border-steel text-haze hover:text-mist"}`}
          >
            {t.label} <span className="num text-dim">{t.n}</span>
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-steel p-10 text-center text-haze">لا توجد طلبات {filter ? "بهذه الحالة" : "بعد"}.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-steel bg-slab p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="num font-display font-bold text-saffron" dir="ltr">
                      #{o.number}
                    </span>
                    <span className="font-semibold">{o.customerName}</span>
                    <StatusPill status={o.status} label={STATUS_LABELS[o.status]} />
                  </p>
                  <p className="text-sm text-haze">
                    {o.city} — الهاتف:{" "}
                    <a href={`tel:${o.phone}`} className="ltr num text-mist hover:text-saffron">
                      {o.phone}
                    </a>
                  </p>
                  <p className="text-sm text-haze">العنوان: {o.address}</p>
                  {o.notes && <p className="text-sm text-haze">ملاحظات: {o.notes}</p>}
                  <p className="num text-xs text-dim">{dateFmt.format(o.createdAt)}</p>
                </div>
                <form action={updateOrderStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <label htmlFor={`status-${o.id}`} className="sr-only">
                    حالة الطلب #{o.number}
                  </label>
                  <StatusSelect id={`status-${o.id}`} defaultValue={o.status} />
                </form>
              </div>
              <ul className="mt-4 divide-y divide-steel border-t border-steel text-sm">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-4 py-2">
                    <span>
                      {i.title} <span className="num text-dim">× {i.quantity}</span>
                    </span>
                    <span className="num font-display">{formatPrice(Number(i.unitPrice.toString()) * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex justify-between border-t border-steel pt-3">
                <span className="text-haze">المجموع</span>
                <span className="num font-display text-lg font-extrabold">{formatPrice(Number(o.total.toString()))}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
