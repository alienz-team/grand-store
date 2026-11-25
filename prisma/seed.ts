import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/node/client";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

/**
 * Free Unsplash photos (images.unsplash.com, not Unsplash+). Each was checked
 * to return HTTP 200 and to show the product. The storefront appends size params.
 */
const img = (id: string) => `https://images.unsplash.com/photo-${id}`;

const categories = [
  { slug: "electronics", name: "أجهزة إلكترونية", sortOrder: 1, imageUrl: img("1637496652486-99d500bcdd18") },
  { slug: "decor", name: "الديكور", sortOrder: 2, imageUrl: img("1597696929736-6d13bed8e6a8") },
  { slug: "kitchen", name: "المطبخ", sortOrder: 3, imageUrl: img("1769812343266-323d6b508f24") },
  { slug: "gifts", name: "هدايا", sortOrder: 4, imageUrl: img("1608755728617-aefab37d2edd") },
];

const DAY = 24 * 60 * 60 * 1000;

type SeedProduct = {
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  badge?: string;
  category: string;
  stock: number;
  image: string;
  bestSeller?: boolean;
  dealDays?: number;
};

// Listed oldest → newest, so «وصل حديثًا» shows the newer additions first.
const products: SeedProduct[] = [
  // ── Original catalog ──
  {
    title: "ايفون 13 برو ماكس",
    description: "شاشة 6.7 بوصة Super Retina XDR بتقنية ProMotion، ثلاث كاميرات احترافية وبطارية تدوم طوال اليوم.",
    price: 2350,
    badge: "جديد",
    category: "electronics",
    stock: 6,
    bestSeller: true,
    image: "1647866276622-7990c3ee684d",
  },
  {
    title: "AMAZFIT BIP U PRO SMART WATCH",
    description: "ساعة ذكية بنظام GPS مدمج، قياس نبض القلب والأكسجين، وأكثر من 60 وضعًا رياضيًا.",
    price: 300,
    category: "electronics",
    stock: 14,
    bestSeller: true,
    image: "1579586337278-3befd40fd17a",
  },
  {
    title: "PROMATE TITAN-10C",
    description: "شاحن متنقل بسعة 10000 مللي أمبير مع منفذ USB-C وشحن سريع لجهازين معًا.",
    price: 75,
    category: "electronics",
    stock: 25,
    bestSeller: true,
    image: "1760708825913-65a50b3dc39b",
  },
  {
    title: "ساعات حائطية",
    description: "ساعات حائط بتصاميم عصرية وحركة صامتة تناسب الصالة والمكتب.",
    price: 45,
    category: "decor",
    stock: 18,
    image: "1563861826100-9cb868fdbe1c",
  },
  {
    title: "تشكيلة سكاكين",
    description: "طقم سكاكين من الفولاذ المقاوم للصدأ بمقابض خشبية، لكل مهام التقطيع في المطبخ.",
    price: 65,
    category: "kitchen",
    stock: 12,
    bestSeller: true,
    image: "1602063238855-524c4d8b9b18",
  },
  {
    title: "حقيبة خضراء",
    description: "حقيبة يد خضراء بخامة متينة وتصميم عملي، هدية مثالية.",
    price: 89,
    badge: "جديد",
    category: "gifts",
    stock: 9,
    image: "1740961073515-87b7cb625cea",
  },
  {
    title: "سروال أزرق",
    description: "سروال جينز أزرق بقصة مريحة وقماش عالي الجودة.",
    price: 95,
    salePrice: 79,
    badge: "تخفيض -17%",
    category: "gifts",
    stock: 11,
    dealDays: 7,
    image: "1714143136372-ddaf8b606da7",
  },
  {
    title: "كاتروات",
    description: "بطاقات تهنئة أنيقة مع ظروف ملونة، لمسة لطيفة لكل مناسبة.",
    price: 25,
    badge: "جديد",
    category: "gifts",
    stock: 30,
    image: "1554894872-1a01c75f7513",
  },
  // ── New additions ──
  {
    title: "سماعات رأس لاسلكية",
    description: "سماعات بلوتوث بخاصية عزل الضوضاء، وسائد مريحة وبطارية تصل إلى 30 ساعة.",
    price: 189,
    category: "electronics",
    stock: 10,
    bestSeller: true,
    image: "1618366712010-f4ae9c647dcb",
  },
  {
    title: "مكبر صوت بلوتوث",
    description: "مكبر صوت محمول بصوت نقي وجهير قوي، مقاوم للرذاذ ويعمل حتى 12 ساعة.",
    price: 145,
    category: "electronics",
    stock: 15,
    image: "1507878566509-a0dbe19677a5",
  },
  {
    title: "مصباح مكتب ذكي",
    description: "مصباح بإضاءة دافئة قابلة للتعتيم وقاعدة خشبية، يضيف جوًا هادئًا للمكتب وغرفة النوم.",
    price: 120,
    badge: "جديد",
    category: "decor",
    stock: 8,
    image: "1769255119650-f658d3dbc397",
  },
  {
    title: "لوحة جدارية مودرن",
    description: "لوحة تجريدية بألوان جريئة مطبوعة على كانفس عالي الجودة، جاهزة للتعليق.",
    price: 160,
    category: "decor",
    stock: 6,
    image: "1548255384-84a1a5a5b80a",
  },
  {
    title: "مزهرية سيراميك",
    description: "مزهرية سيراميك بلون عاجي مطفي وخطوط ناعمة، تناسب الزهور المجففة والطبيعية.",
    price: 55,
    category: "decor",
    stock: 20,
    bestSeller: true,
    image: "1612196808214-b8e1d6145a8c",
  },
  {
    title: "طقم أكواب قهوة فاخرة",
    description: "طقم أكواب وصحون من السيراميك المزجج بلون أزرق عميق، مثالي للقهوة والضيافة.",
    price: 85,
    category: "kitchen",
    stock: 14,
    bestSeller: true,
    image: "1784630165321-ca306af610d4",
  },
  {
    title: "خلاط يدوي متعدد الاستخدام",
    description: "خلاط يدوي بقوة 800 واط مع مضرب للبيض والكريمة، للشوربات والعصائر والصلصات.",
    price: 135,
    badge: "جديد",
    category: "kitchen",
    stock: 9,
    image: "1789304140039-8a072a77d343",
  },
  {
    title: "مطحنة قهوة كهربائية",
    description: "مطحنة قهوة بشفرات فولاذية ودرجات طحن متعددة، من الإسبريسو إلى القهوة العربية.",
    price: 210,
    category: "kitchen",
    stock: 7,
    image: "1461988279488-1dac181a78f9",
  },
  {
    title: "صندوق هدايا فاخر",
    description: "صندوق هدايا مغلف بشريطة ذهبية، نجهزه بما تختار من منتجاتنا مع بطاقة إهداء.",
    price: 59,
    category: "gifts",
    stock: 25,
    image: "1549465220-1a8b9238cd48",
  },
  {
    title: "عطر فاخر",
    description: "عطر بزجاجة كريستالية ونفحات خشبية دافئة تدوم طويلًا، هدية راقية للمناسبات.",
    price: 140,
    salePrice: 119,
    badge: "تخفيض -15%",
    category: "gifts",
    stock: 12,
    image: "1760920250029-36af9369a0bb",
  },
];

async function main() {
  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder, imageUrl: c.imageUrl },
      create: c,
    });
    categoryIds.set(c.slug, row.id);
  }

  const base = Date.now() - products.length * 60_000;
  for (const [i, p] of products.entries()) {
    const data = {
      title: p.title,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice ?? null,
      badge: p.badge ?? null,
      imageUrl: img(p.image),
      stock: p.stock,
      active: true,
      bestSeller: p.bestSeller ?? false,
      dealEndsAt: p.dealDays ? new Date(Date.now() + p.dealDays * DAY) : null,
      categoryId: categoryIds.get(p.category)!,
      createdAt: new Date(base + i * 60_000),
    };
    const existing = await prisma.product.findFirst({ where: { title: p.title }, select: { id: true } });
    if (existing) await prisma.product.update({ where: { id: existing.id }, data });
    else await prisma.product.create({ data });
  }

  const [c, pr, withImg] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.product.count({ where: { imageUrl: { not: null } } }),
  ]);
  console.log(`Seeded: ${c} categories, ${pr} products (${withImg} with images)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
