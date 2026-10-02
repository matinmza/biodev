import { profile } from "@/data/profile";
import { RESUME_UPDATED_ON, resume } from "@/data/resume";
import { projects } from "@/data/projects";
import { i18n, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/translation";

import { SITE_URL } from "./site";

export { SITE_URL };

/** The résumé page. English only, so the locale is hard-coded. */
export const RESUME_PAGE = "/en/resume";

/** The downloadable résumé, printed from `RESUME_PAGE` into `public/`. */
export const RESUME_PDF = "/matin-zarifamin-senior-frontend-engineer.pdf";

/**
 * Every spelling of the name worth being found by, in both scripts. Search
 * engines treat these as the same entity once they are declared together.
 */
export const NAME_VARIANTS = [
  "Matin Zarifamin",
  "Matin Zarif Amin",
  "متین ظریف‌امین",
  "متین ظریف امین",
  "matinmza",
];

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
        alternateName: NAME_VARIANTS,
        jobTitle: dict.profile.role,
        description: dict.meta.description,
        email: profile.email,
        // One canonical URL for the person across both locales and the résumé
        // page; the per-language address is the WebSite node's job below.
        url: `${SITE_URL}/${i18n.defaultLocale}`,
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

/**
 * schema.org for the résumé route. A `ProfilePage` wrapping the same Person
 * node as the home page is what lets Google treat the two as one entity, and
 * `hasOccupation` / `associatedMedia` is how the role and the downloadable PDF
 * get read as structured facts rather than page text.
 */
export function resumeJsonLd() {
  const personId = `${SITE_URL}/#matin`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}${RESUME_PAGE}#page`,
    url: `${SITE_URL}${RESUME_PAGE}`,
    name: `${resume.name} — ${resume.title}`,
    inLanguage: "en",
    dateModified: RESUME_UPDATED_ON,
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: resume.name,
      alternateName: NAME_VARIANTS,
      jobTitle: resume.title,
      description: resume.summary,
      email: resume.email,
      telephone: resume.phone,
      // Same `url` and `image` as the home page's node on purpose: two
      // different values under one @id is what stops search engines merging
      // them into a single entity.
      url: `${SITE_URL}/${i18n.defaultLocale}`,
      image: `${SITE_URL}/images/matin/matin1.png`,
      sameAs: [resume.github, resume.linkedin],
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.city,
        addressCountry: "IR",
      },
      hasOccupation: {
        "@type": "Occupation",
        name: resume.title,
        occupationalCategory: "15-1254.00",
        skills: resume.skills.flatMap((group) => group.items).join(", "),
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: resume.education.school,
      },
      knowsLanguage: ["fa", "en"],
    },
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: `${SITE_URL}${RESUME_PDF}`,
      encodingFormat: "application/pdf",
      name: `${resume.name} — résumé (PDF, A4)`,
    },
  };
}
