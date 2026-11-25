"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ProductView } from "@/lib/types";
import { EASE_OUT } from "./motion";
import { useI18n } from "./preferences";
import { ProductCard } from "./product-card";

/** Category chips that re-flow the grid with layout animation. */
export function FilterableGrid({
  products,
  categories,
  limit = 8,
}: {
  products: ProductView[];
  categories: { name: string; slug: string }[];
  limit?: number;
}) {
  const { L } = useI18n();
  const [active, setActive] = useState<string>("all");
  const shown = products.filter((p) => active === "all" || p.category.slug === active).slice(0, limit);
  const chips = [{ slug: "all", name: L("الكل", "All") }, ...categories.filter((c) => products.some((p) => p.category.slug === c.slug))];

  return (
    <div>
      <div role="group" aria-label={L("تصفية حسب القسم", "Filter by category")} className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {chips.map((c) => {
          const selected = active === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(c.slug)}
              className={`relative min-h-10 shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selected ? "border-transparent text-ink" : "border-steel text-haze hover:border-steel-2 hover:text-mist"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-saffron"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative font-medium">{c.name}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <ProductCard product={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
