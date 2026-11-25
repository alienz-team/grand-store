import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getI18n } from "@/lib/i18n-server";
import { ProductForm } from "../product-form";

export default async function NewProduct() {
  await requireAdmin();
  const [categories, { L }] = await Promise.all([
    getDb().category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    getI18n(),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-black sm:text-3xl">{L("إضافة منتج", "Add product")}</h1>
      <ProductForm
        categories={categories}
        initial={{
          title: "",
          description: "",
          price: "",
          salePrice: "",
          badge: "",
          imageUrl: "",
          categoryId: "",
          stock: "10",
          active: true,
          bestSeller: false,
          dealEndsAt: "",
        }}
      />
    </div>
  );
}
