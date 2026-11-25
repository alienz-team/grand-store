import Link from "next/link";
import { SITE } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function Footer({ categories }: { categories: { name: string; slug: string }[] }) {
  return (
    <footer className="mt-24 border-t border-steel bg-slab">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-black" dir="ltr">
            GRAND<span className="text-saffron">.</span>STORE
          </p>
          <p className="mt-3 max-w-xs text-haze">{SITE.tagline}</p>
        </div>
        <nav aria-label="الأقسام">
          <h2 className="font-display font-semibold">الأقسام</h2>
          <ul className="mt-3 space-y-2 text-haze">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-saffron">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display font-semibold">تواصل معنا</h2>
          <ul className="mt-3 space-y-2 text-haze">
            <li>{SITE.city}</li>
            <li>
              هاتف:{" "}
              <a href={`tel:${SITE.phoneTel}`} className="ltr num hover:text-saffron">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-mint hover:underline"
              >
                <WhatsAppIcon /> راسلنا على واتساب
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-steel py-5 text-center text-sm text-dim">
        © <span className="num">{new Date().getFullYear()}</span> Grand Store — {SITE.city}
      </p>
    </footer>
  );
}
