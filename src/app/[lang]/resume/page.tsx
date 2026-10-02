import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { i18n } from "@/i18n/config";
import { resume } from "@/data/resume";
import {
  NAME_VARIANTS,
  RESUME_PAGE,
  RESUME_PDF,
  SITE_URL,
  resumeJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import ResumeDocument from "@/components/resume/resume-document";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${resume.name} — ${resume.title} · Résumé`,
  description: resume.summary.slice(0, 200),
  keywords: NAME_VARIANTS.concat([
    "resume",
    "CV",
    "Senior Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Tehran",
  ]),
  alternates: { canonical: RESUME_PAGE },
  openGraph: {
    type: "profile",
    title: `${resume.name} — ${resume.title}`,
    description: resume.summary.slice(0, 200),
    url: `${SITE_URL}${RESUME_PAGE}`,
    locale: "en_US",
    // A route that declares its own `openGraph` does not inherit the
    // parent segment's opengraph-image file, so name it here or the
    // résumé shares as a bare link.
    images: [`${SITE_URL}/${i18n.defaultLocale}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: `${resume.name} — ${resume.title}`,
    description: resume.summary.slice(0, 200),
    images: [`${SITE_URL}/${i18n.defaultLocale}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

/**
 * The shareable résumé page. `npm run resume:pdf` prints this route into
 * `public/matin-zarifamin-senior-frontend-engineer.pdf`, so the link and the file never disagree.
 */
export default async function ResumePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="min-h-screen bg-zinc-200 py-6 print:bg-white print:py-0">
      <script
        type="application/ld+json"
        // Structured data, so the résumé and the home page resolve to one
        // person rather than two unrelated pages.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(resumeJsonLd()) }}
      />

      {/* Screen-only controls — `.no-print` strips them from the PDF. */}
      <div className="no-print mx-auto mb-5 flex max-w-[820px] flex-wrap items-center justify-between gap-3 px-4">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <ArrowLeft size={15} className="rtl:-scale-x-100" />
          MatinOS
        </Link>

        <a
          href={RESUME_PDF}
          download
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
        >
          <Download size={15} />
          Download PDF
        </a>
      </div>

      <ResumeDocument className="mx-auto max-w-[820px] shadow-xl print:max-w-none print:px-0 print:py-0 print:shadow-none" />
    </main>
  );
}
