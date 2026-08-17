import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { i18n, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/i18n-provider";
import { iranSans, sfPro } from "@/config/fonts";
import { profile } from "@/data/profile";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

/** Narrow the URL segment to a supported locale or 404. */
async function resolveLocale(params: Props["params"]): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://matinzarifamin.dev"
    ),
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    authors: [{ name: dict.profile.name, url: profile.social.github }],
    creator: dict.profile.name,
    alternates: {
      languages: { en: "/en", fa: "/fa" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "profile",
      locale: lang === "fa" ? "fa_IR" : "en_US",
      images: [{ url: "/images/matin/matin1.png", alt: dict.profile.name }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dfe3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b10" },
  ],
};

export default async function RootLayout({ children, params }: Props) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={lang === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={cn(
          sfPro.variable,
          iranSans.variable,
          "scrollbar-ios antialiased",
          lang === "fa" ? "font-iran-sans" : "font-sf-pro"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider dict={dict} lang={lang}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
