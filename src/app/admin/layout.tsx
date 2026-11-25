import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { L } = await getI18n();
  const name = L("لوحة التحكم", "Admin");
  return {
    title: { default: name, template: `%s | ${name} — Grand Store` },
    robots: { index: false, follow: false },
  };
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-graphite">{children}</div>;
}
