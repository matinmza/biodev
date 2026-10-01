"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n/i18n-provider";
import BoltLogo from "./bolt-logo";

const BOOT_KEY = "matinos-booted";

/** Nothing mutates this outside our own render, so there is nothing to subscribe to. */
const noSubscribe = () => () => {};
const hasBooted = () => {
  try {
    return sessionStorage.getItem(BOOT_KEY) !== null;
  } catch {
    return true; // storage blocked — just skip the splash
  }
};

/**
 * OS-style boot splash, shown once per browser session.
 * Total run is ~1.6s so it delights without ever annoying.
 */
export default function BootScreen() {
  const { dict } = useI18n();
  const reducedMotion = useReducedMotion();
  // The server has no sessionStorage, so it always renders "already booted"
  // and the client agrees on the hydrating render — reading storage while
  // choosing the first render is what makes the two disagree, and React
  // throws out the whole tree when they do.
  const booted = useSyncExternalStore(noSubscribe, hasBooted, () => true);
  const [dismissed, setDismissed] = useState(false);
  const booting = !booted && !dismissed;

  const finish = () => {
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* storage blocked — the splash simply shows again next time */
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {booting && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#0a0b10]"
          aria-label={dict.boot.loading}
          role="status"
        >
          <motion.div
            initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <BoltLogo className="h-16 w-16 drop-shadow-[0_0_24px_rgba(0,204,255,0.5)]" />
            <div className="font-sf-pro text-2xl font-semibold tracking-tight text-white">
              {dict.menu.os}
            </div>
            <div className="text-sm text-white/50">{dict.boot.tagline}</div>
          </motion.div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{
                duration: reducedMotion ? 0.1 : 1.1,
                delay: reducedMotion ? 0 : 0.3,
                ease: "easeInOut",
              }}
              onAnimationComplete={finish}
              className="h-full w-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
