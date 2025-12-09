"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const BackgroundMain = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // جلوگیری از فلش سفید: اگر هنوز کلاینت لود نشده، بجای null،
  // یک دیو با رنگ پس‌زمینه سایت نشون میدیم که چشم کاربر اذیت نشه.
  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-background" />;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* 
        ⭐️ نکته کلیدی ۱: initial={false} 
        این دستور به Framer Motion میگه: "وقتی برای اولین بار این کامپوننت لود شد 
        (چه موقع رفرش، چه تغییر زبان)، انیمیشن ورود رو اجرا نکن!"
        فقط وقتی اجرا کن که کلید (key) تغییر کرد.
      */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          // فقط وقتی resolvedTheme عوض بشه (تیره/روشن)، این کلید عوض میشه و انیمیشن اجرا میشه
          key={resolvedTheme} 
          
          // استایل اولیه (برای عکس جدید که قراره وارد بشه)
          initial={{ x: "100%" }} 
          
          // استایل نهایی (حالت ثابت)
          animate={{ x: 0 }} 
          
          // استایل خروج (برای عکس قدیمی که قراره بره بیرون)
          exit={{ x: "-100%" }} 
          
          // تنظیمات زمان‌بندی (نرم و روان)
          transition={{ duration: 0.6, ease: "easeInOut" }}
          
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={`/images/${
              resolvedTheme === "dark" ? "dark-background" : "background"
            }.jpg`}
            alt="Background"
            fill
            priority
            quality={100}
            // استفاده از object-cover برای جلوگیری از دفرمه شدن عکس در مانیتورهای مختلف
            className={cn("object-cover transition-all duration-700", {
              // کمی تیرگی برای حالت دارک مود که متون خوانا باشن
              "brightness-[0.6]": resolvedTheme === "dark", 
            })}
            sizes="100vw"
          />
          
          {/* 
            این دیو برای اینه که اگر عکس دیر لود شد یا باگی خورد،
            کاربر متن‌ها رو گم نکنه (یک لایه محافظ خوانایی)
           */}
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BackgroundMain;
