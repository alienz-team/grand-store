import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice, STATUS_LABELS } from "@/lib/format";
import { StatusPill } from "./status-pill";

export default async function AdminHome() {
  await requireAdmin();
  const db = getDb();
  const [pending, ordersCount, revenue, products, lowStock, recent] = await Promise.all([
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count(),
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
    { label: "طلبات تنتظر المراجعة", value: String(pending), href: "/admin/orders?status=PENDING", hot: pending > 0 },
    { label: "كل الطلبات", value: String(ordersCount), href: "/admin/orders" },
    { label: "قيمة الطلبات (غير الملغاة)", value: formatPrice(Number(revenue._sum.total?.toString() ?? 0)), href: "/admin/orders" },
    { label: "منتجات معروضة", value: String(products), href: "/admin/products" },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl font-black">نظرة عامة</h1>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className={`block rounded-2xl border bg-slab p-5 hover:border-saffron ${s.hot ? "border-saffron/60" : "border-steel"}`}>
              <p className="text-sm text-haze">{s.label}</p>
              <p className={`num mt-2 font-display text-3xl font-black ${s.hot ? "text-saffron" : ""}`}>{s.value}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-steel bg-slab p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">أحدث الطلبات</h2>
            <Link href="/admin/orders" className="text-sm text-saffron hover:underline">
              كل الطلبات
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-haze">لا توجد طلبات بعد.</p>
          ) : (
            <ul className="divide-y divide-steel">
              {recent.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 py-3">
                  <span className="num w-14 text-dim" dir="ltr">
                    #{o.number}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {o.customerName} <span className="text-dim">— {o.city}</span>
                  </span>
                  <span className="num font-display">{formatPrice(Number(o.total.toString()))}</span>
                  <StatusPill status={o.status} label={STATUS_LABELS[o.status]} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-steel bg-slab p-5">
          <h2 className="mb-3 font-display text-lg font-bold">مخزون منخفض</h2>
          {lowStock.length === 0 ? (
            <p className="py-6 text-center text-haze">كل المنتجات متوفرة بكميات كافية.</p>
          ) : (
            <ul className="divide-y divide-steel">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/admin/products/${p.id}`} className="truncate hover:text-saffron">
                    {p.title}
                  </Link>
                  <span className={`num shrink-0 ${p.stock === 0 ? "text-signal" : "text-saffron"}`}>{p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
