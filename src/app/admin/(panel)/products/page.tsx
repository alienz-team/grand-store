import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { Lang, Translate } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";
import { deleteProduct, toggleProductActive } from "../../actions";
import { ConfirmButton } from "../confirm-button";

type Row = {
  id: string;
  title: string;
  price: number;
  sale: number | null;
  badge: string | null;
  stock: number;
  active: boolean;
  bestSeller: boolean;
  dealLive: boolean;
  category: string;
};

function Tags({ p, L }: { p: Row; L: Translate }) {
  if (!p.badge && !p.bestSeller && !p.dealLive) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
      {p.badge && <span className="rounded bg-saffron/15 px-1.5 text-gold">{p.badge}</span>}
      {p.bestSeller && <span className="rounded bg-steel px-1.5 text-haze">{L("الأكثر مبيعًا", "Best seller")}</span>}
      {p.dealLive && <span className="rounded bg-signal/15 px-1.5 text-danger">{L("عرض الأسبوع", "Deal of the week")}</span>}
    </div>
  );
}

function Price({ p, lang }: { p: Row; lang: Lang }) {
  return p.sale != null ? (
    <>
      <span className="text-danger">{formatPrice(p.sale, lang)}</span> <s className="text-dim">{formatPrice(p.price, lang)}</s>
    </>
  ) : (
    <>{formatPrice(p.price, lang)}</>
  );
}

const stockClass = (stock: number) => (stock === 0 ? "text-danger" : stock <= 3 ? "text-gold" : "");

function ActiveToggle({ p, L }: { p: Row; L: Translate }) {
  return (
    <form action={toggleProductActive}>
      <input type="hidden" name="id" value={p.id} />
      <button
        type="submit"
        className="min-h-8 rounded-full border border-steel px-3 py-0.5 text-xs hover:border-saffron"
        aria-label={p.active ? L(`إخفاء ${p.title} من المتجر`, `Hide ${p.title} from the store`) : L(`عرض ${p.title} في المتجر`, `Show ${p.title} in the store`)}
      >
        {p.active ? L("معروض", "Visible") : L("مخفي", "Hidden")}
      </button>
    </form>
  );
}

function RowActions({ p, L }: { p: Row; L: Translate }) {
  return (
    <div className="flex items-center justify-end gap-4">
      <Link href={`/admin/products/${p.id}`} className="py-1 text-gold hover:underline">
        {L("تعديل", "Edit")}
      </Link>
      <form action={deleteProduct}>
        <input type="hidden" name="id" value={p.id} />
        <ConfirmButton
          message={L(`حذف «${p.title}» نهائيًا؟ الطلبات السابقة تحتفظ باسم المنتج وسعره.`, `Delete “${p.title}” permanently? Past orders keep the product name and price.`)}
          className="py-1 text-haze hover:text-danger"
        >
          {L("حذف", "Delete")}
        </ConfirmButton>
      </form>
    </div>
  );
}

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const [{ saved }, { lang, L }] = await Promise.all([searchParams, getI18n()]);
  const now = new Date();
  const rows: Row[] = (
    await getDb().product.findMany({
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
    })
  ).map((p) => ({
    id: p.id,
    title: p.title,
    price: Number(p.price.toString()),
    sale: p.salePrice ? Number(p.salePrice.toString()) : null,
    badge: p.badge,
    stock: p.stock,
    active: p.active,
    bestSeller: p.bestSeller,
    dealLive: !!p.dealEndsAt && p.dealEndsAt > now,
    category: p.category.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-black sm:text-3xl">
          {L("المنتجات", "Products")} <span className="num text-lg text-dim">({rows.length})</span>
        </h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          {L("إضافة منتج", "Add product")}
        </Link>
      </div>
      {saved && (
        <p role="status" className="rounded-xl border border-mint/40 bg-mint/10 p-3 text-sm text-ok">
          {L("تم حفظ المنتج.", "Product saved.")}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-steel p-10 text-center text-haze">
          {L("لا توجد منتجات. ابدأ بإضافة أول منتج.", "No products yet. Start by adding your first product.")}
        </p>
      ) : (
        <>
          {/* Phones: one card per product */}
          <ul className="space-y-3 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className={`rounded-2xl border border-steel bg-slab p-4 text-sm ${p.active ? "" : "opacity-60"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-gold">
                      {p.title}
                    </Link>
                    <p className="text-xs text-haze">{p.category}</p>
                    <Tags p={p} L={L} />
                  </div>
                  <ActiveToggle p={p} L={L} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-steel pt-3">
                  <p className="num font-display">
                    <Price p={p} lang={lang} />
                  </p>
                  <p className="text-haze">
                    {L("المخزون:", "Stock:")} <span className={`num ${stockClass(p.stock)}`}>{p.stock}</span>
                  </p>
                </div>
                <div className="mt-2">
                  <RowActions p={p} L={L} />
                </div>
              </li>
            ))}
          </ul>

          {/* Tablets and up: table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-steel bg-slab md:block">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-steel text-start text-haze">
                <tr>
                  <th className="p-3 text-start font-medium">{L("المنتج", "Product")}</th>
                  <th className="p-3 text-start font-medium">{L("القسم", "Category")}</th>
                  <th className="p-3 text-start font-medium">{L("السعر", "Price")}</th>
                  <th className="p-3 text-start font-medium">{L("المخزون", "Stock")}</th>
                  <th className="p-3 text-start font-medium">{L("الحالة", "Status")}</th>
                  <th className="p-3 font-medium">
                    <span className="sr-only">{L("إجراءات", "Actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel">
                {rows.map((p) => (
                  <tr key={p.id} className={p.active ? "" : "opacity-60"}>
                    <td className="p-3">
                      <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-gold">
                        {p.title}
                      </Link>
                      <Tags p={p} L={L} />
                    </td>
                    <td className="p-3 text-haze">{p.category}</td>
                    <td className="num p-3 font-display">
                      <Price p={p} lang={lang} />
                    </td>
                    <td className={`num p-3 ${stockClass(p.stock)}`}>{p.stock}</td>
                    <td className="p-3">
                      <ActiveToggle p={p} L={L} />
                    </td>
                    <td className="p-3">
                      <RowActions p={p} L={L} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
