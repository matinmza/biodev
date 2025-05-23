import { i18n } from "@/i18n/config";

export type Locale = (typeof i18n)["locales"][number];

export interface Dictionary {
  welcome: string;
  name: string;
}
