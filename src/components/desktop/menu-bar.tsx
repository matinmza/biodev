"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useI18n } from "@/i18n/i18n-provider";
import { useMounted } from "@/hooks/use-mounted";
import { profile } from "@/data/profile";
import { formatTime, localizeDigits } from "@/lib/datetime";
import ThemeToggle from "@/components/shared/theme-toggle";
import LanguageToggle from "@/components/shared/language-toggle";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/social-icons";
import {
  SoftIconLink,
  SOFT_GRADIENTS,
} from "@/components/shared/soft-icon-button";

function MenuClock() {
  const { lang } = useI18n();
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <span className="min-w-10" />;

  return (
    <span className="min-w-10 text-center text-xs font-semibold tabular-nums">
      {localizeDigits(formatTime(now), lang)}
    </span>
  );
}

/** System bar: who you're looking at on one side, controls on the other. */
export default function MenuBar() {
  const { dict } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-11 items-center justify-between gap-2 border-b border-white/50 bg-white/75 px-2.5 text-zinc-800 backdrop-blur-2xl sm:px-4 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100">
      <div className="flex min-w-0 items-center gap-2">
        <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/20">
          <Image
            src="/images/matin/matin1.png"
            alt=""
            fill
            sizes="24px"
            className="object-cover"
          />
        </span>
        <span className="truncate text-sm font-semibold tracking-tight">
          {dict.profile.name}
        </span>
        <span className="hidden shrink-0 rounded-full bg-black/[0.06] px-2 py-0.5 text-[11px] font-medium text-zinc-600 sm:inline dark:bg-white/10 dark:text-zinc-300">
          {dict.profile.role}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <SoftIconLink
          href={profile.social.github}
          label={dict.profile.cta.github}
          gradient={SOFT_GRADIENTS.github}
          external
        >
          <GitHubIcon className="h-3.5 w-3.5" />
        </SoftIconLink>
        <SoftIconLink
          href={profile.social.linkedin}
          label={dict.profile.cta.linkedin}
          gradient={SOFT_GRADIENTS.linkedin}
          external
        >
          <LinkedInIcon className="h-3.5 w-3.5" />
        </SoftIconLink>
        <SoftIconLink
          href={profile.social.email}
          label={dict.profile.cta.email}
          gradient={SOFT_GRADIENTS.mail}
        >
          <Mail size={14} strokeWidth={2} />
        </SoftIconLink>

        <span className="mx-0.5 h-4 w-px bg-black/15 dark:bg-white/15" />
        <LanguageToggle />
        <ThemeToggle />
        <span className="mx-0.5 hidden h-4 w-px bg-black/15 sm:block dark:bg-white/15" />
        <span className="hidden sm:block">
          <MenuClock />
        </span>
      </div>
    </header>
  );
}
