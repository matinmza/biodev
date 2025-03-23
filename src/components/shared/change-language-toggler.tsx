"use client";
import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const ChangeLanguageToggler = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isFa = pathname.includes("/fa");

  const handleLanguageChange = (checked: boolean) => {
    const newPath = checked
      ? pathname.replace("/en", "/fa")
      : pathname.replace("/fa", "/en");
    router.push(newPath);
  };

  return (
    <div
      className="flex items-center gap-2 bg-amber-50"
      onClick={(e) => {
        alert("omad");
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <span className="text-sm">EN</span>
      <Switch
        checked={isFa}
        onCheckedChange={handleLanguageChange}
        className="data-[state=checked]:bg-blue-500"
      />
      <span className="text-sm">FA</span>
    </div>
  );
};

export default ChangeLanguageToggler;
