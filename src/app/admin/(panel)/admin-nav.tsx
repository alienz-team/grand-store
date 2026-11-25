"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/preferences";

export function AdminNav() {
  const { L } = useI18n();
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: L("نظرة عامة", "Overview") },
    { href: "/admin/orders", label: L("الطلبات", "Orders") },
    { href: "/admin/products", label: L("المنتجات", "Products") },
    { href: "/admin/categories", label: L("الأقسام", "Categories") },
  ];
  return (
    <nav aria-label={L("أقسام لوحة التحكم", "Admin sections")} className="-mx-1 mt-4 flex gap-1 overflow-x-auto px-1 lg:mt-8 lg:flex-col">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm ${active ? "bg-steel text-gold" : "text-haze hover:bg-slab hover:text-mist"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
