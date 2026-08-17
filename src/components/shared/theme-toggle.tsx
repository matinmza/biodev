"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/i18n-provider";
import { useMounted } from "@/hooks/use-mounted";

/** Compact menu-bar theme switch. */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { dict } = useI18n();
  const mounted = useMounted();

  if (!mounted) return <div className="h-7 w-7" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={dict.menu.themeToggle}
      title={dict.menu.themeToggle}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-zinc-700 transition-all hover:bg-black/[0.12] hover:scale-105 active:scale-95 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/20"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {isDark ? (
            <Moon size={14} strokeWidth={1.75} />
          ) : (
            <Sun size={14} strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
