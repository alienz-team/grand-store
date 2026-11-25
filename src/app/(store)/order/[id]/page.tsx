import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons";
import { getDb } from "@/lib/db";
import { formatPrice, STATUS_LABELS } from "@/lib/format";
import { SITE } from "@/lib/site";
import { ClearCart } from "./clear-cart";

export const metadata: Metadata = { title: "تم استلام طلبك", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <ClearCart />
      <div className="rounded-3xl border border-saffron/40 bg-slab p-6 sm:p-10">
        <p className="num font-display text-saffron" dir="ltr">
          #{order.number}
        </p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">شكرًا {order.customerName}، استلمنا طلبك</h1>
        <p className="mt-3 text-haze">
          سنتصل بك على الرقم <span className="ltr num text-mist">{order.phone}</span> لتأكيد الطلب وموعد التوصيل إلى {order.city}. حالة
          الطلب: <span className="text-mist">{STATUS_LABELS[order.status]}</span>.
        </p>

        <ul className="mt-8 divide-y divide-steel border-y border-steel">
          {order.items.map((i, n) => (
            <li key={n} className="flex justify-between gap-4 py-3">
              <span>
                {i.title} <span className="num text-dim">× {i.quantity}</span>
              </span>
              <span className="num font-display">{formatPrice(Number(i.unitPrice.toString()) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-haze">المجموع — الدفع عند الاستلام</span>
          <span className="num font-display text-2xl font-extrabold text-saffron">{formatPrice(total)}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn bg-mint text-graphite hover:bg-[#5ee6ab]">
            <WhatsAppIcon /> أرسل تأكيد الطلب عبر واتساب
          </a>
          <Link href="/" className="btn btn-ghost">
            متابعة التسوق
          </Link>
        </div>
        <p className="mt-4 text-xs text-dim">إرسال رسالة واتساب اختياري، طلبك محفوظ لدينا بالفعل.</p>
      </div>
    </div>
  );
}
