"use client";

import { useEffect, useState } from "react";
import { format as formatJalali } from "date-fns-jalali";
import { format as formatGregorian } from "date-fns";
import { faIR } from "date-fns-jalali/locale";

import { useParams } from "next/navigation";

interface FormattedDateProps {
  time: Date;
  lang: string;
}

const getFormattedDate = ({ time, lang }: FormattedDateProps): string => {
  return lang === "fa"
    ? formatJalali(time, "EEEE, d MMMM", { locale: faIR })
    : formatGregorian(time, "EEEE, MMMM d");
};

const getFormattedTime = (time: Date): string => {
  return formatGregorian(time, "HH:mm");
};

export default function Clock() {
  const [time, setTime] = useState<Date>(new Date());
  const { lang } = useParams();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-[83px] font-medium font-sf-pro text-white dark:text-black">
        {getFormattedTime(time)}
      </div>
      <div className="text-[22px] font-normal text-white">
        {getFormattedDate({ time, lang: lang as string })}
      </div>
    </div>
  );
}
