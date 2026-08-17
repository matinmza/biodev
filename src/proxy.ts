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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)",
  ],
};
