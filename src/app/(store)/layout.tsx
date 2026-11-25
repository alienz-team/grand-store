import { AnnouncementBar, TICKER } from "@/components/bars";
import { CartProvider } from "@/components/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { MotionProvider } from "@/components/motion";
import { Navbar } from "@/components/navbar";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = (await getCategories()).map(({ name, slug }) => ({ name, slug }));
  return (
    <MotionProvider>
    <CartProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:rounded-full focus:bg-saffron focus:px-4 focus:py-2 focus:text-graphite">
        تخطَّ إلى المحتوى
      </a>
      <AnnouncementBar />
      <Navbar categories={categories} />
      <Marquee items={TICKER} />
      <main id="main">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </CartProvider>
    </MotionProvider>
  );
}
