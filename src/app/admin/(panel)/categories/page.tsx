import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getI18n } from "@/lib/i18n-server";
import { deleteCategory } from "../../actions";
import { ConfirmButton } from "../confirm-button";
import { CategoryForm } from "./category-form";

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const [{ error }, { L }] = await Promise.all([searchParams, getI18n()]);
  const categories = await getDb().category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, imageUrl: true, sortOrder: true, _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-black sm:text-3xl">{L("الأقسام", "Categories")}</h1>
      {error && (
        <p role="alert" className="rounded-xl border border-signal/50 bg-signal/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-steel bg-slab p-4 sm:p-5">
        <h2 className="mb-4 font-display text-lg font-bold">{L("إضافة قسم", "Add category")}</h2>
        <CategoryForm />
      </section>

      <ul className="space-y-3">
        {categories.map((c) => (
          <li key={c.id} className="rounded-2xl border border-steel bg-slab p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="min-w-0 break-all text-sm text-haze">
                <span className="num">{c._count.products}</span> {L("منتج — الرابط", "products — link")}{" "}
                <span className="ltr text-mist">/category/{c.slug}</span>
              </p>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton message={L(`حذف قسم «${c.name}»؟`, `Delete the “${c.name}” category?`)} className="shrink-0 py-1 text-sm text-haze hover:text-danger">
                  {L("حذف", "Delete")}
                </ConfirmButton>
              </form>
            </div>
            <CategoryForm category={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}
