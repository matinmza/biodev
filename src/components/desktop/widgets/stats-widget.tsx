"use client";

import { useI18n } from "@/i18n/i18n-provider";
import WidgetShell from "../widget-shell";

const STAT_KEYS = ["years", "users", "components", "lighthouse"] as const;

/** Career impact, in four numbers pulled straight from real launches. */
export default function StatsWidget() {
  const { dict } = useI18n();

  return (
    <WidgetShell contentClassName="grid grid-cols-2 items-center gap-2 px-4 py-3 sm:grid-cols-4">
      {/* Rendered plain, not faded in: these numbers are in the server HTML,
          and a staggered entrance would hide them for half a second after the
          page is already readable. */}
      {STAT_KEYS.map((key) => {
        const stat = dict.stats.items[key];
        return (
          <div
            key={key}
            className="flex flex-col items-center gap-0.5 text-center"
          >
            <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-2xl font-bold tabular-nums text-transparent">
              {stat.value}
            </span>
            <span className="text-[11px] font-medium leading-tight text-zinc-700 dark:text-zinc-300">
              {stat.label}
            </span>
          </div>
        );
      })}
    </WidgetShell>
  );
}
