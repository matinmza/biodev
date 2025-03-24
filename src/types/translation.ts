import en from "@/i18n/locales/en.json";

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? K extends string
          ? `${K}.${DeepKeys<T[K]>}`
          : never
        : K extends string
        ? K
        : never;
    }[keyof T]
  : never;

export type Translation = typeof en;

export type TranslationKey = DeepKeys<Translation>;
