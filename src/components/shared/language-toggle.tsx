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
      className="flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-xs font-semibold transition-colors hover:bg-black/10 dark:hover:bg-white/10"
    >
      {lang === "fa" ? "EN" : "فا"}
    </button>
  );
}
