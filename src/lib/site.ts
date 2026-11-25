export const SITE = {
  name: "Grand Store",
  tagline: { ar: "تســوق كـل ماتريـد وانـت فـي مكــانـك", en: "Shop everything you want, from wherever you are" },
  city: { ar: "طرابلس، ليبيا", en: "Tripoli, Libya" },
  phoneDisplay: "+218 91 567 1934",
  phoneTel: "+218915671934",
  // wa.me needs the international number with no leading 0 after the country code.
  whatsapp: "218915671934",
};

/** Delivery cities. The Arabic name is the stored value; the English name is display-only. */
export const CITIES: ReadonlyArray<{ ar: string; en: string }> = [
  { ar: "طرابلس", en: "Tripoli" },
  { ar: "بنغازي", en: "Benghazi" },
  { ar: "مصراتة", en: "Misrata" },
  { ar: "الزاوية", en: "Zawiya" },
  { ar: "زليتن", en: "Zliten" },
  { ar: "الخمس", en: "Khoms" },
  { ar: "صبراتة", en: "Sabratha" },
  { ar: "غريان", en: "Gharyan" },
  { ar: "سرت", en: "Sirte" },
  { ar: "البيضاء", en: "Bayda" },
  { ar: "طبرق", en: "Tobruk" },
  { ar: "درنة", en: "Derna" },
  { ar: "سبها", en: "Sabha" },
  { ar: "أجدابيا", en: "Ajdabiya" },
  { ar: "زوارة", en: "Zuwara" },
  { ar: "ترهونة", en: "Tarhuna" },
  { ar: "مدينة أخرى", en: "Other city" },
];
