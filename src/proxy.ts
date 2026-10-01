import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n, matchLocale } from "./i18n/config";

/** Locale routing: send visitors without a locale prefix to their language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const locale = matchLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  // Pages only. Anything with a file extension is a real file in `public/`
  // (the résumé PDF, icons, the manifest) or a metadata route — redirecting
  // those under a locale prefix would 404 them.
  matcher: ["/((?!api|_next|images|.*\\.).*)"],
};
