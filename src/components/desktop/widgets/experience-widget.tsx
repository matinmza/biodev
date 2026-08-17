"use client";

import { GraduationCap } from "lucide-react";
import { useI18n } from "@/i18n/i18n-provider";
import WidgetShell from "../widget-shell";

/** Career timeline: roles, then the education footnote. */
export default function ExperienceWidget() {
  const { dict } = useI18n();
  const { items, education } = dict.experience;

  return (
    <WidgetShell
      title={dict.experience.widgetTitle}
      contentClassName="scrollbar-ios overflow-y-auto px-5 pb-4 pt-3"
    >
      <ol className="relative space-y-5 border-s border-black/10 ps-4 dark:border-white/15">
        {items.map((job) => (
          <li key={job.company} className="relative">
            <span className="absolute -start-[21.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-b from-accent-cyan to-accent-violet ring-4 ring-white/40 dark:ring-black/30" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {job.company}
              </h3>
              <span className="font-mono text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
                {job.period}
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {job.role}
            </p>
            <ul className="mt-1.5 space-y-1">
              {job.points.map((point) => (
                <li
                  key={point}
                  className="text-xs leading-5 text-zinc-600 dark:text-zinc-400"
                >
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center gap-2 border-t border-black/5 pt-3 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        <GraduationCap size={14} className="shrink-0" />
        <span>
          {education.degree} · {education.school} · {education.period}
        </span>
      </div>
    </WidgetShell>
  );
}
