import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart";
import { Badge, ProductVisual } from "./product-bits";

export function ProductCard({ product }: { product: ProductView }) {
  const onSale = product.finalPrice < product.price;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-steel bg-slab">
      <Link href={`/product/${product.id}`} className="block aspect-[4/5] focus-visible:outline-offset-[-2px]">
        <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} />
        <span className="sr-only">عرض {product.title}</span>
      </Link>
      {product.badge && (
        <div className="pointer-events-none absolute top-3 right-3">
          <Badge label={product.badge} />
        </div>
      )}
      {product.stock <= 0 && (
        <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-graphite/90 px-2.5 py-0.5 text-xs text-haze">
          نفدت الكمية
        </div>
      )}
      <div className="flex flex-1 items-end gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-dim">{product.category.name}</p>
          <h3 className="mt-0.5 truncate font-semibold leading-snug">
            <Link href={`/product/${product.id}`} className="hover:text-saffron">
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

export function ProductGrid({ products }: { products: ProductView[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
