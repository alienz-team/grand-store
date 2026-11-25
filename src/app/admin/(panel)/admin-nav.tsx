"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "الأقسام" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="أقسام لوحة التحكم" className="mt-4 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${active ? "bg-steel text-saffron" : "text-haze hover:bg-slab hover:text-mist"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
