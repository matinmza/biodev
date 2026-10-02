/**
 * The site's own address, in its own module on purpose: both `lib/seo.ts` and
 * `data/resume.ts` need it, and they import each other — a shared leaf keeps
 * that from becoming an import cycle, where whichever module loaded first
 * would read the other's constants before they were initialised.
 *
 * The value itself comes from `NEXT_PUBLIC_SITE_URL`, which `next.config.ts`
 * resolves from the environment (explicit domain, else the Vercel host). The
 * literal below is only the fallback for contexts that run without Next —
 * vitest, and the capture scripts.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://matinzarifamin.ir"
).replace(/\/$/, "");
