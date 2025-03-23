import { i18n } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Link from "next/link";
import type { Locale } from "@/types/i18n";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="font-iran-sans text-2xl font-bold">{dict.name}</div>
      <div className="font-sf-pro text-2xl font-bold">{dict.welcome}</div>
      <div className="mt-4">
        {i18n.locales.map((l) => (
          <Link
            key={l}
            href={`/${l}`}
            className={`mx-2 ${l === lang ? "text-blue-500" : "text-gray-500"}`}
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
