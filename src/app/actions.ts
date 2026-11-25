"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { CITIES } from "@/lib/site";

export type CheckoutState = {
  error?: string;
  fieldErrors?: Partial<Record<"customerName" | "city" | "phone" | "address" | "items", string>>;
  values?: Record<string, string>;
};

class StockError extends Error {}

/** Accepts 09XXXXXXXX, +2189XXXXXXXX, 002189XXXXXXXX; returns 09XXXXXXXX or null. */
function normalizeLibyanPhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "").replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const m = digits.match(/^(?:\+?218|00218|0)?(9[1-6]\d{7})$/);
  return m ? `0${m[1]}` : null;
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = {
    customerName: String(formData.get("customerName") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };

  let lines: Array<{ id: string; quantity: number }> = [];
  try {
    const parsed = JSON.parse(String(formData.get("items") ?? "[]"));
    if (Array.isArray(parsed)) {
      lines = parsed
        .map((l) => ({ id: String(l?.id ?? ""), quantity: Math.floor(Number(l?.quantity)) }))
        .filter((l) => l.id && Number.isFinite(l.quantity) && l.quantity > 0 && l.quantity <= 50);
    }
  } catch {
    lines = [];
  }

  const fieldErrors: CheckoutState["fieldErrors"] = {};
  if (values.customerName.length < 2 || values.customerName.length > 80) fieldErrors.customerName = "اكتب اسمك الكامل.";
  if (!CITIES.includes(values.city)) fieldErrors.city = "اختر مدينة التوصيل.";
  const phone = normalizeLibyanPhone(values.phone);
  if (!phone) fieldErrors.phone = "اكتب رقم هاتف ليبي صحيح، مثل 0915671934.";
  if (values.address.length < 4 || values.address.length > 300) fieldErrors.address = "اكتب العنوان أو أقرب نقطة دالة.";
  if (values.notes.length > 500) values.notes = values.notes.slice(0, 500);
  if (lines.length === 0) fieldErrors.items = "السلة فارغة. أضف منتجًا واحدًا على الأقل.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values };

  // Merge duplicate lines.
  const qty = new Map<string, number>();
  for (const l of lines) qty.set(l.id, (qty.get(l.id) ?? 0) + l.quantity);

  const db = getDb();
  let orderId: string;
  try {
    orderId = await db.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: [...qty.keys()] }, active: true },
        select: { id: true, title: true, price: true, salePrice: true, stock: true },
      });
      if (products.length !== qty.size) {
        throw new StockError("بعض المنتجات في السلة لم تعد متوفرة. حدّث السلة وحاول مجددًا.");
      }

      let total = 0;
      const items = products.map((p) => {
        const price = Number(p.price.toString());
        const sale = p.salePrice == null ? null : Number(p.salePrice.toString());
        const unitPrice = sale != null && sale < price ? sale : price;
        const quantity = qty.get(p.id)!;
        total += unitPrice * quantity;
        return { productId: p.id, title: p.title, unitPrice, quantity };
      });

      for (const item of items) {
        const res = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (res.count === 0) throw new StockError(`الكمية المطلوبة من «${item.title}» غير متوفرة حاليًا.`);
      }

      const order = await tx.order.create({
        data: {
          customerName: values.customerName,
          city: values.city,
          phone: phone!,
          address: values.address,
          notes: values.notes || null,
          total: Math.round(total * 100) / 100,
          items: { create: items },
        },
        select: { id: true },
      });
      return order.id;
    });
  } catch (e) {
    if (e instanceof StockError) return { error: e.message, values };
    console.error("placeOrder failed", e);
    return { error: "تعذّر حفظ الطلب الآن. حاول مرة أخرى بعد قليل.", values };
  }

  redirect(`/order/${orderId}`);
}
