/**
 * The site's own address, in its own module on purpose: both `lib/seo.ts` and
 * `data/resume.ts` need it, and they import each other — a shared leaf keeps
 * that from becoming an import cycle, where whichever module loaded first
 * would read the other's constants before they were initialised.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://matinzarifamin.dev"
).replace(/\/$/, "");
