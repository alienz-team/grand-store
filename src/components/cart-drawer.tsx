"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons";
import { ProductVisual } from "./product-bits";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, count, setQuantity, remove } = useCart();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button
        type="button"
        aria-label="إغلاق السلة"
        className="absolute inset-0 animate-fade bg-black/60 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute inset-y-0 left-0 flex w-full max-w-md animate-drawer flex-col border-r border-steel bg-slab shadow-2xl">
        <header className="flex items-center justify-between border-b border-steel px-5 py-4">
          <h2 id="cart-title" className="font-display text-lg font-bold">
            سلة التسوق <span className="num text-haze">({count})</span>
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-steel" aria-label="إغلاق">
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-haze">سلتك فارغة. أضف منتجًا بالضغط على زر + في أي بطاقة.</p>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
              تابع التسوق
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-steel overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3 py-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-steel">
                    <ProductVisual imageUrl={l.imageUrl} title={l.title} categorySlug={l.categorySlug} size="thumb" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{l.title}</p>
                    <p className="num font-display text-sm text-haze">{formatPrice(l.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-steel">
                        <button
                          type="button"
                          className="p-2 hover:text-saffron"
                          onClick={() => setQuantity(l.id, l.quantity + 1)}
                          aria-label={`زيادة كمية ${l.title}`}
                        >
                          <PlusIcon className="size-4" />
                        </button>
                        <span className="num min-w-6 text-center text-sm" aria-live="polite">
                          {l.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2 hover:text-saffron"
                          onClick={() => setQuantity(l.id, l.quantity - 1)}
                          aria-label={`إنقاص كمية ${l.title}`}
                        >
                          <MinusIcon />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.id)} className="text-xs text-dim underline-offset-4 hover:text-signal hover:underline">
                        إزالة
                      </button>
                    </div>
                  </div>
                  <p className="num shrink-0 font-display font-semibold">{formatPrice(l.price * l.quantity)}</p>
                </li>
              ))}
            </ul>
            <footer className="space-y-3 border-t border-steel p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-haze">المجموع</span>
                <span className="num font-display text-2xl font-extrabold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-dim">الدفع نقدًا عند الاستلام. رسوم التوصيل يتم تأكيدها عند الاتصال بك.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                إتمام الطلب
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
