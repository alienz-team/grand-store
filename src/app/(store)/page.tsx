import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart";
import { SectionHeader, TrustBar } from "@/components/bars";
import { Countdown } from "@/components/countdown";
import { FilterableGrid } from "@/components/filterable-grid";
import { HeroIntro, HeroShowcase, HeroTitle } from "@/components/hero";
import { CategoryGlyph } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProductVisual } from "@/components/product-bits";
import { ProductGrid } from "@/components/product-card";
import { discountPercent, formatPrice } from "@/lib/format";
import { imageSrcSet, sizedImage } from "@/lib/images";
import { getCategories, getDealOfTheWeek, getProducts } from "@/lib/queries";

export default async function HomePage() {
  const [categories, bestSellers, latest, deal] = await Promise.all([
    getCategories(),
    getProducts({ bestSeller: true, take: 8 }),
    getProducts({ take: 48 }),
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
          style={{ background: "radial-gradient(45% 60% at 18% 45%, rgb(255 182 39 / 0.10), transparent 70%)" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <HeroTitle />
            <HeroIntro>
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
            </HeroIntro>
          </div>
          {hero && <HeroShowcase product={hero} />}
        </div>
      </section>

      <TrustBar />

      <div className="mx-auto max-w-7xl space-y-24 px-4 pt-16 sm:px-6">
        {categories.length > 0 && (
          <section id="categories" aria-label="تسوق حسب القسم" className="scroll-mt-24">
            <SectionHeader index={idx("categories")} title="تسوق حسب القسم" />
            <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {categories.map((c) => (
                <StaggerItem as="li" key={c.id}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-steel bg-slab transition-[border-color,box-shadow] duration-300 hover:border-saffron/60 hover:shadow-[0_18px_48px_-16px_rgb(255_182_39/0.4)]"
                  >
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sizedImage(c.imageUrl, 640)}
                        srcSet={imageSrcSet(c.imageUrl, 960)}
                        sizes="(min-width: 1024px) 24vw, 48vw"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    ) : (
                      <CategoryGlyph slug={c.slug} className="absolute top-6 right-6 size-14 text-haze" />
                    )}
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/40 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-5">
                      <span>
                        <span className="block font-display text-lg font-bold sm:text-2xl">{c.name}</span>
                        <span className="num text-sm text-haze">{c.productCount} منتج</span>
                      </span>
                      <span
                        aria-hidden
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-mist/30 text-lg transition-colors group-hover:border-saffron group-hover:bg-saffron group-hover:text-graphite"
                      >
                        ‹
                      </span>
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
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
            <Reveal>
              <div className="group grid overflow-hidden rounded-3xl border border-saffron/40 bg-slab shadow-[0_30px_80px_-30px_rgb(255_182_39/0.35)] md:grid-cols-2">
                <Link href={`/product/${deal.id}`} className="relative block aspect-[4/3] md:aspect-auto md:min-h-[420px]" tabIndex={-1} aria-hidden>
                  <ProductVisual imageUrl={deal.imageUrl} title={deal.title} categorySlug={deal.category.slug} size="hero" />
                </Link>
                <div className="flex flex-col justify-center gap-6 p-6 sm:p-10">
                  <div>
                    <p className="text-sm text-haze">{deal.category.name}</p>
                    <h3 className="mt-1 font-display text-3xl font-black sm:text-4xl">
                      <Link href={`/product/${deal.id}`} className="hover:text-saffron">
                        {deal.title}
                      </Link>
                    </h3>
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
            </Reveal>
          </section>
        )}

        {latest.length > 0 && (
          <section aria-label="وصل حديثًا">
            <SectionHeader index={idx("new")} title="وصل حديثًا" />
            <Reveal>
              <FilterableGrid products={latest} categories={categories.map(({ name, slug }) => ({ name, slug }))} />
            </Reveal>
          </section>
        )}

        {categories.length === 0 && latest.length === 0 && (
          <p className="rounded-2xl border border-steel p-10 text-center text-haze">لا توجد منتجات بعد. أضف أقسامًا ومنتجات من لوحة التحكم.</p>
        )}
      </div>
    </>
  );
}
