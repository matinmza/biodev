"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/i18n-provider";
import { i18n, type Locale } from "@/i18n/config";
import { FlagGB, FlagIR } from "./flag-icons";
import { cn } from "@/lib/utils";

const FLAGS: Record<Locale, typeof FlagGB> = { en: FlagGB, fa: FlagIR };

/**
 * iOS segmented control: both flags always visible, a sliding pill marks
 * the active language so the choice is obvious before clicking.
 */
export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, lang } = useI18n();

  const labels: Record<Locale, string> = {
    en: dict.menu.english,
    fa: dict.menu.persian,
  };

  const switchTo = (next: Locale) => {
    if (next === lang) return;
    router.push(pathname.replace(`/${lang}`, `/${next}`));
  };

  return (
    <div
      dir="ltr"
      role="group"
      aria-label={dict.menu.langToggle}
      className="flex items-center gap-0.5 rounded-full bg-black/[0.06] p-0.5 shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)] dark:bg-white/10"
    >
      {i18n.locales.map((locale) => {
        const Flag = FLAGS[locale];
        const isActive = locale === lang;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-label={labels[locale]}
            title={labels[locale]}
            aria-pressed={isActive}
            className="relative flex h-6 w-7 items-center justify-center rounded-full"
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.2)] dark:bg-white/25"
              />
            )}
            <span
              className={cn(
                "relative h-4 w-[22px] overflow-hidden rounded-[4px] shadow-[0_1px_2px_rgb(0_0_0/0.28),inset_0_0_0_0.5px_rgb(255_255_255/0.4)] transition-all duration-200",
                isActive
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-55 hover:scale-100 hover:opacity-90"
              )}
            >
              <Flag />
            </span>
          </button>
        );
      })}
    </div>
  );
}
