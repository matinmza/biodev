"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n/i18n-provider";
import WidgetShell from "../widget-shell";

const PHOTOS = [
  "/images/matin/matin1.png",
  "/images/matin/matin2.png",
  "/images/matin/matin3.png",
  "/images/matin/matin4.png",
];

const INTERVAL_MS = 5000;

/** Ambient photo frame: slow cross-fade with a gentle Ken Burns drift. */
export default function PhotoWidget() {
  const { dict } = useI18n();
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % PHOTOS.length),
      INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, [reducedMotion]);

  return (
    <WidgetShell contentClassName="relative">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={PHOTOS[index]}
            alt={dict.photos.alt}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${dict.photos.widgetTitle} ${i + 1}`}
            className={
              i === index
                ? "h-1.5 w-4 rounded-full bg-white/90 transition-all"
                : "h-1.5 w-1.5 rounded-full bg-white/50 transition-all hover:bg-white/70"
            }
          />
        ))}
      </div>
    </WidgetShell>
  );
}
