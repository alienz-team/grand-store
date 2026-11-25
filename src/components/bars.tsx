import { SITE } from "@/lib/site";
import { CashIcon, ShieldIcon, TruckIcon } from "./icons";

export function AnnouncementBar() {
  return (
    <div className="bg-saffron text-graphite">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-semibold">
        اطلب الآن وادفع عند الاستلام — للطلب والاستفسار واتساب{" "}
        <a href={`https://wa.me/${SITE.whatsapp}`} className="ltr num underline underline-offset-2" target="_blank" rel="noopener noreferrer">
          {SITE.phoneDisplay}
        </a>
      </p>
    </div>
  );
}

const TICKER = [
  "ايفون 13 برو ماكس متوفر الآن",
  "توصيل لكل المدن الليبية",
  "عرض الأسبوع: سروال أزرق بـ 79 ل.د",
  "ساعات ذكية وشواحن متنقلة",
  "هدايا لكل مناسبة",
  "الدفع نقدًا عند الاستلام",
];

export function Marquee() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-b border-steel bg-slab py-2.5" aria-label="آخر العروض">
      <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
        {items.map((t, i) => (
          <span key={i} aria-hidden={i >= TICKER.length} className="flex shrink-0 items-center gap-10 whitespace-nowrap text-sm text-haze">
            {t}
            <span className="size-1.5 rotate-45 bg-saffron" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

const TRUST = [
  { icon: TruckIcon, title: "توصيل سريع", text: "داخل طرابلس وكافة المدن الليبية" },
  { icon: CashIcon, title: "الدفع عند الاستلام", text: "افحص طلبك ثم ادفع نقدًا" },
  { icon: ShieldIcon, title: "ضمان الجودة", text: "منتجات أصلية ومضمونة" },
];

export function TrustBar() {
  return (
    <section aria-label="لماذا Grand Store" className="border-y border-steel bg-slab">
      <ul className="mx-auto grid max-w-7xl divide-y divide-steel px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-x-reverse sm:px-6">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-4 py-5 sm:justify-center sm:px-4">
            <Icon className="size-7 shrink-0 text-saffron" />
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
      <h2 className="flex items-baseline gap-4 font-display text-2xl font-extrabold sm:text-3xl">
        <span className="num text-base font-semibold text-saffron" dir="ltr">
          {index}
        </span>
        {title}
      </h2>
      {action}
    </div>
  );
}
