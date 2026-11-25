import type { Translate } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { CashIcon, ShieldIcon, TruckIcon } from "./icons";

export function AnnouncementBar({ L }: { L: Translate }) {
  return (
    <div className="bg-saffron text-ink">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-semibold sm:text-sm">
        {L("اطلب الآن وادفع عند الاستلام — للطلب والاستفسار واتساب", "Order now, pay on delivery — WhatsApp us at")}{" "}
        <a href={`https://wa.me/${SITE.whatsapp}`} className="ltr num -my-1 py-1 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
          {SITE.phoneDisplay}
        </a>
      </p>
    </div>
  );
}

export function tickerItems(L: Translate): string[] {
  return [
    L("ايفون 13 برو ماكس متوفر الآن", "iPhone 13 Pro Max now in stock"),
    L("توصيل لكل المدن الليبية", "Delivery to every Libyan city"),
    L("عرض الأسبوع: سروال أزرق بـ 79 ل.د", "Deal of the week: blue trousers for 79 LYD"),
    L("سماعات لاسلكية ومكبرات صوت", "Wireless earbuds and speakers"),
    L("ديكور يغيّر شكل بيتك", "Decor that transforms your home"),
    L("هدايا لكل مناسبة", "Gifts for every occasion"),
    L("الدفع نقدًا عند الاستلام", "Cash on delivery"),
  ];
}

export function TrustBar({ L }: { L: Translate }) {
  const items = [
    { icon: TruckIcon, title: L("توصيل سريع", "Fast delivery"), text: L("داخل طرابلس وكافة المدن الليبية", "Across Tripoli and all Libyan cities") },
    { icon: CashIcon, title: L("الدفع عند الاستلام", "Cash on delivery"), text: L("افحص طلبك ثم ادفع نقدًا", "Check your order, then pay cash") },
    { icon: ShieldIcon, title: L("ضمان الجودة", "Quality guaranteed"), text: L("منتجات أصلية ومضمونة", "Genuine, guaranteed products") },
  ];
  return (
    <section aria-label={L("لماذا Grand Store", "Why Grand Store")} className="border-y border-steel bg-slab">
      <ul className="mx-auto grid max-w-7xl divide-y divide-steel px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-4 py-5 sm:justify-center sm:px-4">
            <Icon className="size-7 shrink-0 text-gold" />
            <div>
              <p className="font-display font-semibold">{title}</p>
              <p className="text-sm text-haze">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SectionHeader({ index, title, action }: { index: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-steel pb-4">
      <h2 className="flex items-baseline gap-3 font-display text-2xl font-extrabold sm:gap-4 sm:text-3xl">
        <span className="num text-base font-semibold text-gold" dir="ltr">
          {index}
        </span>
        {title}
      </h2>
      {action}
    </div>
  );
}
