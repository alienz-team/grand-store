"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "./cart";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

type NavCategory = { name: string; slug: string };

function SearchForm({ onDone, id }: { onDone?: () => void; id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        router.push(v ? `/search?q=${encodeURIComponent(v)}` : "/search");
        onDone?.();
      }}
    >
      <label htmlFor={id} className="sr-only">
        ابحث عن منتج
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث عن منتج…"
        className="field rounded-full! py-2! pe-10"
      />
      <button type="submit" aria-label="بحث" className="absolute inset-y-0 left-1 grid w-9 place-items-center text-haze hover:text-saffron">
        <SearchIcon />
      </button>
    </form>
  );
}

export function Navbar({ categories }: { categories: NavCategory[] }) {
  const { count, setOpen, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-graphite/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <button type="button" className="-ms-2 p-2 lg:hidden" onClick={() => setMenu((m) => !m)} aria-label="القائمة" aria-expanded={menu}>
          {menu ? <CloseIcon className="size-6" /> : <MenuIcon />}
        </button>

        <Link href="/" className="font-display text-xl font-black tracking-tight" aria-label="Grand Store — الصفحة الرئيسية">
          <span dir="ltr">
            GRAND<span className="text-saffron">.</span>STORE
          </span>
        </Link>

        <nav aria-label="الأقسام" className="hidden items-center gap-1 lg:flex">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${active ? "bg-steel text-saffron" : "text-haze hover:text-mist"}`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto hidden w-full max-w-xs md:block">
          <Suspense>
            <SearchForm id="search-desktop" />
          </Suspense>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative ms-auto grid size-11 place-items-center rounded-full border border-steel hover:border-saffron md:ms-0"
          aria-label={`السلة، ${count} منتج`}
        >
          <BagIcon />
          {ready && count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.4, y: -6 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 12 }}
              className="num absolute -top-1 -left-1 grid min-w-5 place-items-center rounded-full bg-saffron px-1 text-[11px] font-bold leading-5 text-graphite"
            >
              {count}
            </motion.span>
          )}
        </button>
      </div>

      {menu && (
        <div className="border-t border-steel px-4 pb-5 pt-3 lg:hidden">
          <div className="md:hidden">
            <Suspense>
              <SearchForm id="search-mobile" onDone={() => setMenu(false)} />
            </Suspense>
          </div>
          <nav aria-label="الأقسام" className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-xl border border-steel px-4 py-3 hover:border-saffron">
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
