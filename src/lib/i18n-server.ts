import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, translator, type Lang } from "./i18n";

async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function getI18n() {
  const lang = await getLang();
  return { lang, L: translator(lang) };
}
