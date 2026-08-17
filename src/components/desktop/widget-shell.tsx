"use client";

import { Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";

interface WidgetShellProps {
  title?: string;
  /** "glass" is the default widget look; "terminal" is always-dark chrome. */
  variant?: "glass" | "terminal";
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

/**
 * Glass container every widget lives in. The `.drag-handle` grip is the
 * only draggable area, so widget content stays fully interactive.
 */
export default function WidgetShell({
  title,
  variant = "glass",
  className,
  contentClassName,
  children,
}: WidgetShellProps) {
  const { dict, lang } = useI18n();

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-widget",
        variant === "glass"
          ? "glass"
          : "border border-white/10 bg-[#0d1117]/90 shadow-[0_8px_32px_rgb(0_0_0/0.35)] backdrop-blur-xl",
        className
      )}
    >
      <div
        className="drag-handle absolute end-2.5 top-2.5 z-20 cursor-grab rounded-full bg-black/10 p-1.5 text-black/50 backdrop-blur-md transition-opacity duration-300 active:cursor-grabbing lg:opacity-0 lg:group-hover:opacity-100 dark:bg-white/10 dark:text-white/50"
        title={dict.a11y.dragHint}
      >
        <Grip size={13} />
      </div>

      {title && (
        <div className="widget-title shrink-0 px-5 pt-4">{title}</div>
      )}

      <div className={cn("min-h-0 flex-1", contentClassName)}>{children}</div>
    </div>
  );
}
