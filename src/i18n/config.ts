export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fa"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

/**
 * Pick the locale for a visitor who landed on `/`. The site is a static
 * export, so there is no edge to read a geo header from; the browser's clock
 * stands in for it — a visitor on Tehran time opens in Persian — with the
 * language list as the fallback.
 *
 * It runs in the browser as an inline script (`app/(root)/page.tsx` embeds its
 * source), so it must stay self-contained: no imports, no outer variables.
 */
export function pickLocale(
  languages: readonly string[],
  timeZone?: string
): Locale {
  if (timeZone === "Asia/Tehran") return "fa";
  return languages.some((l) => l.toLowerCase().startsWith("fa")) ? "fa" : "en";
}
