import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n-server";
import { CheckoutForm } from "./checkout-form";

export async function generateMetadata(): Promise<Metadata> {
  const { L } = await getI18n();
  return { title: L("إتمام الطلب", "Checkout"), robots: { index: false } };
}

export default async function CheckoutPage() {
  const { L } = await getI18n();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="mb-8 border-b border-steel pb-6 font-display text-3xl font-black sm:text-4xl">{L("إتمام الطلب", "Checkout")}</h1>
      <CheckoutForm />
    </div>
  );
}
