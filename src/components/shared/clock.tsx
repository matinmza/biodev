"use client";

import { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { useParams } from "next/navigation";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFormattedDate = () => {
    if (lang === "fa") {
      return moment(time).format("jYYYY/jMM/jDD");
    }
    return moment(time).format("YYYY/MM/DD");
  };

  const getFormattedTime = () => {
    return moment(time).format("HH:mm");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-[83px] font-medium ">{getFormattedTime()}</div>
      <div className="text-[22px] font-normal">{getFormattedDate()}</div>
    </div>
  );
}
