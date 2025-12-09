import { i18n } from "@/i18n/config";
import type { Locale } from "@/types/i18n";
import ReactGridLayoutContainer from "@/components/packages/react-grid-layout/react-grid-layout-container";
import LanguageToggle from "@/components/shared/language-toggle";
import BackgroundMain from "./_sections/background-main";
import Clock from "@/components/shared/clock";
import ImageSlider from "@/components/shared/image-slider";
import AboutMe from "@/components/shared/about-me";
import ThemeToggle from "@/components/shared/theme-toggle";
// import ColorGradient from "@/components/shared/color-gradient";
import LogoBox from "@/components/shared/logo-box";
import WorkCard from "@/components/shared/work-card";

const items = [
  // --- Row 1 ---
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
    y: 2, // اصلاح شده: زیر آیتم b قرار می‌گیرد
  },

  // --- Row 2 & 3 ---
  {
    component: (
      // اصلاح مهم: حذف absolute و transition که با درگ تداخل داشت
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <ImageSlider />
        </div>
      </div>
    ),
    height: 2,
    width: 1,
    key: "e",
    x: 0,
    y: 2, // اصلاح شده: زیر آیتم a قرار می‌گیرد
  },
  {
    component: (
      // اصلاح مهم: حذف absolute
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {/* <ColorGradient /> */}
          <LogoBox />
        </div>
      </div>
    ),
    height: 2,
    width: 1,
    key: "f",
    x: 0,
    y: 4, // اصلاح شده: زیر آیتم e قرار می‌گیرد
  },
  {
    component: (
      // اصلاح مهم: حذف absolute
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <div className="w-full h-full">
          <WorkCard icon="/images/works/ai-assistant.svg" />
        </div>
      </div>
    ),
    height: 2,
    width: 1,
    key: "g",
    x: 1,
    y: 4, // اصلاح شده: زیر آیتم c قرار می‌گیرد
  },
  {
    component: (
      // اصلاح مهم: حذف absolute
      <div className="rounded-3xl bg-amber-50/30 dark:bg-amber-900/20 backdrop-blur-xl w-full h-full flex items-center justify-center">
        <div className="w-full h-full">
          <WorkCard
            icon="/images/works/farda-ins.svg"
            bg="linear-gradient(-225deg, #ffffff50 0%, #FFffff80 48%, #FFffff40 100%)"
          />
        </div>
      </div>
    ),
    height: 2,
    width: 1, // عرض رو ۱ گذاشتم که کنار d جا بشه (اگر d عرضش ۲ هست و گرید ۴ ستونه‌ست)
    key: "h",
    x: 2, // اصلاح شده
    y: 4, // اصلاح شده: زیر آیتم d قرار می‌گیرد
  },
];

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

// تعریف تایپ دقیق برای Props
type Props = {
  params: Promise<{ lang: Locale }>;
};

// اضافه کردن async برای پشتیبانی از Next.js 16
export default async function Home({ params }: Props) {
  // اگر نیاز به lang داشتی، اینجا await کن:
  // const { lang } = await params;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <ReactGridLayoutContainer items={items} />
      </div>
      <BackgroundMain />
    </div>
  );
}
