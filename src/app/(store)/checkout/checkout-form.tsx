"use client";

import Link from "next/link";
import { useActionState } from "react";
import { placeOrder, type CheckoutState } from "@/app/actions";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/format";
import { CITIES } from "@/lib/site";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-signal">
      {msg}
    </p>
  );
}

export function CheckoutForm() {
  const { lines, subtotal, ready } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const fe = state.fieldErrors ?? {};
  const v = state.values ?? {};

  if (!ready) return <p className="text-haze">جارٍ تحميل السلة…</p>;

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-steel p-10 text-center">
        <p className="text-haze">سلتك فارغة. أضف منتجات ثم عد لإتمام الطلب.</p>
        <Link href="/" className="btn btn-primary mt-6">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
      <input type="hidden" name="items" value={JSON.stringify(lines.map((l) => ({ id: l.id, quantity: l.quantity })))} />

      <fieldset className="space-y-5 rounded-2xl border border-steel bg-slab p-5 sm:p-7" disabled={pending}>
        <legend className="sr-only">بيانات التوصيل</legend>
        <h2 className="font-display text-xl font-bold">بيانات التوصيل</h2>

        <div>
          <label htmlFor="customerName" className="mb-1.5 block text-sm font-medium">
            الاسم
          </label>
          <input
            id="customerName"
            name="customerName"
            autoComplete="name"
            required
            defaultValue={v.customerName}
            aria-invalid={!!fe.customerName}
            aria-describedby={fe.customerName ? "err-name" : undefined}
            className="field"
          />
          <FieldError id="err-name" msg={fe.customerName} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
              المدينة
            </label>
            <select
              id="city"
              name="city"
              required
              defaultValue={v.city ?? "طرابلس"}
              aria-invalid={!!fe.city}
              aria-describedby={fe.city ? "err-city" : undefined}
              className="field"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FieldError id="err-city" msg={fe.city} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
              رقم الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="09X XXX XXXX"
              required
              defaultValue={v.phone}
              aria-invalid={!!fe.phone}
              aria-describedby={fe.phone ? "err-phone" : undefined}
              className="field num text-right"
            />
            <FieldError id="err-phone" msg={fe.phone} />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
            العنوان
          </label>
          <input
            id="address"
            name="address"
            autoComplete="street-address"
            placeholder="المنطقة، الشارع، أقرب نقطة دالة"
            required
            defaultValue={v.address}
            aria-invalid={!!fe.address}
            aria-describedby={fe.address ? "err-address" : undefined}
            className="field"
          />
          <FieldError id="err-address" msg={fe.address} />
        </div>

        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
            ملاحظات <span className="text-dim">(اختياري)</span>
          </label>
          <textarea id="notes" name="notes" rows={3} maxLength={500} defaultValue={v.notes} className="field resize-y" placeholder="مثلًا: أفضل وقت للتوصيل" />
        </div>
      </fieldset>

      <aside className="h-fit space-y-4 rounded-2xl border border-steel bg-slab p-5 sm:p-7 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-bold">ملخص الطلب</h2>
        <ul className="divide-y divide-steel">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-3 py-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate">{l.title}</span>
                <span className="num text-dim">× {l.quantity}</span>
              </span>
              <span className="num shrink-0 font-display">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-steel pt-4">
          <span className="text-haze">المجموع</span>
          <span className="num font-display text-2xl font-extrabold text-saffron">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-dim">الدفع نقدًا عند الاستلام. سنتصل بك لتأكيد الطلب ورسوم التوصيل.</p>
        {fe.items && <p className="text-sm text-signal">{fe.items}</p>}
        {state.error && (
          <p role="alert" className="rounded-xl border border-signal/50 bg-signal/10 p-3 text-sm text-signal">
            {state.error}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-primary w-full">
          {pending ? "جارٍ إرسال الطلب…" : "تأكيد الطلب"}
        </button>
      </aside>
    </form>
  );
}
