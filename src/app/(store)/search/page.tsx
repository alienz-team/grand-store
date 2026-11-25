import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-card";
import { getI18n } from "@/lib/i18n-server";
import { getProducts } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { L } = await getI18n();
  return { title: L("البحث", "Search"), robots: { index: false } };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q: raw }, { L }] = await Promise.all([searchParams, getI18n()]);
  const q = (raw ?? "").trim().slice(0, 80);
  const products = q ? await getProducts({ query: q }) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-steel pb-6">
        <h1 className="break-words font-display text-3xl font-black sm:text-4xl">
          {q ? L(`نتائج البحث عن «${q}»`, `Results for “${q}”`) : L("البحث", "Search")}
        </h1>
        {q && (
          <p className="num mt-2 text-haze">
            {products.length} {L("نتيجة", products.length === 1 ? "result" : "results")}
          </p>
        )}
      </header>
      {!q ? (
        <p className="text-haze">{L("اكتب اسم منتج أو قسم في خانة البحث أعلى الصفحة.", "Type a product or category name in the search box at the top of the page.")}</p>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="break-words rounded-2xl border border-steel p-6 text-center text-haze sm:p-10">
          {L(`لا توجد منتجات تطابق «${q}». جرّب كلمة أقصر أو تصفح الأقسام.`, `No products match “${q}”. Try a shorter word or browse the categories.`)}
        </p>
      )}
    </div>
  );
}
