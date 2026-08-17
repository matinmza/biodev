import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { i18n, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/translation";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://matinzarifamin.dev"
).replace(/\/$/, "");

/** BCP-47 tag for a locale, used in metadata and JSON-LD. */
export const ogLocale = (lang: Locale) => (lang === "fa" ? "fa_IR" : "en_US");

/** hreflang map plus x-default, so both languages are indexed correctly. */
export function languageAlternates(): Record<string, string> {
  const alternates: Record<string, string> = {
    "x-default": `${SITE_URL}/${i18n.defaultLocale}`,
  };
  for (const locale of i18n.locales) {
    alternates[locale === "fa" ? "fa-IR" : "en"] = `${SITE_URL}/${locale}`;
  }
  return alternates;
}

/**
 * Serialize JSON-LD for inline embedding. `<` is escaped so no value can
 * ever close the surrounding <script> tag.
 */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * schema.org graph: the person Google should show in a knowledge panel,
 * the site itself, and every project as a credited work.
 */
export function personJsonLd(dict: Dictionary, lang: Locale) {
  const personId = `${SITE_URL}/#matin`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: dict.profile.name,
        alternateName: `${profile.firstName} ${profile.lastName}`,
        jobTitle: dict.profile.role,
        description: dict.meta.description,
        email: profile.email,
        url: `${SITE_URL}/${lang}`,
        image: `${SITE_URL}/images/matin/matin1.png`,
        sameAs: [profile.social.github, profile.social.linkedin],
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.location.city,
          addressCountry: "IR",
        },
        worksFor: { "@type": "Organization", name: "Hiweb / Selfit" },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: dict.experience.education.school,
        },
        knowsLanguage: ["fa", "en"],
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Frontend Architecture",
          "Design Systems",
          "Web Performance",
          "Core Web Vitals",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/${lang}`,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: lang,
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
      ...projects.map((project) => ({
        "@type": "CreativeWork",
        name: dict.projects.items[project.id].name,
        abstract: dict.projects.items[project.id].tagline,
        description: dict.projects.items[project.id].description,
        inLanguage: lang,
        creator: { "@id": personId },
        keywords: project.stack.join(", "),
      })),
    ],
  };
}
