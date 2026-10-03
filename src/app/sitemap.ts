import type { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";
import { SITE_URL, languageAlternates } from "@/lib/seo";

// Static export: rendered once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...i18n.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === i18n.defaultLocale ? 1 : 0.9,
      alternates: { languages: languageAlternates() },
    })),
    // The résumé exists in English only — no hreflang alternates for it.
    {
      url: `${SITE_URL}/en/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];
}
