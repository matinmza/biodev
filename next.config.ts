import type { NextConfig } from "next";

/**
 * The site's address, resolved once at build time.
 *
 * Order matters: an explicit `NEXT_PUBLIC_SITE_URL` always wins, so buying
 * matinzarifamin.ir is one Vercel environment variable and a redeploy. Until
 * then the deployment's own production host is used, which Vercel sets on
 * preview builds too — so a preview's canonicals point at production, which is
 * the SEO-correct answer anyway.
 *
 * The literal last resort is the live address, not a wish: it is what a local
 * `npm run build` and the printed résumé PDF use, and a PDF that advertises a
 * domain nobody owns yet is a dead link on a recruiter's screen.
 *
 * Exposing it through `env` rather than reading the Vercel variables directly
 * in `lib/site.ts` is deliberate: only `NEXT_PUBLIC_*` names are inlined into
 * the client bundle, so this is the one place that knows about the hosting.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "https://matinzarifamin.vercel.app"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Plain HTML/CSS/JS in `out/`: any static host or nginx can serve it, no
  // Node process. That rules out the image optimizer, server redirects and the
  // locale proxy — `/` now redirects in the browser (`app/(root)/page.tsx`).
  output: "export",
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: { unoptimized: true },
};

export default nextConfig;
