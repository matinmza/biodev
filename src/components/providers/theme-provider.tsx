"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "matinos-theme";

interface ThemeContextValue {
  theme: Theme;
  /** undefined until hydrated — pair with a mounted guard before using. */
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Dark after 19:00 and before 07:00, in the visitor's own timezone. This is
 * what "system" resolves to: the desktop metaphor is the point of the site, so
 * it should be lit like a desk — bright during the day, dim at night — rather
 * than follow an OS switch most visitors never touched.
 */
const NIGHT_FROM = 19;
const NIGHT_UNTIL = 7;

const isNight = (at = new Date()) => {
  const hour = at.getHours();
  return hour >= NIGHT_FROM || hour < NIGHT_UNTIL;
};

// Storage can throw outright (Safari private mode, a blocked third-party
// context) — and this runs inside a state initializer, so an uncaught throw
// here takes the whole app down over a preference.
const readStoredTheme = (): Theme => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* storage blocked — fall back to the clock */
  }
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
};

const resolve = (theme: Theme): ResolvedTheme =>
  theme === "system" ? (isNight() ? "dark" : "light") : theme;

/**
 * Class-based dark mode without next-themes. The pre-hydration state is set
 * by the blocking inline THEME_INIT script in the layout, which applies this
 * same clock rule — so the first paint is already the right theme.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === "undefined" ? "system" : readStoredTheme()
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | undefined>(
    () => (typeof window === "undefined" ? undefined : resolve(readStoredTheme()))
  );

  // Keep the <html> classes in sync with the resolved theme.
  useEffect(() => {
    if (!resolvedTheme) return;
    const classes = document.documentElement.classList;
    classes.toggle("dark", resolvedTheme === "dark");
    classes.toggle("light", resolvedTheme === "light");
  }, [resolvedTheme]);

  // Re-check the clock when the tab comes back, so a page left open past
  // sunset is lit correctly the next time it is actually looked at.
  useEffect(() => {
    if (theme !== "system") return;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setResolvedTheme(isNight() ? "dark" : "light");
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked — the choice just will not survive a reload */
    }
    setThemeState(next);
    setResolvedTheme(resolve(next));
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
