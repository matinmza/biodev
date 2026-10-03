"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Grip } from "lucide-react";
import type { ResponsiveLayouts } from "react-grid-layout/legacy";
import { useI18n } from "@/i18n/i18n-provider";
import { LAYOUTS } from "./grid-geometry";

const SEEN_KEY = "matinos-drag-hint";
/** After the boot splash (≈900ms) has cleared. */
const START_MS = 1800;
const SWAP_BACK_MS = 1300;
const VISIBLE_MS = 7000;

/** Trade the positions of two widgets in every breakpoint's layout. */
export function swapWidgets(
  layouts: ResponsiveLayouts,
  a: string,
  b: string
): ResponsiveLayouts {
  return Object.fromEntries(
    Object.entries(layouts).map(([breakpoint, layout]) => {
      const first = layout?.find((item) => item.i === a);
      const second = layout?.find((item) => item.i === b);
      if (!layout || !first || !second) return [breakpoint, layout];
      return [
        breakpoint,
        layout.map((item) =>
          item.i === a
            ? { ...item, x: second.x, y: second.y }
            : item.i === b
              ? { ...item, x: first.x, y: first.y }
              : item
        ),
      ];
    })
  );
}

/**
 * First visit only: the clock and the photos trade places and come back, and
 * a short tip names the grip — the grips are hidden until hover on desktop,
 * so nothing else tells a visitor the widgets move. Reduced motion skips the
 * swap and keeps the tip.
 */
export function useDragHint() {
  const [layouts, setLayouts] = useState(LAYOUTS);
  const [active, setActive] = useState(false);

  const dismiss = useCallback(() => {
    setActive(false);
    setLayouts(LAYOUTS);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // No storage, no way to show it only once — skip it.
    }

    const timers = [
      setTimeout(() => {
        // Marked here, not on mount, so Strict Mode's double effect in
        // development doesn't spend the one showing on a cancelled run.
        try {
          localStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setActive(true);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setLayouts(swapWidgets(LAYOUTS, "clock", "photos"));
        }
      }, START_MS),
      setTimeout(() => setLayouts(LAYOUTS), START_MS + SWAP_BACK_MS),
      setTimeout(() => setActive(false), START_MS + VISIBLE_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return { layouts, active, dismiss };
}

/** The tip under the menu bar while the hint plays. */
export function DragHintToast({
  active,
  onDismiss,
}: {
  active: boolean;
  onDismiss: () => void;
}) {
  const { dict, lang } = useI18n();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          role="status"
          dir={lang === "fa" ? "rtl" : "ltr"}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          transition={{ type: "spring", damping: 24, stiffness: 300 }}
          className="glass fixed inset-x-0 top-12 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full py-1.5 pe-1.5 ps-3 text-sm text-zinc-800 dark:text-zinc-100"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/10 dark:bg-white/10">
            <Grip size={14} aria-hidden />
          </span>
          <span>{dict.hints.drag}</span>
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-9 shrink-0 rounded-full bg-black/80 px-3.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
          >
            {dict.hints.dismiss}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
