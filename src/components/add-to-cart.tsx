"use client";

import { useCart } from "./cart";
import { PlusIcon } from "./icons";

type Props = {
  product: { id: string; title: string; finalPrice: number; imageUrl: string | null; stock: number; category: { slug: string } };
  variant?: "icon" | "full";
};

export function AddToCartButton({ product, variant = "icon" }: Props) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;
  const onClick = () =>
    add({
      id: product.id,
      title: product.title,
      price: product.finalPrice,
      imageUrl: product.imageUrl,
      categorySlug: product.category.slug,
    });

  if (variant === "full") {
    return (
      <button type="button" onClick={onClick} disabled={soldOut} className="btn btn-primary w-full sm:w-auto sm:px-10">
        {soldOut ? "نفدت الكمية" : "أضف إلى السلة"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soldOut}
      aria-label={soldOut ? `${product.title}: نفدت الكمية` : `أضف ${product.title} إلى السلة`}
      title={soldOut ? "نفدت الكمية" : "أضف إلى السلة"}
      className="grid size-11 shrink-0 place-items-center rounded-full bg-saffron text-graphite transition-transform hover:scale-105 active:scale-95 disabled:bg-steel disabled:text-dim"
    >
      <PlusIcon />
    </button>
  );
}
