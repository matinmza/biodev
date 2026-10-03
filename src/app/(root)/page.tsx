import type { Metadata } from "next";
import Link from "next/link";
import { pickLocale } from "@/i18n/config";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Matin Zarifamin",
  alternates: { canonical: `${SITE_URL}/en` },
  robots: { index: false },
};

// The static export has no server to redirect `/`, so the browser does it
// before first paint. `replace` keeps `/` out of the back-button history.
const REDIRECT = `location.replace("/" + (${pickLocale.toString()})(navigator.languages || [navigator.language], Intl.DateTimeFormat().resolvedOptions().timeZone) + location.search + location.hash)`;

export default function RootRedirect() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en" />
      </noscript>
      <p>
        <Link href="/en">English</Link> · <Link href="/fa">فارسی</Link>
      </p>
    </>
  );
}
