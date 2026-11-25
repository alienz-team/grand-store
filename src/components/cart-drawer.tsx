"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart";
import { useI18n } from "./preferences";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons";
import { ProductVisual } from "./product-bits";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, count, setQuantity, remove } = useCart();
  const { lang, dir, L } = useI18n();
  // The drawer slides in from the inline-end edge: left in Arabic, right in English.
  const off = dir === "rtl" ? "-100%" : "100%";
  const nudge = dir === "rtl" ? -24 : 24;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <motion.button
            type="button"
            aria-label={L("إغلاق السلة", "Close cart")}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.aside
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-steel bg-slab shadow-2xl"
            initial={{ x: off }}
            animate={{ x: 0 }}
            exit={{ x: off }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="flex items-center justify-between border-b border-steel px-5 py-4">
              <h2 id="cart-title" className="font-display text-lg font-bold">
                {L("سلة التسوق", "Your cart")} <span className="num text-haze">({count})</span>
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-steel" aria-label={L("إغلاق", "Close")} autoFocus>
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-haze">{L("سلتك فارغة. أضف منتجًا بالضغط على زر + في أي بطاقة.", "Your cart is empty. Tap the + button on any product to add it.")}</p>
                <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
                  {L("تابع التسوق", "Continue shopping")}
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.id}
                        layout
                        initial={{ opacity: 0, x: nudge }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -nudge, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 overflow-hidden border-b border-steel py-4"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-steel">
                          <ProductVisual imageUrl={l.imageUrl} title={l.title} categorySlug={l.categorySlug} size="thumb" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{l.title}</p>
                          <p className="num font-display text-sm text-haze">{formatPrice(l.price, lang)}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-steel">
                              <button
                                type="button"
                                className="grid size-9 place-items-center hover:text-gold"
                                onClick={() => setQuantity(l.id, l.quantity + 1)}
                                aria-label={L(`زيادة كمية ${l.title}`, `Increase quantity of ${l.title}`)}
                              >
                                <PlusIcon className="size-4" />
                              </button>
                              <span className="num min-w-6 text-center text-sm" aria-live="polite">
                                {l.quantity}
                              </span>
                              <button
                                type="button"
                                className="grid size-9 place-items-center hover:text-gold"
                                onClick={() => setQuantity(l.id, l.quantity - 1)}
                                aria-label={L(`إنقاص كمية ${l.title}`, `Decrease quantity of ${l.title}`)}
                              >
                                <MinusIcon />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(l.id)}
                              className="px-1 py-2 text-xs text-dim underline-offset-4 hover:text-danger hover:underline"
                            >
                              {L("إزالة", "Remove")}
                            </button>
                          </div>
                        </div>
                        <p className="num shrink-0 font-display font-semibold">{formatPrice(l.price * l.quantity, lang)}</p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="space-y-3 border-t border-steel p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-haze">{L("المجموع", "Subtotal")}</span>
                    <span className="num font-display text-2xl font-extrabold">{formatPrice(subtotal, lang)}</span>
                  </div>
                  <p className="text-xs text-dim">
                    {L("الدفع نقدًا عند الاستلام. رسوم التوصيل يتم تأكيدها عند الاتصال بك.", "Pay cash on delivery. We confirm the delivery fee when we call you.")}
                  </p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                    {L("إتمام الطلب", "Checkout")}
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
