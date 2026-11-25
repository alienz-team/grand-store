import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getI18n } from "@/lib/i18n-server";
import { ProductForm } from "../product-form";

/** Formats a date as yyyy-MM-ddTHH:mm in Tripoli time (UTC+2, no DST). */
function toTripoliInput(d: Date | null): string {
  if (!d) return "";
  return new Date(d.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const [{ id }, { L }] = await Promise.all([params, getI18n()]);
  const db = getDb();
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="break-words font-display text-2xl font-black sm:text-3xl">
        {L("تعديل:", "Edit:")} {product.title}
      </h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          title: product.title,
          description: product.description ?? "",
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() ?? "",
          badge: product.badge ?? "",
          imageUrl: product.imageUrl ?? "",
          categoryId: product.categoryId,
          stock: String(product.stock),
          active: product.active,
          bestSeller: product.bestSeller,
          dealEndsAt: toTripoliInput(product.dealEndsAt),
        }}
      />
    </div>
  );
}
