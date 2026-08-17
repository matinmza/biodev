export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fa"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

/**
 * Pick the best locale for a visitor from an Accept-Language header.
 * Persian speakers get fa, everyone else the default (en).
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (acceptLanguage?.toLowerCase().includes("fa")) return "fa";
  return i18n.defaultLocale;
}
