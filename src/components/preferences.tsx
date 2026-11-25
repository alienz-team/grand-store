"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { dirOf, LANG_COOKIE, translator, type Lang, type Translate } from "@/lib/i18n";
import { THEME_KEY, type Theme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

/* ---------- Language ---------- */

type I18n = { lang: Lang; dir: "rtl" | "ltr"; L: Translate };

const I18nContext = createContext<I18n>({ lang: "ar", dir: "rtl", L: translator("ar") });

/** The server reads the language cookie; this hands the same value to client components. */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = useMemo(() => ({ lang, dir: dirOf(lang), L: translator(lang) }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}

const toggleClass =
  "grid size-10 shrink-0 place-items-center rounded-full border border-steel text-mist transition-colors hover:border-saffron disabled:opacity-60";

export function LanguageToggle() {
  const { lang } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Lang = lang === "ar" ? "en" : "ar";

  const switchLang = () => {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const root = document.documentElement;
    root.lang = next;
    root.dir = dirOf(next);
    // Server components render the copy, so fetch them again in the new language.
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={switchLang}
      disabled={pending}
      className={`${toggleClass} font-display text-sm font-bold`}
      aria-label={next === "en" ? "Switch to English" : "التبديل إلى العربية"}
      title={next === "en" ? "English" : "العربية"}
    >
      <span lang={next} className={next === "ar" ? "-mt-1 font-sans text-base leading-none" : "leading-none"}>
        {next === "en" ? "EN" : "ع"}
      </span>
    </button>
  );
}

/* ---------- Theme ---------- */

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const set = () => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Cross-fade between themes where the View Transitions API exists.
  if (!reduce && "startViewTransition" in document) document.startViewTransition(set);
  else set();
}

export function ThemeToggle() {
  const { L } = useI18n();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    // Follow the OS setting live until the visitor picks a theme themselves.
    const mq = matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (localStorage.getItem(THEME_KEY)) return;
      const t: Theme = mq.matches ? "light" : "dark";
      applyTheme(t);
      setTheme(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    setTheme(next);
  };

  const label = theme === "light" ? L("تفعيل الوضع الداكن", "Switch to dark mode") : L("تفعيل الوضع الفاتح", "Switch to light mode");

  return (
    <button type="button" onClick={toggle} className={toggleClass} aria-label={label} title={label}>
      {/* The server cannot know the theme, so the dark-mode icon shows until mount. */}
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
