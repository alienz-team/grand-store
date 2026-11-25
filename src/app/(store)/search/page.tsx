import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-card";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = { title: "البحث" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const products = q ? await getProducts({ query: q }) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8 border-b border-steel pb-6">
        <h1 className="font-display text-3xl font-black sm:text-4xl">{q ? `نتائج البحث عن «${q}»` : "البحث"}</h1>
        {q && <p className="num mt-2 text-haze">{products.length} نتيجة</p>}
      </header>
      {!q ? (
        <p className="text-haze">اكتب اسم منتج أو قسم في خانة البحث أعلى الصفحة.</p>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-steel p-10 text-center text-haze">لا توجد منتجات تطابق «{q}». جرّب كلمة أقصر أو تصفح الأقسام.</p>
      )}
    </div>
  );
}
