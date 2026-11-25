"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart";
import { EASE_OUT } from "./motion";
import { Badge, ProductVisual } from "./product-bits";

// Words, not letters: splitting Arabic letters would break their joined shapes.
const LINES = [
  ["تســوق", "كـل", "ماتريـد"],
  ["وانـت", "فـي", "مكــانـك"],
];

const title: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const word: Variants = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

export function HeroTitle() {
  return (
    <motion.h1
      className="font-display text-[clamp(2.6rem,8.2vw,6.4rem)] font-black leading-[1.15] tracking-tight"
      variants={title}
      initial="hidden"
      animate="show"
    >
      {LINES.map((line, li) => (
        <span key={li} className={`block ${li === 1 ? "text-haze" : ""}`}>
          {line.map((w, wi) => (
            <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" variants={word}>
                {w}
              </motion.span>
              {wi < line.length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

export function HeroIntro({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75, ease: EASE_OUT }}>
      {children}
    </motion.div>
  );
}

export function HeroShowcase({ product }: { product: ProductView }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-full max-w-md"
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: EASE_OUT }}
    >
      {/* Ambient amber glow, breathing slowly behind the card */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-16 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(255 182 39 / 0.32), rgb(255 182 39 / 0.08) 55%, transparent 75%)" }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div style={{ y: parallax }}>
        <motion.article
          className="group relative"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-saffron/70 via-saffron/15 to-steel" aria-hidden />
          <div className="relative overflow-hidden rounded-[27px] bg-slab shadow-[0_30px_80px_-20px_rgb(255_182_39/0.35)]">
            <Link href={`/product/${product.id}`} className="block aspect-square" tabIndex={-1} aria-hidden>
              <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} size="hero" priority />
              {/* rim light along the top edge */}
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-saffron/15 to-transparent" />
            </Link>
            {product.badge && (
              <div className="absolute top-4 right-4">
                <Badge label={product.badge} />
              </div>
            )}
            <div className="flex items-end gap-4 border-t border-steel p-5">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-dim">{product.category.name}</p>
                <h2 className="truncate font-display text-xl font-bold">
                  <Link href={`/product/${product.id}`} className="hover:text-saffron">
                    {product.title}
                  </Link>
                </h2>
                <p className="num mt-1 font-display text-3xl font-black text-saffron">{formatPrice(product.finalPrice)}</p>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </motion.article>
      </motion.div>
    </motion.div>
  );
}
