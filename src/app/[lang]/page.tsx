import { i18n } from "@/i18n/config";
import type { Locale } from "@/types/i18n";

import ReactGridLayoutContainer from "@/components/packages/react-grid-layout/react-grid-layout-container";
import LanguageToggle from "@/components/shared/language-toggle";
import ThemeToggle from "@/components/shared/theme-toggle";

const items = [
  {
    component: (
      <div className="rounded-3xl bg-blue-50/30 dark:bg-blue-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <LanguageToggle />
      </div>
    ),
    height: 2,
    width: 1,
    key: "a",
    x: 0,
  },

  {
    component: (
      <div className="rounded-3xl bg-purple-50/30 dark:bg-purple-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <ThemeToggle />
      </div>
    ),
    height: 2,
    width: 1,
    key: "b",
    x: 1,
  },

  {
    component: (
      <div className="rounded-3xl bg-pink-50/30 dark:bg-pink-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center"></div>
    ),
    height: 2,
    width: 1,
    key: "c",
    x: 2,
  },
  {
    component: (
      <div className="rounded-3xl bg-emerald-50/30 dark:bg-emerald-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <div className="rounded-3xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300">
          {/* <IconPack /> */}
        </div>
      </div>
    ),
    height: 4,
    width: 2,
    key: "d",
    x: 3,
  },
  {
    component: (
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "e",
    x: 0,
  },
  {
    component: (
      <div className="rounded-3xl bg-rose-50/30 dark:bg-rose-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "f",
    x: 1,
  },
  {
    component: (
      <div className="rounded-3xl bg-indigo-50/30 dark:bg-indigo-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "g",
    x: 2,
  },
  {
    component: (
      <div className="rounded-3xl bg-teal-50/30 dark:bg-teal-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "h",
    x: 3,
  },
  {
    component: (
      <div className="rounded-3xl bg-violet-50/30 dark:bg-violet-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "i",
    x: 0,
  },
  {
    component: (
      <div className="rounded-3xl bg-cyan-50/30 dark:bg-cyan-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "j",
    x: 1,
  },
  {
    component: (
      <div className="rounded-3xl bg-fuchsia-50/30 dark:bg-fuchsia-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "k",
    x: 2,
  },
  {
    component: (
      <div className="rounded-3xl bg-sky-50/30 dark:bg-sky-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300"></div>
    ),
    height: 2,
    width: 1,
    key: "l",
    x: 3,
  },
];

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function Home({
  params: {},
}: {
  params: { lang: Locale };
}) {
  return (
    <div>
      <div className="container mx-auto">
        <ReactGridLayoutContainer items={items} />
      </div>
    </div>
  );
}
