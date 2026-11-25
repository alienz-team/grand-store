import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart";
import { SectionHeader, TrustBar } from "@/components/bars";
import { Countdown } from "@/components/countdown";
import { CategoryGlyph } from "@/components/icons";
import { Badge, ProductVisual } from "@/components/product-bits";
import { ProductGrid } from "@/components/product-card";
import { discountPercent, formatPrice } from "@/lib/format";
import { getCategories, getDealOfTheWeek, getProducts } from "@/lib/queries";

export default async function HomePage() {
  const [categories, bestSellers, latest, deal] = await Promise.all([
    getCategories(),
    getProducts({ bestSeller: true, take: 8 }),
    getProducts({ take: 8 }),
    getDealOfTheWeek(),
  ]);

  const hero = [...bestSellers].sort((a, b) => b.finalPrice - a.finalPrice)[0] ?? latest[0];
  const sections = [
    { key: "categories", show: categories.length > 0 },
    { key: "best", show: bestSellers.length > 0 },
    { key: "deal", show: !!deal },
    { key: "new", show: latest.length > 0 },
  ].filter((s) => s.show);
  const idx = (key: string) => String(sections.findIndex((s) => s.key === key) + 1).padStart(2, "0");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 60% at 20% 40%, rgb(255 182 39 / 0.10), transparent 70%)" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h1 className="font-display text-[clamp(2.6rem,8.2vw,6.4rem)] font-black leading-[1.15] tracking-tight">
              <span className="block">تســوق كـل ماتريـد</span>
              <span className="block text-haze">وانـت فـي مكــانـك</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-haze">
              أجهزة إلكترونية، ديكور، أدوات مطبخ وهدايا من طرابلس إلى باب بيتك. اطلب في دقيقة وادفع نقدًا عند الاستلام.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#best" className="btn btn-primary">
                تسوق الأكثر مبيعًا
              </Link>
              <Link href="#categories" className="btn btn-ghost">
                تصفح الأقسام
              </Link>
            </div>
          </div>

          {hero && (
            <article className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-saffron/50 via-steel to-steel" aria-hidden />
              <div className="relative overflow-hidden rounded-[27px] bg-slab">
                <Link href={`/product/${hero.id}`} className="block aspect-square">
                  <ProductVisual imageUrl={hero.imageUrl} title={hero.title} categorySlug={hero.category.slug} size="hero" />
                </Link>
                {hero.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge label={hero.badge} />
                  </div>
                )}
                <div className="flex items-end gap-4 border-t border-steel p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-dim">{hero.category.name}</p>
                    <h2 className="truncate font-display text-xl font-bold">
                      <Link href={`/product/${hero.id}`} className="hover:text-saffron">
                        {hero.title}
                      </Link>
                    </h2>
                    <p className="num mt-1 font-display text-3xl font-black text-saffron">{formatPrice(hero.finalPrice)}</p>
                  </div>
                  <AddToCartButton product={hero} />
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <TrustBar />

      <div className="mx-auto max-w-7xl space-y-20 px-4 pt-16 sm:px-6">
        {categories.length > 0 && (
          <section id="categories" aria-label="تسوق حسب القسم" className="scroll-mt-24">
            <SectionHeader index={idx("categories")} title="تسوق حسب القسم" />
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="group flex h-full flex-col justify-between gap-8 rounded-2xl border border-steel bg-slab p-5 transition-colors hover:border-saffron"
                  >
                    <CategoryGlyph slug={c.slug} className="size-14 text-haze transition-colors group-hover:text-saffron" />
                    <div>
                      <p className="font-display text-lg font-bold sm:text-xl">{c.name}</p>
                      <p className="num text-sm text-dim">{c.productCount} منتج</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {bestSellers.length > 0 && (
          <section id="best" className="scroll-mt-24" aria-label="الأكثر مبيعًا">
            <SectionHeader index={idx("best")} title="الأكثر مبيعًا" />
            <ProductGrid products={bestSellers} />
          </section>
        )}

        {deal && deal.dealEndsAt && (
          <section aria-label="عرض الأسبوع">
            <SectionHeader index={idx("deal")} title="عرض الأسبوع" />
            <div className="grid overflow-hidden rounded-3xl border border-saffron/40 bg-slab md:grid-cols-2">
              <Link href={`/product/${deal.id}`} className="block aspect-[4/3] md:aspect-auto">
                <ProductVisual imageUrl={deal.imageUrl} title={deal.title} categorySlug={deal.category.slug} size="hero" />
              </Link>
              <div className="flex flex-col justify-center gap-6 p-6 sm:p-10">
                <div>
                  <p className="text-sm text-haze">{deal.category.name}</p>
                  <h3 className="mt-1 font-display text-3xl font-black sm:text-4xl">{deal.title}</h3>
                  {deal.description && <p className="mt-3 max-w-md text-haze">{deal.description}</p>}
                </div>
                <div className="flex flex-wrap items-baseline gap-3 font-display">
                  <span className="num text-4xl font-black text-signal">{formatPrice(deal.finalPrice)}</span>
                  {deal.finalPrice < deal.price && (
                    <>
                      <s className="num text-xl text-dim">{formatPrice(deal.price)}</s>
                      <span className="rounded-full bg-signal px-3 py-1 text-sm font-bold text-white">
                        وفّر <span className="num">{discountPercent(deal.price, deal.salePrice)}%</span>
                      </span>
                    </>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm text-haze">ينتهي العرض خلال</p>
                  <Countdown endsAt={deal.dealEndsAt} />
                </div>
                <div>
                  <AddToCartButton product={deal} variant="full" />
                </div>
              </div>
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section aria-label="وصل حديثًا">
            <SectionHeader index={idx("new")} title="وصل حديثًا" />
            <ProductGrid products={latest} />
          </section>
        )}

        {categories.length === 0 && latest.length === 0 && (
          <p className="rounded-2xl border border-steel p-10 text-center text-haze">لا توجد منتجات بعد. أضف أقسامًا ومنتجات من لوحة التحكم.</p>
        )}
      </div>
    </>
  );
}
