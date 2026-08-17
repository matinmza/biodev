"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";

/** Full-screen desktop wallpaper that cross-slides on theme change. */
export default function Wallpaper() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-(--desktop-ground)" />;
  }

  const isDark = resolvedTheme === "dark";

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
          <Image
            src={isDark ? "/images/dark-background.jpg" : "/images/background.jpg"}
            alt=""
            fill
            priority
            sizes="100vw"
            className={isDark ? "object-cover brightness-[0.6]" : "object-cover"}
          />
          {/* Readability layer between wallpaper and glass widgets. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
