import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart";
import { Countdown } from "@/components/countdown";
import { CashIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { Badge, ProductVisual } from "@/components/product-bits";
import { ProductGrid } from "@/components/product-card";
import { formatPrice } from "@/lib/format";
import { getI18n } from "@/lib/i18n-server";
import { getProduct, getProducts } from "@/lib/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [product, { L }] = await Promise.all([params.then((p) => getProduct(p.id)), getI18n()]);
  return { title: product?.title ?? L("منتج غير موجود", "Product not found"), description: product?.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const [product, { lang, L }] = await Promise.all([params.then((p) => getProduct(p.id)), getI18n()]);
  if (!product) notFound();
  const related = (await getProducts({ categoryId: product.category.id, take: 5 })).filter((p) => p.id !== product.id).slice(0, 4);
  const onSale = product.finalPrice < product.price;
  const dealLive = product.dealEndsAt && new Date(product.dealEndsAt) > new Date();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label={L("مسار التصفح", "Breadcrumb")} className="mb-6 text-sm text-dim">
        <Link href="/" className="hover:text-gold">
          {L("الرئيسية", "Home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-gold">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="group relative aspect-square overflow-hidden rounded-3xl border border-steel">
          <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} size="hero" priority />
          {product.badge && (
            <div className="absolute top-4 start-4">
              <Badge label={product.badge} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <h1 className="font-display text-2xl font-black leading-tight sm:text-4xl">{product.title}</h1>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 font-display">
              <span className={`num text-3xl font-black sm:text-4xl ${onSale ? "text-danger" : "text-gold"}`}>{formatPrice(product.finalPrice, lang)}</span>
              {onSale && <s className="num text-xl text-dim">{formatPrice(product.price, lang)}</s>}
            </div>
            <p className={`mt-2 text-sm ${product.stock > 0 ? "text-ok" : "text-danger"}`}>
              {product.stock > 0
                ? product.stock <= 5
                  ? L(`متوفر — بقي ${product.stock} فقط`, `In stock — only ${product.stock} left`)
                  : L("متوفر", "In stock")
                : L("نفدت الكمية", "Sold out")}
            </p>
          </div>

          {product.description && <p className="max-w-prose text-base text-haze sm:text-lg">{product.description}</p>}

          {dealLive && product.dealEndsAt && (
            <div className="rounded-2xl border border-saffron/40 bg-slab p-4">
              <p className="mb-2 text-sm text-haze">{L("عرض الأسبوع ينتهي خلال", "Deal of the week ends in")}</p>
              <Countdown endsAt={product.dealEndsAt} />
            </div>
          )}

          <AddToCartButton product={product} variant="full" />

          <ul className="space-y-3 border-t border-steel pt-6 text-sm text-haze">
            <li className="flex items-center gap-3">
              <TruckIcon className="size-5 shrink-0 text-gold" /> {L("توصيل سريع داخل طرابلس وكافة المدن الليبية", "Fast delivery across Tripoli and all Libyan cities")}
            </li>
            <li className="flex items-center gap-3">
              <CashIcon className="size-5 shrink-0 text-gold" /> {L("الدفع عند الاستلام", "Cash on delivery")}
            </li>
            <li className="flex items-center gap-3">
              <ShieldIcon className="size-5 shrink-0 text-gold" /> {L("ضمان الجودة", "Quality guaranteed")}
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-20" aria-label={L("منتجات مشابهة", "Related products")}>
          <h2 className="mb-6 border-b border-steel pb-4 font-display text-2xl font-extrabold">{L("من نفس القسم", "More from this category")}</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
