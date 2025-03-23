"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { IoSunny, IoMoon } from "react-icons/io5";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2 bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] not-drag">
      <motion.button
        onClick={handleThemeChange}
        className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:bg-white/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute flex items-center justify-center w-full h-full bg-white rounded-2xl shadow-sm"
            >
              <IoSunny className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute flex items-center justify-center w-full h-full bg-white/80 rounded-2xl shadow-sm"
            >
              <IoMoon className="w-6 h-6 text-indigo-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
