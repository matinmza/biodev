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

const systemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const readStoredTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
};

const resolve = (theme: Theme): ResolvedTheme =>
  theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;

/**
 * Class-based dark mode without next-themes. The pre-hydration state is
 * handled by /theme-init.js plus a CSS media-query fallback, so React
 * never has to render an inline <script>.
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

  // Follow OS-level changes while in system mode.
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () =>
      setResolvedTheme(query.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
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
