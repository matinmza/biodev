"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";
import { useMounted } from "@/hooks/use-mounted";
import { wallpapers } from "@/data/shots.generated";

/**
 * Full-screen desktop wallpaper that cross-slides on theme change.
 *
 * Painted in CSS (see `.wallpaper-*` in globals.css) unless a photo has been
 * dropped into `public/images/wallpaper-light.*` / `-dark.*`, which the build
 * indexes automatically. The CSS version is the default because the photo this
 * replaced was a 3 MB JPEG and therefore the page's largest-contentful paint —
 * gradients paint on the first frame, with nothing to download or decode.
 */
export default function Wallpaper() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  // Pre-hydration the theme is unknown; the CSS variable already carries the
  // right ground colour for the OS preference.
  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-(--desktop-ground)" />;
  }

  const isDark = resolvedTheme === "dark";
  const photo = wallpapers[isDark ? "dark" : "light"];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-(--desktop-ground)">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={resolvedTheme}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {photo ? (
            <Image
              src={photo}
              alt=""
              fill
              priority
              sizes="100vw"
              className={isDark ? "object-cover brightness-[0.68]" : "object-cover"}
            />
          ) : (
            <div
              className={`wallpaper ${isDark ? "wallpaper-dark" : "wallpaper-light"}`}
            />
          )}
          {/* Readability layer between wallpaper and glass widgets. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/25" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
