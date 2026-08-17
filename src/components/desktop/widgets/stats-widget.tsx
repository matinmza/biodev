"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/i18n-provider";
import WidgetShell from "../widget-shell";

const STAT_KEYS = ["years", "users", "components", "lighthouse"] as const;

/** Career impact, in four numbers pulled straight from real launches. */
export default function StatsWidget() {
  const { dict } = useI18n();

  return (
    <WidgetShell contentClassName="grid grid-cols-2 items-center gap-2 px-4 py-3 sm:grid-cols-4">
      {STAT_KEYS.map((key, i) => {
        const stat = dict.stats.items[key];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            className="flex flex-col items-center gap-0.5 text-center"
          >
            <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-2xl font-bold tabular-nums text-transparent">
              {stat.value}
            </span>
            <span className="text-[11px] leading-tight text-zinc-600 dark:text-zinc-400">
              {stat.label}
            </span>
          </motion.div>
        );
      })}
    </WidgetShell>
  );
}
