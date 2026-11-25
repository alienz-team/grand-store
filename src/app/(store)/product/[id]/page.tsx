import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart";
import { Countdown } from "@/components/countdown";
import { CashIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { Badge, ProductVisual } from "@/components/product-bits";
import { ProductGrid } from "@/components/product-card";
import { formatPrice } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return { title: product?.title ?? "منتج غير موجود", description: product?.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  const related = (await getProducts({ categoryId: product.category.id, take: 5 })).filter((p) => p.id !== product.id).slice(0, 4);
  const onSale = product.finalPrice < product.price;
  const dealLive = product.dealEndsAt && new Date(product.dealEndsAt) > new Date();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="مسار التصفح" className="mb-6 text-sm text-dim">
        <Link href="/" className="hover:text-saffron">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-saffron">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-steel">
          <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} size="hero" />
          {product.badge && (
            <div className="absolute top-4 right-4">
              <Badge label={product.badge} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl">{product.title}</h1>
            <div className="mt-4 flex items-baseline gap-3 font-display">
              <span className={`num text-4xl font-black ${onSale ? "text-signal" : "text-saffron"}`}>{formatPrice(product.finalPrice)}</span>
              {onSale && <s className="num text-xl text-dim">{formatPrice(product.price)}</s>}
            </div>
            <p className={`mt-2 text-sm ${product.stock > 0 ? "text-mint" : "text-signal"}`}>
              {product.stock > 0 ? (product.stock <= 5 ? `متوفر — بقي ${product.stock} فقط` : "متوفر") : "نفدت الكمية"}
            </p>
          </div>

          {product.description && <p className="max-w-prose text-lg text-haze">{product.description}</p>}

          {dealLive && product.dealEndsAt && (
            <div className="rounded-2xl border border-saffron/40 bg-slab p-4">
              <p className="mb-2 text-sm text-haze">عرض الأسبوع ينتهي خلال</p>
              <Countdown endsAt={product.dealEndsAt} />
            </div>
          )}

          <AddToCartButton product={product} variant="full" />

          <ul className="space-y-3 border-t border-steel pt-6 text-sm text-haze">
            <li className="flex items-center gap-3">
              <TruckIcon className="size-5 text-saffron" /> توصيل سريع داخل طرابلس وكافة المدن الليبية
            </li>
            <li className="flex items-center gap-3">
              <CashIcon className="size-5 text-saffron" /> الدفع عند الاستلام
            </li>
            <li className="flex items-center gap-3">
              <ShieldIcon className="size-5 text-saffron" /> ضمان الجودة
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-label="منتجات مشابهة">
          <h2 className="mb-6 border-b border-steel pb-4 font-display text-2xl font-extrabold">من نفس القسم</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
