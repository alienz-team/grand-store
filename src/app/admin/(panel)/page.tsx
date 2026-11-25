import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice, statusLabel } from "@/lib/format";
import { getI18n } from "@/lib/i18n-server";
import { StatusPill } from "./status-pill";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default async function AdminHome() {
  await requireAdmin();
  const { lang, L } = await getI18n();
  const db = getDb();
  const weekAgo = new Date(Date.now() - WEEK_MS);
  const [pending, ordersCount, weekCount, revenue, products, lowStock, recent] = await Promise.all([
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: weekAgo } } }),
    db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    db.product.count({ where: { active: true } }),
    db.product.findMany({
      where: { active: true, stock: { lte: 3 } },
      select: { id: true, title: true, stock: true },
      orderBy: { stock: "asc" },
      take: 6,
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, number: true, customerName: true, city: true, total: true, status: true },
    }),
  ]);

  const stats = [
    { label: L("طلبات تنتظر المراجعة", "Orders awaiting review"), value: String(pending), href: "/admin/orders?status=PENDING", hot: pending > 0 },
    {
      label: L("طلبات آخر 7 أيام", "Orders in the last 7 days"),
      value: String(weekCount),
      note: L(`من أصل ${ordersCount} طلب`, `of ${ordersCount} total`),
      href: "/admin/orders",
    },
    {
      label: L("قيمة الطلبات (غير الملغاة)", "Order value (excl. cancelled)"),
      value: formatPrice(Number(revenue._sum.total?.toString() ?? 0), lang),
      href: "/admin/orders",
    },
    { label: L("منتجات معروضة", "Products on sale"), value: String(products), href: "/admin/products" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-black sm:text-3xl">{L("نظرة عامة", "Overview")}</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          {L("إضافة منتج", "Add product")}
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className={`flex h-full flex-col rounded-2xl border bg-slab p-4 transition-colors hover:border-saffron sm:p-5 ${s.hot ? "border-saffron/60" : "border-steel"}`}
            >
              <p className="text-xs text-haze sm:text-sm">{s.label}</p>
              <p className={`num mt-2 break-words font-display text-2xl font-black sm:text-3xl ${s.hot ? "text-gold" : ""}`}>{s.value}</p>
              {s.note && <p className="num mt-1 text-xs text-dim">{s.note}</p>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="min-w-0 rounded-2xl border border-steel bg-slab p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{L("أحدث الطلبات", "Latest orders")}</h2>
            <Link href="/admin/orders" className="py-1 text-sm text-gold hover:underline">
              {L("كل الطلبات", "All orders")}
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-haze">{L("لا توجد طلبات بعد.", "No orders yet.")}</p>
          ) : (
            <ul className="divide-y divide-steel">
              {recent.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
                  <span className="num w-14 text-dim" dir="ltr">
                    #{o.number}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {o.customerName} <span className="text-dim">— {o.city}</span>
                  </span>
                  <span className="num font-display">{formatPrice(Number(o.total.toString()), lang)}</span>
                  <StatusPill status={o.status} label={statusLabel(o.status, lang)} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="min-w-0 rounded-2xl border border-steel bg-slab p-4 sm:p-5">
          <h2 className="mb-3 font-display text-lg font-bold">{L("مخزون منخفض", "Low stock")}</h2>
          {lowStock.length === 0 ? (
            <p className="py-6 text-center text-haze">{L("كل المنتجات متوفرة بكميات كافية.", "All products are well stocked.")}</p>
          ) : (
            <ul className="divide-y divide-steel">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/admin/products/${p.id}`} className="truncate hover:text-gold">
                    {p.title}
                  </Link>
                  <span className={`num shrink-0 ${p.stock === 0 ? "text-danger" : "text-gold"}`}>{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
