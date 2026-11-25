import "server-only";
import { getDb } from "./db";
import type { CategoryView, ProductView } from "./types";

export const productSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  salePrice: true,
  badge: true,
  imageUrl: true,
  stock: true,
  active: true,
  bestSeller: true,
  dealEndsAt: true,
  category: { select: { id: true, name: true, slug: true } },
} as const;

type Num = { toString(): string };

type RawProduct = {
  id: string;
  title: string;
  description: string | null;
  price: Num;
  salePrice: Num | null;
  badge: string | null;
  imageUrl: string | null;
  stock: number;
  active: boolean;
  bestSeller: boolean;
  dealEndsAt: Date | null;
  category: { id: string; name: string; slug: string };
};

export function toProductView(p: RawProduct): ProductView {
  const price = Number(p.price.toString());
  const salePrice = p.salePrice == null ? null : Number(p.salePrice.toString());
  return {
    ...p,
    price,
    salePrice,
    finalPrice: salePrice != null && salePrice < price ? salePrice : price,
    dealEndsAt: p.dealEndsAt ? p.dealEndsAt.toISOString() : null,
  };
}

export async function getCategories(): Promise<CategoryView[]> {
  const rows = await getDb().category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      sortOrder: true,
      _count: { select: { products: { where: { active: true } } } },
    },
  });
  return rows.map(({ _count, ...c }) => ({ ...c, productCount: _count.products }));
}

export async function getCategoryBySlug(slug: string) {
  return getDb().category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
}

export async function getProducts(
  opts: { categoryId?: string; bestSeller?: boolean; query?: string; take?: number } = {},
): Promise<ProductView[]> {
  const q = opts.query?.trim();
  const rows = await getDb().product.findMany({
    where: {
      active: true,
      ...(opts.categoryId ? { categoryId: opts.categoryId } : {}),
      ...(opts.bestSeller ? { bestSeller: true } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
              { category: { name: { contains: q, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: opts.take ?? 48,
    select: productSelect,
  });
  return rows.map(toProductView);
}

export async function getProduct(id: string): Promise<ProductView | null> {
  const row = await getDb().product.findFirst({
    where: { id, active: true },
    select: productSelect,
  });
  return row ? toProductView(row) : null;
}

/** The active deal with the soonest end date that has not expired yet. */
export async function getDealOfTheWeek(): Promise<ProductView | null> {
  const row = await getDb().product.findFirst({
    where: { active: true, dealEndsAt: { gt: new Date() } },
    orderBy: { dealEndsAt: "asc" },
    select: productSelect,
  });
  return row ? toProductView(row) : null;
}
