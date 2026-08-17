import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS: the bolt mark on the desktop ground colour. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b10",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 256 256">
          <defs>
            <linearGradient id="apple-bolt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00CCFF" />
              <stop offset="100%" stopColor="#8866FF" />
            </linearGradient>
          </defs>
          <path
            d="M113.14 26.767c4.175-6.958 14.86-3.998 14.86 4.116v50.784a7 7 0 007 7h78.87c6.219 0 10.06 6.783 6.86 12.116l-77.87 129.784c-4.175 6.957-14.86 3.998-14.86-4.116v-50.784a7 7 0 00-7-7H42.13c-6.219 0-10.06-6.784-6.86-12.116z"
            fill="url(#apple-bolt)"
          />
        </svg>
      </div>
    ),
    size
  );
}
