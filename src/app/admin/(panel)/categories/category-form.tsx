"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveCategory, type FormState } from "../../actions";

type Category = { id: string; name: string; slug: string; sortOrder: number };

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCategory, {});
  const ref = useRef<HTMLFormElement>(null);
  const p = category?.id ?? "new";

  useEffect(() => {
    if (state.ok && !category) ref.current?.reset();
  }, [state, category]);

  return (
    <form ref={ref} action={action} className="flex flex-wrap items-end gap-3">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="min-w-48 flex-1">
        <label htmlFor={`name-${p}`} className="mb-1 block text-xs text-haze">
          الاسم
        </label>
        <input id={`name-${p}`} name="name" required defaultValue={category?.name} className="field" />
      </div>
      <div className="w-44">
        <label htmlFor={`slug-${p}`} className="mb-1 block text-xs text-haze">
          الرابط المختصر
        </label>
        <input id={`slug-${p}`} name="slug" dir="ltr" placeholder="electronics" defaultValue={category?.slug} className="field" />
      </div>
      <div className="w-24">
        <label htmlFor={`sort-${p}`} className="mb-1 block text-xs text-haze">
          الترتيب
        </label>
        <input id={`sort-${p}`} name="sortOrder" type="number" dir="ltr" defaultValue={category?.sortOrder ?? 0} className="field num" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "جارٍ الحفظ…" : category ? "حفظ" : "إضافة"}
      </button>
      <p role="status" className="basis-full text-sm">
        {state.error && <span className="text-signal">{state.error}</span>}
        {state.ok && <span className="text-mint">{state.ok}</span>}
      </p>
    </form>
  );
}
