"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart";
import { CheckIcon, PlusIcon } from "./icons";

type Props = {
  product: { id: string; title: string; finalPrice: number; imageUrl: string | null; stock: number; category: { slug: string } };
  variant?: "icon" | "full";
};

const spring = { type: "spring", stiffness: 520, damping: 16 } as const;

export function AddToCartButton({ product, variant = "icon" }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(0); // increments per click so the pulse replays
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soldOut = product.stock <= 0;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onClick = () => {
    add({
      id: product.id,
      title: product.title,
      price: product.finalPrice,
      imageUrl: product.imageUrl,
      categorySlug: product.category.slug,
    });
    setAdded((n) => n + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(0), 1600);
  };

  const done = added > 0;
  const status = (
    <span className="sr-only" aria-live="polite">
      {done ? `تمت إضافة ${product.title} إلى السلة` : ""}
    </span>
  );

  if (variant === "full") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        disabled={soldOut}
        whileHover={soldOut ? undefined : { scale: 1.02 }}
        whileTap={soldOut ? undefined : { scale: 0.96 }}
        transition={spring}
        className={`btn w-full sm:w-auto sm:px-10 ${done ? "bg-mint text-graphite" : "btn-primary"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={soldOut ? "sold" : done ? "done" : "add"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            {soldOut ? "نفدت الكمية" : done ? (
              <>
                <CheckIcon /> تمت الإضافة
              </>
            ) : (
              "أضف إلى السلة"
            )}
          </motion.span>
        </AnimatePresence>
        {status}
      </motion.button>
    );
  }

  return (
    <div className="relative shrink-0">
      <AnimatePresence>
        {done && (
          <motion.span
            key={`label-${added}`}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-mint px-2.5 py-1 text-xs font-bold text-graphite shadow-lg"
            aria-hidden
          >
            تمت الإضافة
          </motion.span>
        )}
      </AnimatePresence>
      {done && (
        <motion.span
          key={`ring-${added}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-mint"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
      <motion.button
        type="button"
        onClick={onClick}
        disabled={soldOut}
        whileHover={soldOut ? undefined : { scale: 1.1 }}
        whileTap={soldOut ? undefined : { scale: 0.82 }}
        transition={spring}
        aria-label={soldOut ? `${product.title}: نفدت الكمية` : `أضف ${product.title} إلى السلة`}
        title={soldOut ? "نفدت الكمية" : "أضف إلى السلة"}
        className={`relative grid size-11 place-items-center rounded-full transition-colors disabled:bg-steel disabled:text-dim ${
          done ? "bg-mint text-graphite" : "bg-saffron text-graphite"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={done ? "check" : "plus"}
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={spring}
          >
            {done ? <CheckIcon /> : <PlusIcon />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      {status}
    </div>
  );
}
