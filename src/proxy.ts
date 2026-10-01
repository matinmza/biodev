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

  // Vercel's geo header, with Cloudflare's as a fallback so the behaviour
  // survives a move off Vercel. Both are set by the edge, not the client.
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");

  const locale = matchLocale(request.headers.get("accept-language"), country);
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  // Pages only. Anything with a file extension is a real file in `public/`
  // (the résumé PDF, icons, the manifest) or a metadata route — redirecting
  // those under a locale prefix would 404 them.
  matcher: ["/((?!api|_next|images|.*\\.).*)"],
};
