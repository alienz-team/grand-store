export type ProductView = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  /** What the customer pays. */
  finalPrice: number;
  badge: string | null;
  imageUrl: string | null;
  stock: number;
  active: boolean;
  bestSeller: boolean;
  dealEndsAt: string | null;
  category: { id: string; name: string; slug: string };
};

export type CategoryView = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  productCount: number;
};

export type CartLine = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  categorySlug: string;
  quantity: number;
};
