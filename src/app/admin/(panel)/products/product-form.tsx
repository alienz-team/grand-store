"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProduct, type FormState } from "../../actions";

export type ProductFormValues = {
  id?: string;
  title: string;
  description: string;
  price: string;
  salePrice: string;
  badge: string;
  imageUrl: string;
  categoryId: string;
  stock: string;
  active: boolean;
  bestSeller: boolean;
  dealEndsAt: string; // yyyy-MM-ddTHH:mm in Tripoli time
};

export function ProductForm({ initial, categories }: { initial: ProductFormValues; categories: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});

  if (categories.length === 0) {
    return (
      <p className="rounded-2xl border border-steel p-6 text-haze">
        أضف قسمًا أولًا من{" "}
        <Link href="/admin/categories" className="text-saffron underline">
          صفحة الأقسام
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <fieldset disabled={pending} className="grid gap-5 rounded-2xl border border-steel bg-slab p-5 sm:grid-cols-2 sm:p-7">
        <legend className="sr-only">بيانات المنتج</legend>
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
            اسم المنتج
          </label>
          <input id="title" name="title" required defaultValue={initial.title} className="field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
            الوصف
          </label>
          <textarea id="description" name="description" rows={3} defaultValue={initial.description} className="field resize-y" />
        </div>
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
            السعر (ل.د)
          </label>
          <input id="price" name="price" inputMode="decimal" dir="ltr" required defaultValue={initial.price} className="field num text-right" />
        </div>
        <div>
          <label htmlFor="salePrice" className="mb-1.5 block text-sm font-medium">
            سعر التخفيض (ل.د) <span className="text-dim">— اتركه فارغًا إن لم يوجد</span>
          </label>
          <input id="salePrice" name="salePrice" inputMode="decimal" dir="ltr" defaultValue={initial.salePrice} className="field num text-right" />
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium">
            القسم
          </label>
          <select id="categoryId" name="categoryId" required defaultValue={initial.categoryId || categories[0].id} className="field">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="stock" className="mb-1.5 block text-sm font-medium">
            الكمية في المخزون
          </label>
          <input id="stock" name="stock" type="number" min={0} dir="ltr" required defaultValue={initial.stock} className="field num text-right" />
        </div>
        <div>
          <label htmlFor="badge" className="mb-1.5 block text-sm font-medium">
            الشارة
          </label>
          <input id="badge" name="badge" list="badge-options" defaultValue={initial.badge} placeholder="مثل: جديد" className="field" />
          <datalist id="badge-options">
            <option value="جديد" />
            <option value="تخفيض" />
            <option value="الأكثر طلبًا" />
          </datalist>
        </div>
        <div>
          <label htmlFor="dealEndsAt" className="mb-1.5 block text-sm font-medium">
            ينتهي عرض الأسبوع في <span className="text-dim">(بتوقيت طرابلس)</span>
          </label>
          <input id="dealEndsAt" name="dealEndsAt" type="datetime-local" dir="ltr" defaultValue={initial.dealEndsAt} className="field num" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium">
            رابط الصورة
          </label>
          <input id="imageUrl" name="imageUrl" type="url" dir="ltr" placeholder="https://…" defaultValue={initial.imageUrl} className="field" />
          <p className="mt-1.5 text-xs text-dim">بدون صورة يظهر المنتج برسم القسم.</p>
        </div>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked={initial.active} className="size-4 accent-saffron" /> معروض في المتجر
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="bestSeller" defaultChecked={initial.bestSeller} className="size-4 accent-saffron" /> ضمن الأكثر مبيعًا
          </label>
        </div>
      </fieldset>
      {state.error && (
        <p role="alert" className="rounded-xl border border-signal/50 bg-signal/10 p-3 text-sm text-signal">
          {state.error}
        </p>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? "جارٍ الحفظ…" : initial.id ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <Link href="/admin/products" className="btn btn-ghost">
          إلغاء
        </Link>
      </div>
    </form>
  );
}
