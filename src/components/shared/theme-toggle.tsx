"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
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
    <div className="relative flex items-center justify-center w-16 h-16 bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] not-drag">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: theme === "light" ? 0 : 180,
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={handleThemeChange}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-black shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute"
            animate={{
              opacity: theme === "light" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <IoSunny className="w-6 h-6 text-orange-500" />
          </motion.div>
          <motion.div
            className="absolute"
            animate={{
              opacity: theme === "dark" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <IoMoon className="w-6 h-6 text-indigo-500" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ThemeToggle;
