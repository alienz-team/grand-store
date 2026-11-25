"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "./cart";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { InstallAppButton } from "./install-app";
import { LanguageToggle, ThemeToggle, useI18n } from "./preferences";

type NavCategory = { name: string; slug: string };

function SearchForm({ onDone, id }: { onDone?: () => void; id: string }) {
  const { L } = useI18n();
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
        {L("ابحث عن منتج", "Search products")}
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={L("ابحث عن منتج…", "Search products…")}
        className="field rounded-full! py-2! pe-10"
      />
      <button type="submit" aria-label={L("بحث", "Search")} className="absolute inset-y-0 end-1 grid w-9 place-items-center text-haze hover:text-gold">
        <SearchIcon />
      </button>
    </form>
  );
}

export function Navbar({ categories }: { categories: NavCategory[] }) {
  const { L } = useI18n();
  const { count, setOpen, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-graphite/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          className="-ms-2 grid size-11 place-items-center lg:hidden"
          onClick={() => setMenu((m) => !m)}
          aria-label={L("القائمة", "Menu")}
          aria-expanded={menu}
          aria-controls="mobile-menu"
        >
          {menu ? <CloseIcon className="size-6" /> : <MenuIcon />}
        </button>

        <Link href="/" className="shrink-0 font-display text-base font-black tracking-tight min-[380px]:text-lg sm:text-xl" aria-label={L("Grand Store — الصفحة الرئيسية", "Grand Store — Home")}>
          <span dir="ltr">
            GRAND<span className="text-gold">.</span>STORE
          </span>
        </Link>

        <nav aria-label={L("الأقسام", "Categories")} className="hidden min-w-0 items-center gap-1 lg:flex">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${active ? "bg-steel text-gold" : "text-haze hover:text-mist"}`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto hidden w-full min-w-0 max-w-xs md:block lg:max-w-56 xl:max-w-xs">
          <Suspense>
            <SearchForm id="search-desktop" />
          </Suspense>
        </div>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2 md:ms-0">
          <span className="hidden lg:contents">
            <InstallAppButton />
          </span>
          <ThemeToggle />
          <LanguageToggle />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative grid size-11 shrink-0 place-items-center rounded-full border border-steel hover:border-saffron"
          aria-label={L(`السلة، ${count} منتج`, `Cart, ${count} items`)}
        >
          <BagIcon />
          {ready && count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.4, y: -6 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 12 }}
              className="num absolute -top-1 -end-1 grid min-w-5 place-items-center rounded-full bg-saffron px-1 text-[11px] font-bold leading-5 text-ink"
            >
              {count}
            </motion.span>
          )}
        </button>
      </div>

      {menu && (
        <div id="mobile-menu" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-steel px-4 pb-5 pt-3 lg:hidden">
          <div className="md:hidden">
            <Suspense>
              <SearchForm id="search-mobile" onDone={() => setMenu(false)} />
            </Suspense>
          </div>
          <nav aria-label={L("الأقسام", "Categories")} className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-xl border border-steel px-4 py-3 hover:border-saffron">
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <InstallAppButton variant="full" />
          </div>
        </div>
      )}
    </header>
  );
}
