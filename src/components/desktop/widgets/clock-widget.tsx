"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { useMounted } from "@/hooks/use-mounted";
import { formatDate, formatTime, localizeDigits } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import WidgetShell from "../widget-shell";

/** Big OS clock — Jalali date in Persian, Gregorian in English. */
export default function ClockWidget() {
  const { lang } = useI18n();
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <WidgetShell contentClassName="flex flex-col items-center justify-center gap-1 p-4">
      {mounted && (
        <>
          <div
            dir="ltr"
            className={cn(
              "text-6xl font-medium tabular-nums text-zinc-900 dark:text-white",
              // SF Pro has no Persian digits — IRANSansX FaNum carries them.
              lang === "fa" ? "font-iran-sans" : "font-sf-pro tracking-tight"
            )}
          >
            {localizeDigits(formatTime(now), lang)}
          </div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {formatDate(now, lang)}
          </div>
        </>
      )}
    </WidgetShell>
  );
}
