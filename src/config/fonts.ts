import localFont from "next/font/local";

/**
 * Only the weights actually used ship to the client.
 * IRANSansX carries Persian text; SF Pro Display carries Latin/UI text.
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
});

export const sfPro = localFont({
  src: [
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/sanFranciscoPro/fonts/SF-Pro-Display-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});
