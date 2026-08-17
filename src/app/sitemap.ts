import type { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";
import { SITE_URL, languageAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return i18n.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === i18n.defaultLocale ? 1 : 0.9,
    alternates: { languages: languageAlternates() },
  }));
}
