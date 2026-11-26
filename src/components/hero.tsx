"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart";
import { EASE_OUT } from "./motion";
import { useI18n } from "./preferences";
import { Badge, ProductVisual } from "./product-bits";

// Words, not letters: splitting Arabic letters would break their joined shapes.
const LINES = {
  ar: [
    ["تســوق", "كـل", "ماتريـد"],
    ["وانـت", "فـي", "مكــانـك"],
  ],
  en: [
    ["Shop", "everything", "you", "want"],
    ["from", "wherever", "you", "are"],
  ],
};

const title: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const word: Variants = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

export function HeroTitle() {
  const { lang } = useI18n();
  return (
    <motion.h1
      key={lang}
      className={`font-display font-black leading-[1.2] tracking-tight ${
        lang === "ar" ? "text-[clamp(1.9rem,7.5vw,4.25rem)]" : "text-[clamp(1.75rem,5.5vw,3.6rem)]"
      }`}
      variants={title}
      initial="hidden"
      animate="show"
    >
      {LINES[lang].map((line, li) => (
        <span key={li} className={`block ${li === 1 ? "text-haze" : ""}`}>
          {line.map((w, wi) => (
            <Fragment key={wi}>
              <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span className="inline-block" variants={word}>
                  {w}
                </motion.span>
              </span>
              {/* The space must sit outside the inline-block mask, or it collapses and the words run together. */}
              {wi < line.length - 1 && " "}
            </Fragment>
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

const CYCLE_MS = 3500;

export function HeroShowcase({ products }: { products: ProductView[] }) {
  const { L, lang } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const product = products[index % products.length];

  // Reduced motion: no auto-advance (the dots still switch slides).
  useEffect(() => {
    if (reduce || paused || products.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % products.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reduce, paused, products.length]);

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-full max-w-[22rem] sm:max-w-md"
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: EASE_OUT }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Ambient amber glow, breathing slowly behind the card */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-16 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(255 182 39 / 0.32), rgb(255 182 39 / 0.08) 55%, transparent 75%)" }}
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div style={reduce ? undefined : { y: parallax }}>
        <motion.article
          className="group relative"
          aria-roledescription={L("عرض متحرك", "carousel")}
          aria-label={L("منتجات مختارة", "Featured products")}
          animate={reduce ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-saffron/70 via-saffron/15 to-steel" aria-hidden />
          <div className="relative overflow-hidden rounded-[27px] bg-slab shadow-[0_30px_80px_-20px_rgb(255_182_39/0.35)]">
            <div className="relative">
            <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden" tabIndex={-1} aria-hidden>
              <AnimatePresence initial={false}>
                <motion.div
                  key={product.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
                  transition={{ opacity: { duration: 0.9, ease: "easeInOut" }, scale: { duration: 3.5, ease: "easeOut" } }}
                >
                  <ProductVisual imageUrl={product.imageUrl} title={product.title} categorySlug={product.category.slug} size="hero" priority={index === 0} />
                </motion.div>
              </AnimatePresence>
              {/* rim light along the top edge */}
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-saffron/15 to-transparent" />
            </Link>
            {products.length > 1 && (
              <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1" role="group" aria-label={L("اختر منتجًا", "Choose a product")}>
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={p.title}
                    aria-current={i === index ? "true" : undefined}
                    className="grid h-6 w-6 place-items-center"
                  >
                    <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-saffron" : "w-1.5 bg-white/60"}`} />
                  </button>
                ))}
              </div>
            )}
            </div>
            {product.badge && (
              <div className="absolute top-4 start-4">
                <Badge label={product.badge} />
              </div>
            )}
            <div className="flex items-end gap-4 border-t border-steel p-5" aria-live={paused || reduce ? "polite" : "off"}>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-dim">{product.category.name}</p>
                <h2 className="truncate font-display text-xl font-bold">
                  <Link href={`/product/${product.id}`} className="hover:text-gold">
                    {product.title}
                  </Link>
                </h2>
                <p className="num mt-1 font-display text-2xl font-black text-gold sm:text-3xl">{formatPrice(product.finalPrice, lang)}</p>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </motion.article>
      </motion.div>
    </motion.div>
  );
}
