import { ImageResponse } from "next/og";
import { i18n, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { profile } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Matin Zarifamin — Frontend Team Lead";

/** Prerender the card for both locales so crawlers never wait on it. */
export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

/** Social preview card: the bolt mark, the name, the role, the numbers. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "en");

  // The card is always Latin — Persian glyphs would need a bundled font.
  const name = `${profile.firstName} ${profile.lastName}`;
  const stats = [
    ["5+", "years"],
    ["900K+", "users"],
    ["60+", "components"],
    ["4", "person team"],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 120% at 12% 0%, #182033 0%, #0a0b10 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 256 256">
            <defs>
              <linearGradient id="og-bolt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00CCFF" />
                <stop offset="100%" stopColor="#8866FF" />
              </linearGradient>
            </defs>
            <path
              d="M113.14 26.767c4.175-6.958 14.86-3.998 14.86 4.116v50.784a7 7 0 007 7h78.87c6.219 0 10.06 6.783 6.86 12.116l-77.87 129.784c-4.175 6.957-14.86 3.998-14.86-4.116v-50.784a7 7 0 00-7-7H42.13c-6.219 0-10.06-6.784-6.86-12.116z"
              fill="url(#og-bolt)"
            />
          </svg>
          <div style={{ fontSize: 26, color: "#8B93A7", letterSpacing: 2 }}>
            {dict.menu.os.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
            {name}
          </div>
          <div style={{ fontSize: 40, color: "#00CCFF", fontWeight: 600 }}>
            Frontend Team Lead
          </div>
          <div style={{ fontSize: 28, color: "#A7AEBF", maxWidth: 900 }}>
            React &amp; Next.js · AI products, real-time dashboards, design
            systems
          </div>
        </div>

        <div style={{ display: "flex", gap: 56 }}>
          {stats.map(([value, label]) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <div style={{ fontSize: 40, fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: 22, color: "#8B93A7" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
