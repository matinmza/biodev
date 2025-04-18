"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const BackgroundMain = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <AnimatePresence>
          <motion.div
            key={theme}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={`/images/${
                theme === "dark" ? "dark-background" : "background"
              }.jpg`}
              alt="Background"
              fill
              priority
              quality={100}
              className={cn("object-fill", {
                "brightness-75": theme === "dark",
              })}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default BackgroundMain;
