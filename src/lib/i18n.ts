/** Two-language UI copy. Strings live next to the markup that uses them: L("عربي", "English"). */
export type Lang = "ar" | "en";
export type Translate = (ar: string, en: string) => string;

export const LANG_COOKIE = "gs_lang";
export const DEFAULT_LANG: Lang = "ar";

export function isLang(value: unknown): value is Lang {
  return value === "ar" || value === "en";
}

export function dirOf(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function translator(lang: Lang): Translate {
  return (ar, en) => (lang === "en" ? en : ar);
}
