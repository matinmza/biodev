import localFont from "next/font/local";

/**
 * Only the weights actually used ship to the client.
 * IRANSansX carries Persian text; SF Pro Display carries Latin/UI text.
 *
 * The SF Pro files are subset woff2, rebuilt by `scripts/subset-fonts.py` from
 * the vendor .otf originals — the shipped .woff files were 530 KB of
 * high-priority bytes for a few thousand glyphs this site never renders.
 */
export const iranSans = localFont({
  src: [
    {
      path: "../assets/fonts/iranSans/fonts/Woff2/IRANSansXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranSans/fonts/Woff2/IRANSansXFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranSans/fonts/Woff2/IRANSansXFaNum-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranSans/fonts/Woff2/IRANSansXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
  // Not preloaded: next/font preloads a face wherever its module is imported,
  // and the layout imports both, so preloading would push four Persian files
  // at every English visitor. The @font-face rules still ship, so /fa picks
  // them up as soon as the stylesheet is parsed.
  preload: false,
});

export const sfPro = localFont({
  src: [
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});
