"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/i18n/i18n-provider";

/** Menu-bar language switch — swaps the locale segment of the URL. */
export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, lang } = useI18n();

  const nextLang = lang === "fa" ? "en" : "fa";

  const switchLanguage = () => {
    const nextPath = pathname.replace(`/${lang}`, `/${nextLang}`);
    router.push(nextPath);
  };

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={dict.menu.langToggle}
      title={dict.menu.langToggle}
      className="flex h-7 min-w-7 items-center justify-center rounded-full bg-black/[0.06] px-2 text-xs font-semibold text-zinc-700 transition-all hover:bg-black/[0.12] hover:scale-105 active:scale-95 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/20"
    >
      {lang === "fa" ? "EN" : "فا"}
    </button>
  );
}
