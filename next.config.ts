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
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: {
    // Screenshots are the only heavy assets left; serve them in the formats
    // that are a third of the PNG weight.
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;
