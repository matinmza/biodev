import type { Metadata } from "next";
import "../globals.css";
import { i18n } from "@/i18n/config";
import { iranSans, sfPro } from "@/config/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={lang}>
      <body className={`${sfPro.variable} ${iranSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
