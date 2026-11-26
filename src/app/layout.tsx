import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/install-app";
import { LangProvider } from "@/components/preferences";
import { dirOf } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";
import { SITE } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

// Self-hosted at build time: no request to Google at runtime, and size-adjusted fallbacks keep layout shift near zero.
const display = Alexandria({ subsets: ["arabic", "latin"], weight: ["400", "600", "800", "900"], variable: "--font-alexandria" });
const sans = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex" });

export async function generateMetadata(): Promise<Metadata> {
  const { L } = await getI18n();
  return {
    title: { default: `${SITE.name} — ${L("تسوق أونلاين في ليبيا", "Online shopping in Libya")}`, template: `%s | ${SITE.name}` },
    description: L(
      `${SITE.tagline.ar}. أجهزة إلكترونية، ديكور، أدوات مطبخ وهدايا مع توصيل داخل طرابلس وكافة المدن الليبية والدفع عند الاستلام.`,
      "Electronics, home decor, kitchenware and gifts, delivered across Tripoli and all of Libya. Pay cash on delivery.",
    ),
    applicationName: SITE.name,
    appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080f" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await getI18n();
  return (
    // The theme script sets data-theme before hydration, so React must not complain about it.
    <html lang={lang} dir={dirOf(lang)} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <LangProvider lang={lang}>{children}</LangProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
