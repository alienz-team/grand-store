import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart";
import { Stagger, StaggerItem } from "./motion";
import { Badge, ProductVisual } from "./product-bits";
import { QuickViewButton } from "./quick-view";

export function ProductCard({ product }: { product: ProductView }) {
  const onSale = product.finalPrice < product.price;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-steel bg-slab transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-saffron/60 hover:shadow-[0_0_0_1px_rgb(255_182_39/0.25),0_18px_48px_-16px_rgb(255_182_39/0.35)]">
      <Link href={`/product/${product.id}`} className="block aspect-[4/5] focus-visible:outline-offset-[-2px]" tabIndex={-1} aria-hidden>
        <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} />
      </Link>
      {product.badge && (
        <div className="pointer-events-none absolute top-3 right-3">
          <Badge label={product.badge} />
        </div>
      )}
      <div className="absolute top-3 left-3 flex flex-col items-end gap-2">
        {product.stock <= 0 && <span className="rounded-full bg-graphite/90 px-2.5 py-0.5 text-xs text-haze">نفدت الكمية</span>}
        <QuickViewButton product={product} />
      </div>
      <div className="flex flex-1 items-end gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-dim">{product.category.name}</p>
          <h3 className="mt-0.5 truncate font-semibold leading-snug">
            <Link href={`/product/${product.id}`} className="transition-colors hover:text-saffron">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-baseline gap-2 font-display">
            <span className={`num text-lg font-bold ${onSale ? "text-signal" : "text-mist"}`}>{formatPrice(product.finalPrice)}</span>
            {onSale && <s className="num text-sm text-dim">{formatPrice(product.price)}</s>}
          </p>
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

/** Product grid whose cards fade up and scale in, staggered, the first time it scrolls into view. */
export function ProductGrid({ products }: { products: ProductView[] }) {
  return (
    <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <StaggerItem as="li" key={p.id}>
          <ProductCard product={p} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
