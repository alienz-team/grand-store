import Link from "next/link";
import { LanguageToggle, ThemeToggle } from "@/components/preferences";
import { requireAdmin } from "@/lib/auth";
import { getI18n } from "@/lib/i18n-server";
import { logout } from "../actions";
import { AdminNav } from "./admin-nav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { L } = await getI18n();
  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col lg:flex-row">
      <aside className="border-b border-steel p-4 lg:sticky lg:top-0 lg:h-dvh lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-e lg:p-6">
        <div className="flex items-center justify-between gap-3 lg:block">
          <div>
            <Link href="/admin" className="font-display text-lg font-black" dir="ltr">
              GRAND<span className="text-gold">.</span>STORE
            </Link>
            <p className="text-xs text-dim lg:mt-1">{L("لوحة التحكم", "Admin dashboard")}</p>
          </div>
          <div className="flex gap-2 lg:mt-5">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
        <AdminNav />
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 lg:mt-10 lg:flex-col">
          <Link href="/" target="_blank" className="py-1.5 text-sm text-haze hover:text-gold">
            {L("عرض المتجر", "View store")}
          </Link>
          <form action={logout}>
            <button type="submit" className="py-1.5 text-sm text-haze hover:text-danger">
              {L("تسجيل الخروج", "Sign out")}
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
