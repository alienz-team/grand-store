import { AnnouncementBar, tickerItems } from "@/components/bars";
import { CartProvider } from "@/components/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { MotionProvider } from "@/components/motion";
import { Navbar } from "@/components/navbar";
import { getI18n } from "@/lib/i18n-server";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [{ lang, L }, all] = await Promise.all([getI18n(), getCategories()]);
  const categories = all.map(({ name, slug }) => ({ name, slug }));
  return (
    <MotionProvider>
      <CartProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-full focus:bg-saffron focus:px-4 focus:py-2 focus:text-ink"
        >
          {L("تخطَّ إلى المحتوى", "Skip to content")}
        </a>
        <AnnouncementBar L={L} />
        <Navbar categories={categories} />
        <Marquee items={tickerItems(L)} label={L("آخر العروض", "Latest offers")} />
        <main id="main">{children}</main>
        <Footer categories={categories} lang={lang} L={L} />
        <CartDrawer />
      </CartProvider>
    </MotionProvider>
  );
}
