import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ProductForm } from "../product-form";

export default async function NewProduct() {
  await requireAdmin();
  const categories = await getDb().category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-black">إضافة منتج</h1>
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
