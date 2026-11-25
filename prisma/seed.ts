import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/node/client";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

const categories = [
  { slug: "electronics", name: "أجهزة إلكترونية", sortOrder: 1 },
  { slug: "decor", name: "الديكور", sortOrder: 2 },
  { slug: "kitchen", name: "المطبخ", sortOrder: 3 },
  { slug: "gifts", name: "هدايا", sortOrder: 4 },
];

const DAY = 24 * 60 * 60 * 1000;

const products: Array<{
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  badge?: string;
  category: string;
  stock: number;
  bestSeller?: boolean;
  dealDays?: number;
}> = [
  {
    title: "ايفون 13 برو ماكس",
    description: "شاشة 6.7 بوصة Super Retina XDR بتقنية ProMotion، ثلاث كاميرات احترافية وبطارية تدوم طوال اليوم.",
    price: 2350,
    badge: "جديد",
    category: "electronics",
    stock: 6,
    bestSeller: true,
  },
  {
    title: "AMAZFIT BIP U PRO SMART WATCH",
    description: "ساعة ذكية بنظام GPS مدمج، قياس نبض القلب والأكسجين، وأكثر من 60 وضعًا رياضيًا.",
    price: 300,
    category: "electronics",
    stock: 14,
    bestSeller: true,
  },
  {
    title: "PROMATE TITAN-10C",
    description: "شاحن متنقل بسعة 10000 مللي أمبير مع منفذ USB-C وشحن سريع لجهازين معًا.",
    price: 75,
    category: "electronics",
    stock: 25,
    bestSeller: true,
  },
  {
    title: "ساعات حائطية",
    description: "ساعات حائط بتصاميم عصرية وحركة صامتة تناسب الصالة والمكتب.",
    price: 45,
    category: "decor",
    stock: 18,
  },
  {
    title: "تشكيلة سكاكين",
    description: "طقم سكاكين من الفولاذ المقاوم للصدأ مع حامل خشبي أنيق.",
    price: 65,
    category: "kitchen",
    stock: 12,
    bestSeller: true,
  },
  {
    title: "حقيبة خضراء",
    description: "حقيبة يد خضراء بخامة متينة وتصميم عملي، هدية مثالية.",
    price: 89,
    badge: "جديد",
    category: "gifts",
    stock: 9,
  },
  {
    title: "سروال أزرق",
    description: "سروال أزرق بقصة مريحة وقماش عالي الجودة.",
    price: 95,
    salePrice: 79,
    badge: "تخفيض -17%",
    category: "gifts",
    stock: 11,
    dealDays: 7,
  },
  {
    title: "كاتروات",
    description: "كاتروات بألوان مبهجة، لمسة لطيفة لكل مناسبة.",
    price: 25,
    badge: "جديد",
    category: "gifts",
    stock: 30,
  },
];

async function main() {
  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const p of products) {
    const data = {
      title: p.title,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice ?? null,
      badge: p.badge ?? null,
      stock: p.stock,
      active: true,
      bestSeller: p.bestSeller ?? false,
      dealEndsAt: p.dealDays ? new Date(Date.now() + p.dealDays * DAY) : null,
      categoryId: categoryIds.get(p.category)!,
    };
    const existing = await prisma.product.findFirst({ where: { title: p.title }, select: { id: true } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
    } else {
      await prisma.product.create({ data });
    }
  }

  const [c, pr] = await Promise.all([prisma.category.count(), prisma.product.count()]);
  console.log(`Seeded: ${c} categories, ${pr} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
