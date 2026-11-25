import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LanguageToggle, ThemeToggle } from "@/components/preferences";
import { isAdmin } from "@/lib/auth";
import { getI18n } from "@/lib/i18n-server";
import { LoginForm } from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  const { L } = await getI18n();
  return { title: L("تسجيل الدخول", "Sign in") };
}

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const { L } = await getI18n();
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-end gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <div className="rounded-3xl border border-steel bg-slab p-6 sm:p-8">
          <p className="font-display text-xl font-black" dir="ltr">
            GRAND<span className="text-gold">.</span>STORE
          </p>
          <h1 className="mt-6 font-display text-2xl font-bold">{L("لوحة التحكم", "Admin dashboard")}</h1>
          <p className="mt-1 text-sm text-haze">{L("سجّل الدخول بحساب المدير للمتابعة.", "Sign in with the admin account to continue.")}</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
