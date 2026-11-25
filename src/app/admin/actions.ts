"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { STATUSES } from "@/lib/format";

export type FormState = { error?: string; ok?: string };

/* ---------- Session ---------- */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "اكتب كلمة المرور." };
  if (!(await passwordMatches(password))) {
    await new Promise((r) => setTimeout(r, 400)); // slow down guessing
    return { error: "كلمة المرور غير صحيحة." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Helpers ---------- */

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function money(raw: string): number | null {
  if (raw === "") return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
}

function refreshStore() {
  revalidatePath("/", "layout");
}

/* ---------- Categories ---------- */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const name = str(formData, "name");
  const slug = slugify(str(formData, "slug") || name);
  const sortOrder = Math.floor(Number(str(formData, "sortOrder") || "0")) || 0;
  const imageUrl = str(formData, "imageUrl") || null;
  if (name.length < 2) return { error: "اسم القسم قصير جدًا." };
  if (!slug) return { error: "الرابط المختصر غير صالح." };
  if (imageUrl && !/^https:\/\/\S+$/i.test(imageUrl)) return { error: "رابط الصورة يجب أن يبدأ بـ https://" };

  const db = getDb();
  const clash = await db.category.findFirst({ where: { slug, NOT: id ? { id } : undefined }, select: { id: true } });
  if (clash) return { error: "يوجد قسم آخر بنفس الرابط المختصر." };

  if (id) await db.category.update({ where: { id }, data: { name, slug, sortOrder, imageUrl } });
  else await db.category.create({ data: { name, slug, sortOrder, imageUrl } });
  refreshStore();
  return { ok: id ? "تم حفظ القسم." : "تمت إضافة القسم." };
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const db = getDb();
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) redirect(`/admin/categories?error=${encodeURIComponent("لا يمكن حذف قسم يحتوي على منتجات. انقل المنتجات أولًا.")}`);
  await db.category.delete({ where: { id } });
  refreshStore();
  redirect("/admin/categories");
}

/* ---------- Products ---------- */

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const description = str(formData, "description") || null;
  const price = money(str(formData, "price"));
  const salePrice = money(str(formData, "salePrice"));
  const badge = str(formData, "badge") || null;
  const imageUrl = str(formData, "imageUrl") || null;
  const categoryId = str(formData, "categoryId");
  const stock = Math.floor(Number(str(formData, "stock") || "0"));
  const active = formData.get("active") === "on";
  const bestSeller = formData.get("bestSeller") === "on";
  const dealRaw = str(formData, "dealEndsAt");
  const dealEndsAt = dealRaw ? new Date(`${dealRaw}:00+02:00`) : null; // input is Tripoli local time

  if (title.length < 2) return { error: "اكتب اسم المنتج." };
  if (price == null || Number.isNaN(price)) return { error: "اكتب سعرًا صحيحًا." };
  if (salePrice != null && (Number.isNaN(salePrice) || salePrice >= price)) {
    return { error: "سعر التخفيض يجب أن يكون أقل من السعر الأصلي." };
  }
  if (!Number.isFinite(stock) || stock < 0) return { error: "الكمية يجب أن تكون صفرًا أو أكثر." };
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl) && !imageUrl.startsWith("/")) {
    return { error: "رابط الصورة يجب أن يبدأ بـ https://" };
  }
  if (dealEndsAt && Number.isNaN(dealEndsAt.getTime())) return { error: "تاريخ انتهاء العرض غير صالح." };

  const db = getDb();
  if (!(await db.category.findUnique({ where: { id: categoryId }, select: { id: true } }))) {
    return { error: "اختر قسمًا." };
  }

  const data = { title, description, price, salePrice, badge, imageUrl, categoryId, stock, active, bestSeller, dealEndsAt };
  if (id) await db.product.update({ where: { id }, data });
  else await db.product.create({ data });
  refreshStore();
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  // Order items keep their title/price snapshot; productId is set to NULL.
  await getDb().product.delete({ where: { id } });
  refreshStore();
  redirect("/admin/products");
}

export async function toggleProductActive(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const db = getDb();
  const p = await db.product.findUnique({ where: { id }, select: { active: true } });
  if (p) await db.product.update({ where: { id }, data: { active: !p.active } });
  refreshStore();
}

/* ---------- Orders ---------- */

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as (typeof STATUSES)[number];
  if (!STATUSES.includes(status)) return;
  await getDb().$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      select: { status: true, items: { select: { productId: true, quantity: true } } },
    });
    if (!order || order.status === status) return;
    // Cancelling returns items to stock; un-cancelling takes them out again.
    const delta = status === "CANCELLED" ? 1 : order.status === "CANCELLED" ? -1 : 0;
    if (delta !== 0) {
      for (const item of order.items) {
        if (!item.productId) continue;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: delta * item.quantity } },
        });
      }
    }
    await tx.order.update({ where: { id }, data: { status } });
  });
  revalidatePath("/admin", "layout");
  refreshStore();
}
