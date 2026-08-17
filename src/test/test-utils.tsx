import { render } from "@testing-library/react";
import { I18nProvider } from "@/i18n/i18n-provider";
import { WindowProvider } from "@/components/desktop/window-context";
import en from "@/i18n/dictionaries/en.json";
import fa from "@/i18n/dictionaries/fa.json";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/translation";

const dictionaries: Record<Locale, Dictionary> = { en, fa };

/** Render a component inside the i18n + window-manager providers. */
export function renderWithProviders(
  ui: React.ReactNode,
  { lang = "en" as Locale } = {}
) {
  return render(
    <I18nProvider dict={dictionaries[lang]} lang={lang}>
      <WindowProvider>{ui}</WindowProvider>
    </I18nProvider>
  );
}
