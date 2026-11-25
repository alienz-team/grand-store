import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — تسوق أونلاين في ليبيا`, template: `%s | ${SITE.name}` },
  description: `${SITE.tagline}. أجهزة إلكترونية، ديكور، أدوات مطبخ وهدايا مع توصيل داخل طرابلس وكافة المدن الليبية والدفع عند الاستلام.`,
};

export const viewport: Viewport = { themeColor: "#15171c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
