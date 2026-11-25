"use client";

import { useActionState, useEffect, useRef } from "react";
import { useI18n } from "@/components/preferences";
import { saveCategory, type FormState } from "../../actions";

type Category = { id: string; name: string; slug: string; imageUrl: string | null; sortOrder: number };

export function CategoryForm({ category }: { category?: Category }) {
  const { L } = useI18n();
  const [state, action, pending] = useActionState<FormState, FormData>(saveCategory, {});
  const ref = useRef<HTMLFormElement>(null);
  const p = category?.id ?? "new";

  useEffect(() => {
    if (state.ok && !category) ref.current?.reset();
  }, [state, category]);

  return (
    <form ref={ref} action={action} className="flex flex-wrap items-end gap-3">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="min-w-0 basis-full sm:min-w-48 sm:basis-auto sm:flex-1">
        <label htmlFor={`name-${p}`} className="mb-1 block text-xs text-haze">
          {L("الاسم", "Name")}
        </label>
        <input id={`name-${p}`} name="name" required defaultValue={category?.name} className="field" />
      </div>
      <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
        <label htmlFor={`slug-${p}`} className="mb-1 block text-xs text-haze">
          {L("الرابط المختصر", "Slug")}
        </label>
        <input id={`slug-${p}`} name="slug" dir="ltr" placeholder="electronics" defaultValue={category?.slug} className="field" />
      </div>
      <div className="w-24">
        <label htmlFor={`sort-${p}`} className="mb-1 block text-xs text-haze">
          {L("الترتيب", "Order")}
        </label>
        <input id={`sort-${p}`} name="sortOrder" type="number" dir="ltr" defaultValue={category?.sortOrder ?? 0} className="field num" />
      </div>
      <div className="min-w-0 basis-full sm:min-w-64 sm:basis-auto sm:flex-[2]">
        <label htmlFor={`img-${p}`} className="mb-1 block text-xs text-haze">
          {L("رابط صورة القسم", "Category image URL")}
        </label>
        <input id={`img-${p}`} name="imageUrl" type="url" dir="ltr" placeholder="https://images.unsplash.com/…" defaultValue={category?.imageUrl ?? ""} className="field" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? L("جارٍ الحفظ…", "Saving…") : category ? L("حفظ", "Save") : L("إضافة", "Add")}
      </button>
      <p role="status" className="basis-full text-sm">
        {state.error && <span className="text-danger">{state.error}</span>}
        {state.ok && <span className="text-ok">{state.ok}</span>}
      </p>
    </form>
  );
}
