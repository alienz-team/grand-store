import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-steel bg-slab p-8">
        <p className="font-display text-xl font-black" dir="ltr">
          GRAND<span className="text-saffron">.</span>STORE
        </p>
        <h1 className="mt-6 font-display text-2xl font-bold">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-haze">اكتب كلمة مرور المدير للمتابعة.</p>
        <LoginForm />
      </div>
    </div>
  );
}
