import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card";
import { getI18n } from "@/lib/i18n-server";
import { getCategoryBySlug, getProducts } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [category, { L }] = await Promise.all([params.then((p) => getCategoryBySlug(decodeURIComponent(p.slug))), getI18n()]);
  return { title: category?.name ?? L("قسم غير موجود", "Category not found") };
}

export default async function CategoryPage({ params }: Props) {
  const [category, { L }] = await Promise.all([params.then((p) => getCategoryBySlug(decodeURIComponent(p.slug))), getI18n()]);
  if (!category) notFound();
  const products = await getProducts({ categoryId: category.id });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-steel pb-6">
        <h1 className="font-display text-3xl font-black sm:text-5xl">{category.name}</h1>
        <p className="num mt-2 text-haze">
          {products.length} {L("منتج", products.length === 1 ? "product" : "products")}
        </p>
      </header>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-steel p-6 text-center text-haze sm:p-10">
          {L("لا توجد منتجات في هذا القسم حاليًا. تابعنا قريبًا.", "No products in this category yet. Check back soon.")}
        </p>
      )}
    </div>
  );
}
