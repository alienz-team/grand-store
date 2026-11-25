"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useI18n } from "@/components/preferences";
import { saveProduct, type FormState } from "../../actions";

type ProductFormValues = {
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
  const { L } = useI18n();
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});

  if (categories.length === 0) {
    return (
      <p className="rounded-2xl border border-steel p-6 text-haze">
        {L("أضف قسمًا أولًا من", "Add a category first on the")}{" "}
        <Link href="/admin/categories" className="text-gold underline">
          {L("صفحة الأقسام", "categories page")}
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <fieldset disabled={pending} className="grid min-w-0 gap-5 rounded-2xl border border-steel bg-slab p-4 sm:grid-cols-2 sm:p-7">
        <legend className="sr-only">{L("بيانات المنتج", "Product details")}</legend>
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
            {L("اسم المنتج", "Product name")}
          </label>
          <input id="title" name="title" required defaultValue={initial.title} className="field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
            {L("الوصف", "Description")}
          </label>
          <textarea id="description" name="description" rows={3} defaultValue={initial.description} className="field resize-y" />
        </div>
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
            {L("السعر (ل.د)", "Price (LYD)")}
          </label>
          <input id="price" name="price" inputMode="decimal" dir="ltr" required defaultValue={initial.price} className="field num rtl:text-right" />
        </div>
        <div>
          <label htmlFor="salePrice" className="mb-1.5 block text-sm font-medium">
            {L("سعر التخفيض (ل.د)", "Sale price (LYD)")} <span className="text-dim">{L("— اتركه فارغًا إن لم يوجد", "— leave empty if none")}</span>
          </label>
          <input id="salePrice" name="salePrice" inputMode="decimal" dir="ltr" defaultValue={initial.salePrice} className="field num rtl:text-right" />
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium">
            {L("القسم", "Category")}
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
            {L("الكمية في المخزون", "Quantity in stock")}
          </label>
          <input id="stock" name="stock" type="number" min={0} dir="ltr" required defaultValue={initial.stock} className="field num rtl:text-right" />
        </div>
        <div>
          <label htmlFor="badge" className="mb-1.5 block text-sm font-medium">
            {L("الشارة", "Badge")}
          </label>
          <input id="badge" name="badge" list="badge-options" defaultValue={initial.badge} placeholder={L("مثل: جديد", "e.g. جديد (New)")} className="field" />
          <datalist id="badge-options">
            <option value="جديد" />
            <option value="تخفيض" />
            <option value="الأكثر طلبًا" />
          </datalist>
        </div>
        <div>
          <label htmlFor="dealEndsAt" className="mb-1.5 block text-sm font-medium">
            {L("ينتهي عرض الأسبوع في", "Deal of the week ends at")} <span className="text-dim">{L("(بتوقيت طرابلس)", "(Tripoli time)")}</span>
          </label>
          <input id="dealEndsAt" name="dealEndsAt" type="datetime-local" dir="ltr" defaultValue={initial.dealEndsAt} className="field num" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium">
            {L("رابط الصورة", "Image URL")}
          </label>
          <input id="imageUrl" name="imageUrl" type="url" dir="ltr" placeholder="https://…" defaultValue={initial.imageUrl} className="field" />
          <p className="mt-1.5 text-xs text-dim">{L("بدون صورة يظهر المنتج برسم القسم.", "Without an image, the category illustration is shown.")}</p>
        </div>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" name="active" defaultChecked={initial.active} className="size-5 accent-saffron" /> {L("معروض في المتجر", "Visible in store")}
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" name="bestSeller" defaultChecked={initial.bestSeller} className="size-5 accent-saffron" /> {L("ضمن الأكثر مبيعًا", "Show in best sellers")}
          </label>
        </div>
      </fieldset>
      {state.error && (
        <p role="alert" className="rounded-xl border border-signal/50 bg-signal/10 p-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? L("جارٍ الحفظ…", "Saving…") : initial.id ? L("حفظ التعديلات", "Save changes") : L("إضافة المنتج", "Add product")}
        </button>
        <Link href="/admin/products" className="btn btn-ghost">
          {L("إلغاء", "Cancel")}
        </Link>
      </div>
    </form>
  );
}
