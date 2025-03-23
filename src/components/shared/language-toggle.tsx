"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const LanguageToggle = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isFa = pathname.includes("/fa");

  const handleLanguageChange = () => {
    const newPath = isFa
      ? pathname.replace("/fa", "/en")
      : pathname.replace("/en", "/fa");
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 bg-white/30 backdrop-blur-xl rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] not-drag">
      <button
        onClick={handleLanguageChange}
        className={`flex items-center cursor-pointer justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
          isFa ? "bg-white/80 shadow-sm" : "hover:bg-white/40"
        }`}
      >
        <div className="relative w-8 h-8">
          <Image
            src="https://flagcdn.com/w80/gb.png"
            alt="English"
            fill
            className="rounded-lg object-cover"
            quality={100}
          />
        </div>
      </button>
      <button
        onClick={handleLanguageChange}
        className={`flex items-center justify-center cursor-pointer w-12 h-12 rounded-2xl transition-all duration-300 ${
          !isFa ? "bg-white/80 shadow-sm" : "hover:bg-white/40"
        }`}
      >
        <div className="relative w-8 h-8">
          <Image
            src="https://flagcdn.com/w80/ir.png"
            alt="فارسی"
            fill
            className="rounded-lg object-cover"
            quality={100}
          />
        </div>
      </button>
    </div>
  );
};

export default LanguageToggle;
