import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteProduct, toggleProductActive } from "../../actions";
import { ConfirmButton } from "../confirm-button";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const products = await getDb().product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      salePrice: true,
      badge: true,
      stock: true,
      active: true,
      bestSeller: true,
      dealEndsAt: true,
      category: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-black">
          المنتجات <span className="num text-lg text-dim">({products.length})</span>
        </h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          إضافة منتج
        </Link>
      </div>
      {saved && (
        <p role="status" className="rounded-xl border border-mint/40 bg-mint/10 p-3 text-sm text-mint">
          تم حفظ المنتج.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-steel bg-slab">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-steel text-right text-haze">
            <tr>
              <th className="p-3 font-medium">المنتج</th>
              <th className="p-3 font-medium">القسم</th>
              <th className="p-3 font-medium">السعر</th>
              <th className="p-3 font-medium">المخزون</th>
              <th className="p-3 font-medium">الحالة</th>
              <th className="p-3 font-medium">
                <span className="sr-only">إجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel">
            {products.map((p) => {
              const price = Number(p.price.toString());
              const sale = p.salePrice ? Number(p.salePrice.toString()) : null;
              return (
                <tr key={p.id} className={p.active ? "" : "opacity-60"}>
                  <td className="p-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-saffron">
                      {p.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                      {p.badge && <span className="rounded bg-saffron/15 px-1.5 text-saffron">{p.badge}</span>}
                      {p.bestSeller && <span className="rounded bg-steel px-1.5 text-haze">الأكثر مبيعًا</span>}
                      {p.dealEndsAt && p.dealEndsAt > new Date() && <span className="rounded bg-signal/15 px-1.5 text-signal">عرض الأسبوع</span>}
                    </div>
                  </td>
                  <td className="p-3 text-haze">{p.category.name}</td>
                  <td className="num p-3 font-display">
                    {sale != null ? (
                      <>
                        <span className="text-signal">{formatPrice(sale)}</span> <s className="text-dim">{formatPrice(price)}</s>
                      </>
                    ) : (
                      formatPrice(price)
                    )}
                  </td>
                  <td className={`num p-3 ${p.stock === 0 ? "text-signal" : p.stock <= 3 ? "text-saffron" : ""}`}>{p.stock}</td>
                  <td className="p-3">
                    <form action={toggleProductActive}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="rounded-full border border-steel px-2.5 py-0.5 text-xs hover:border-saffron">
                        {p.active ? "معروض" : "مخفي"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/products/${p.id}`} className="text-saffron hover:underline">
                        تعديل
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message={`حذف «${p.title}» نهائيًا؟ الطلبات السابقة تحتفظ باسم المنتج وسعره.`} className="text-haze hover:text-signal">
                          حذف
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-haze">
                  لا توجد منتجات. ابدأ بإضافة أول منتج.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
