import type { Locale, Dictionary } from "@/types/i18n";

const dictionaries = {
  fa: () => import("./dictionaries/fa.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
