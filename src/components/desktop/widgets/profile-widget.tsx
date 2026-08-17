"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";
import { useI18n } from "@/i18n/i18n-provider";
import { profile } from "@/data/profile";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/social-icons";
import WidgetShell from "../widget-shell";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45 } },
};

const chip =
  "flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/20";

/** The hero widget: who Matin is, in one glance. */
export default function ProfileWidget() {
  const { dict } = useI18n();

  return (
    <WidgetShell contentClassName="scrollbar-ios overflow-y-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="flex h-full flex-col gap-4 p-6"
      >
        <motion.div variants={item} className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/50 dark:ring-white/20">
            <Image
              src="/images/matin/matin1.png"
              alt={dict.photos.alt}
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-zinc-900 rtl:tracking-normal dark:text-white">
              {dict.profile.name}
            </h1>
            <p className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-sm font-semibold text-transparent">
              {dict.profile.role}
            </p>
          </div>
        </motion.div>

        <motion.p
          variants={item}
          className="text-lg font-medium leading-snug text-zinc-800 dark:text-zinc-100"
        >
          {dict.profile.tagline}
        </motion.p>

        <motion.p
          variants={item}
          className="text-sm leading-7 text-zinc-700 dark:text-zinc-200"
        >
          {dict.profile.summary}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-auto flex flex-wrap items-center gap-2 pt-1"
        >
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={chip}
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            {dict.profile.cta.github}
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={chip}
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            {dict.profile.cta.linkedin}
          </a>
          <a href={profile.social.email} className={chip}>
            <Mail size={13} />
            {dict.profile.cta.email}
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-zinc-700 dark:text-zinc-300"
        >
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {dict.profile.location}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {dict.profile.availability}
          </span>
        </motion.div>
      </motion.div>
    </WidgetShell>
  );
}
