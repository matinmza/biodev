import type { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matinzarifamin.dev";
  return i18n.locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === i18n.defaultLocale ? 1 : 0.8,
  }));
}
