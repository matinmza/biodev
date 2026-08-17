"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/types/translation";
import type { Locale } from "@/i18n/config";

interface I18nContextValue {
  dict: Dictionary;
  lang: Locale;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  dict,
  lang,
  children,
}: I18nContextValue & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ dict, lang }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Access the active dictionary and locale from any client component. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
