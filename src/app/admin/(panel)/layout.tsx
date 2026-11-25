import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { AdminNav } from "./admin-nav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col lg:flex-row">
      <aside className="border-b border-steel p-4 lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-l lg:p-6">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin" className="font-display text-lg font-black" dir="ltr">
            GRAND<span className="text-saffron">.</span>STORE
          </Link>
          <p className="text-xs text-dim lg:mt-1">لوحة التحكم</p>
        </div>
        <AdminNav />
        <div className="mt-4 flex gap-2 lg:mt-10 lg:flex-col">
          <Link href="/" target="_blank" className="text-sm text-haze hover:text-saffron">
            عرض المتجر
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-haze hover:text-signal">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
