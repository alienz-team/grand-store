import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "إتمام الطلب" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 border-b border-steel pb-6 font-display text-3xl font-black sm:text-4xl">إتمام الطلب</h1>
      <CheckoutForm />
    </div>
  );
}
