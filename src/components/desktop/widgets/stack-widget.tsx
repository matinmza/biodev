"use client";

import { stack } from "@/data/profile";
import WidgetShell from "../widget-shell";

function TrackChips() {
  return (
    <>
      {stack.map((tech) => (
        <span
          key={tech}
          className="mx-1.5 inline-flex shrink-0 items-center rounded-full border border-black/10 bg-white/60 px-3.5 py-1.5 font-mono text-xs font-medium text-zinc-800 dark:border-white/15 dark:bg-white/10 dark:text-zinc-100"
        >
          {tech}
        </span>
      ))}
    </>
  );
}

/** Infinite marquee of the working stack. Pauses on hover. */
export default function StackWidget() {
  return (
    <WidgetShell contentClassName="marquee relative flex items-center overflow-hidden">
      <div dir="ltr" className="marquee-track flex w-max items-center">
        <TrackChips />
        {/* Second copy makes the loop seamless; hidden from the a11y tree. */}
        <span aria-hidden="true" className="flex items-center">
          <TrackChips />
        </span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 start-0 w-12 bg-gradient-to-r from-white/40 to-transparent dark:from-black/30" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-12 bg-gradient-to-l from-white/40 to-transparent dark:from-black/30" />
    </WidgetShell>
  );
}
