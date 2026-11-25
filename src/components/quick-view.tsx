"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart";
import { CloseIcon, EyeIcon } from "./icons";
import { Badge, ProductVisual } from "./product-bits";

export function QuickViewButton({ product }: { product: ProductView }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger.current?.focus();
    };
  }, [open]);

  const onSale = product.finalPrice < product.price;

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`عرض سريع: ${product.title}`}
        className="grid size-10 place-items-center rounded-full bg-graphite/80 text-mist backdrop-blur transition-all duration-300 hover:bg-saffron hover:text-graphite focus-visible:opacity-100 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
      >
        <EyeIcon />
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby={`qv-${product.id}`}>
                <motion.button
                  type="button"
                  aria-label="إغلاق"
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  className="relative grid max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-steel bg-slab shadow-2xl sm:grid-cols-2"
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                >
                  <div className="relative aspect-square sm:aspect-auto">
                    <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} size="hero" />
                    {product.badge && (
                      <div className="absolute top-4 right-4">
                        <Badge label={product.badge} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-dim">{product.category.name}</p>
                        <h2 id={`qv-${product.id}`} className="font-display text-2xl font-black leading-tight">
                          {product.title}
                        </h2>
                      </div>
                      <button type="button" onClick={() => setOpen(false)} className="-m-1 rounded-full p-2 hover:bg-steel" aria-label="إغلاق" autoFocus>
                        <CloseIcon />
                      </button>
                    </div>
                    <p className="flex items-baseline gap-3 font-display">
                      <span className={`num text-3xl font-black ${onSale ? "text-signal" : "text-saffron"}`}>{formatPrice(product.finalPrice)}</span>
                      {onSale && <s className="num text-lg text-dim">{formatPrice(product.price)}</s>}
                    </p>
                    {product.description && <p className="text-haze">{product.description}</p>}
                    <div className="mt-auto flex flex-col gap-3 pt-2">
                      <AddToCartButton product={product} variant="full" />
                      <Link href={`/product/${product.id}`} className="text-center text-sm text-haze underline-offset-4 hover:text-saffron hover:underline">
                        كل تفاصيل المنتج
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
