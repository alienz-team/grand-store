import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { getDb } from "@/lib/db";
import { formatPrice, statusLabel } from "@/lib/format";
import { getI18n } from "@/lib/i18n-server";
import { SITE } from "@/lib/site";
import { ClearCart } from "./clear-cart";

export async function generateMetadata(): Promise<Metadata> {
  const { L } = await getI18n();
  return { title: L("تم استلام طلبك", "Order received"), robots: { index: false } };
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { lang, L }] = await Promise.all([params, getI18n()]);
  const order = await getDb().order.findUnique({
    where: { id },
    select: {
      number: true,
      customerName: true,
      city: true,
      phone: true,
      address: true,
      notes: true,
      total: true,
      status: true,
      items: { select: { title: true, unitPrice: true, quantity: true } },
    },
  });
  if (!order) notFound();

  const total = Number(order.total.toString());
  // The WhatsApp message goes to the store, so it is always in Arabic.
  const message = [
    `مرحبًا Grand Store، أريد تأكيد طلبي رقم #${order.number}`,
    "",
    ...order.items.map((i) => `• ${i.title} × ${i.quantity} = ${formatPrice(Number(i.unitPrice.toString()) * i.quantity)}`),
    "",
    `المجموع: ${formatPrice(total)}`,
    `الاسم: ${order.customerName}`,
    `المدينة: ${order.city}`,
    `الهاتف: ${order.phone}`,
    `العنوان: ${order.address}`,
    ...(order.notes ? [`ملاحظات: ${order.notes}`] : []),
  ].join("\n");
  const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <ClearCart />
      <div className="rounded-3xl border border-saffron/40 bg-slab p-6 sm:p-10">
        <p className="num font-display text-gold" dir="ltr">
          #{order.number}
        </p>
        <h1 className="mt-2 font-display text-2xl font-black sm:text-4xl">
          {L(`شكرًا ${order.customerName}، استلمنا طلبك`, `Thank you, ${order.customerName}. We've received your order`)}
        </h1>
        <p className="mt-3 text-haze">
          {L("سنتصل بك على الرقم", "We'll call you on")} <span className="ltr num text-mist">{order.phone}</span>{" "}
          {L(`لتأكيد الطلب وموعد التوصيل إلى ${order.city}.`, `to confirm the order and delivery time to ${order.city}.`)}{" "}
          {L("حالة الطلب:", "Order status:")} <span className="text-mist">{statusLabel(order.status, lang)}</span>.
        </p>

        <ul className="mt-8 divide-y divide-steel border-y border-steel">
          {order.items.map((i, n) => (
            <li key={n} className="flex justify-between gap-4 py-3">
              <span className="min-w-0">
                {i.title} <span className="num text-dim">× {i.quantity}</span>
              </span>
              <span className="num shrink-0 font-display">{formatPrice(Number(i.unitPrice.toString()) * i.quantity, lang)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <span className="text-haze">{L("المجموع — الدفع عند الاستلام", "Total — cash on delivery")}</span>
          <span className="num shrink-0 font-display text-2xl font-extrabold text-gold">{formatPrice(total, lang)}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn bg-mint text-ink hover:bg-[#5ee6ab]">
            <WhatsAppIcon /> {L("أرسل تأكيد الطلب عبر واتساب", "Confirm via WhatsApp")}
          </a>
          <Link href="/" className="btn btn-ghost">
            {L("متابعة التسوق", "Continue shopping")}
          </Link>
        </div>
        <p className="mt-4 text-xs text-dim">
          {L("إرسال رسالة واتساب اختياري، طلبك محفوظ لدينا بالفعل.", "Sending a WhatsApp message is optional; your order is already saved.")}
        </p>
      </div>
    </div>
  );
}
