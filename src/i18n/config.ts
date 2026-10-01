export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fa"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

/**
 * Pick the locale for a visitor. Where they are decides it: a request from
 * Iran opens in Persian, everywhere else in English. The browser's
 * Accept-Language header is only the fallback, for the case where the platform
 * gave us no country (local development, a proxy that strips the header).
 */
export function matchLocale(
  acceptLanguage: string | null,
  country?: string | null
): Locale {
  if (country) return country.toUpperCase() === "IR" ? "fa" : "en";
  if (acceptLanguage?.toLowerCase().includes("fa")) return "fa";
  return i18n.defaultLocale;
}
