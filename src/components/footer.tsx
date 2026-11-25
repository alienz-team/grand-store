import Link from "next/link";
import type { Lang, Translate } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { InstallAppButton } from "./install-app";

export function Footer({ categories, lang, L }: { categories: { name: string; slug: string }[]; lang: Lang; L: Translate }) {
  return (
    <footer className="mt-24 border-t border-steel bg-slab">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-black" dir="ltr">
            GRAND<span className="text-gold">.</span>STORE
          </p>
          <p className="mt-3 max-w-xs text-haze">{SITE.tagline[lang]}</p>
        </div>
        <nav aria-label={L("الأقسام", "Categories")}>
          <h2 className="font-display font-semibold">{L("الأقسام", "Categories")}</h2>
          <ul className="mt-3 space-y-1 text-haze">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="inline-block py-1 hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display font-semibold">{L("تواصل معنا", "Contact us")}</h2>
          <ul className="mt-3 space-y-2 text-haze">
            <li>{SITE.city[lang]}</li>
            <li>
              {L("هاتف:", "Phone:")}{" "}
              <a href={`tel:${SITE.phoneTel}`} className="ltr num hover:text-gold">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-1 text-ok hover:underline"
              >
                <WhatsAppIcon /> {L("راسلنا على واتساب", "Message us on WhatsApp")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-display font-semibold">{L("التطبيق", "The app")}</h2>
          <p className="mt-3 mb-4 text-sm text-haze">
            {L("ثبّت المتجر على هاتفك أو حاسوبك للوصول السريع.", "Install the store on your phone or computer for quick access.")}
          </p>
          <InstallAppButton variant="full" />
        </div>
      </div>
      <p className="border-t border-steel px-4 py-5 text-center text-sm text-dim">
        © <span className="num">{new Date().getFullYear()}</span> Grand Store — {SITE.city[lang]}
      </p>
    </footer>
  );
}
