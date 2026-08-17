"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useI18n } from "@/i18n/i18n-provider";
import { useMounted } from "@/hooks/use-mounted";
import { profile } from "@/data/profile";
import { formatTime, localizeDigits } from "@/lib/datetime";
import ThemeToggle from "@/components/shared/theme-toggle";
import LanguageToggle from "@/components/shared/language-toggle";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/social-icons";
import BoltLogo from "./bolt-logo";

function MenuClock() {
  const { lang } = useI18n();
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <span className="w-10" />;

  return (
    <span className="w-10 text-center text-xs font-medium tabular-nums">
      {localizeDigits(formatTime(now), lang)}
    </span>
  );
}

const iconLink =
  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10";

/** macOS-style system bar: identity on one side, controls on the other. */
export default function MenuBar() {
  const { dict } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-10 items-center justify-between border-b border-white/40 bg-white/55 px-3 text-zinc-800 backdrop-blur-2xl sm:px-4 dark:border-white/10 dark:bg-zinc-900/55 dark:text-zinc-100">
      <div className="flex items-center gap-2">
        <BoltLogo className="h-4 w-4" />
        <span className="text-sm font-semibold tracking-tight">
          {dict.menu.os}
        </span>
        <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:inline">
          — {dict.profile.name}
        </span>
      </div>

      <div className="flex items-center gap-0.5">
        <a
          href={profile.social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.profile.cta.github}
          className={iconLink}
        >
          <GitHubIcon />
        </a>
        <a
          href={profile.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.profile.cta.linkedin}
          className={iconLink}
        >
          <LinkedInIcon />
        </a>
        <a
          href={profile.social.email}
          aria-label={dict.profile.cta.email}
          className={iconLink}
        >
          <Mail size={15} />
        </a>
        <span className="mx-1 h-4 w-px bg-black/15 dark:bg-white/15" />
        <LanguageToggle />
        <ThemeToggle />
        <span className="mx-1 h-4 w-px bg-black/15 dark:bg-white/15" />
        <MenuClock />
      </div>
    </header>
  );
}
