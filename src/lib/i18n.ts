import { locales, type Locale, type Text } from "@/content/site";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

export function t(text: Text, lang: Locale) {
  return text[lang];
}

/** Internal href with trailing slash (matches static export). Link adds basePath. */
export function href(lang: Locale, path: string[] = []) {
  return `/${[lang, ...path].join("/")}/`;
}

export function otherLocale(lang: Locale): Locale {
  return lang === "mn" ? "en" : "mn";
}

/** For plain <img>/<a> to static files, which Link does not prefix. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
