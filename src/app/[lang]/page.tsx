import { i18n } from "@/i18n/config";
import type { Locale } from "@/types/i18n";

import ReactGridLayoutContainer from "@/components/packages/react-grid-layout/react-grid-layout-container";
import LanguageToggle from "@/components/shared/language-toggle";

import BackgroundMain from "./_sections/background-main";
import Clock from "@/components/shared/clock";

import ImageSlider from "@/components/shared/image-slider";
import AboutMe from "@/components/shared/about-me";
import ThemeToggle from "@/components/shared/theme-toggle";
import ColorGradient from "@/components/shared/color-gradient";
import LogoBox from "@/components/shared/logo-box";
import WorkCard from "@/components/shared/work-card";
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
    y: 0,
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
    y: 0,
  },
  {
    component: (
      <div className="rounded-3xl bg-emerald-50/30 dark:bg-emerald-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <AboutMe />
      </div>
    ),
    height: 4,
    width: 2,
    key: "d",
    x: 2,
    y: 0,
  },
  {
    component: (
      <div className="rounded-3xl bg-pink-50/30 dark:bg-pink-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <Clock />
      </div>
    ),
    height: 2,
    width: 1,
    key: "c",
    x: 1,
    y: 1,
  },

  // Row 2
  {
    component: (
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300">
        <div className="relative w-full h-full">
          <ImageSlider />
        </div>
      </div>
    ),
    height: 2,
    width: 1,
    key: "e",
    x: 0,
  },
  {
    component: (
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300">
        <div className="relative w-full h-full w-40 h-40 overflow-hidden">
          {/* <ColorGradient /> */}
          <LogoBox />
        </div>
      </div>
    ),
    height: 2,
    width: 1,
    key: "f",
    x: 0,
    y: 2,
  },
  {
    component: (
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center transition-all duration-300 absolute top-0 delay-300">
        <div className=" w-full h-full">
          <WorkCard />
        </div>
      </div>
    ),
    height: 2,
    width: 1,
    key: "g",
    x: 1,
    y: 2,
  },
];

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default function Home({ params: {} }: { params: { lang: Locale } }) {
  return (
    <div>
      <div className="container mx-auto">
        <ReactGridLayoutContainer items={items} />
      </div>
      <BackgroundMain />
    </div>
  );
}
