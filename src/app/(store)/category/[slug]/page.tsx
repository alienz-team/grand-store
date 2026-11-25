import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card";
import { getCategoryBySlug, getProducts } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(decodeURIComponent((await params).slug));
  return { title: category?.name ?? "قسم غير موجود" };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(decodeURIComponent((await params).slug));
  if (!category) notFound();
  const products = await getProducts({ categoryId: category.id });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8 border-b border-steel pb-6">
        <h1 className="font-display text-4xl font-black sm:text-5xl">{category.name}</h1>
        <p className="num mt-2 text-haze">{products.length} منتج</p>
      </header>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-steel p-10 text-center text-haze">لا توجد منتجات في هذا القسم حاليًا. تابعنا قريبًا.</p>
      )}
    </div>
  );
}
