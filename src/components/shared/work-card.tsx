"use client";

import React, { FC, useState } from "react";
import { motion, useSpring, useMotionTemplate, transform } from "framer-motion";
import Image from "next/image";
import Modal from "./modal";

const WorkCard: FC<{
  icon: string;
  bg?: string;
}> = ({ icon, bg }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // برای افکت 3D
  const [frame, setFrame] = useState({ width: 0, height: 0, top: 0, left: 0 });
  
  /* Motion Config (همون تنظیمات قبلی) */
  const springValue = { stiffness: 400, damping: 30 };
  const rotateX = useSpring(0, springValue);
  const rotateY = useSpring(0, springValue);
  const x = useSpring(0, springValue);
  const y = useSpring(0, springValue);
  const shadowX = useSpring(0, springValue);
  const shadowY = useSpring(30, springValue);
  const filter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0, 0, 68, 0.25))`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const objectX = (e.clientX - frame.left) / frame.width;
    const objectY = (e.clientY - frame.top) / frame.height;
    const rotateValue = 15;
    const transformValue = rotateValue * 2;

    rotateX.set(transform(objectY, [0, 1], [rotateValue, -rotateValue]));
    rotateY.set(transform(objectX, [0, 1], [-rotateValue, rotateValue]));
    x.set(transform(objectX, [0, 1], [-transformValue, transformValue]));
    y.set(transform(objectY, [0, 1], [-transformValue, transformValue]));
    shadowX.set(transform(objectX, [0, 1], [20, -20]));
    shadowY.set(transform(objectY, [0, 1], [60, 20]));
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFrame({ width: rect.width, height: rect.height, top: rect.top, left: rect.left });
  };

  const handleMouseLeave = () => {
    rotateX.set(0); rotateY.set(0); x.set(0); y.set(0);
    shadowX.set(0); shadowY.set(40);
  };

  return (
    <>
      {/* 
        ⭐️ نکته کلیدی: کلاس not-drag 
        دقیقاً مثل ThemeToggle خودت. این باعث میشه گرید اینجا درگ نشه 
        و کلیک ۱۰۰٪ راحت کار کنه.
      */}
      <motion.div
        className="w-full h-full cursor-pointer not-drag"
        style={{ perspective: 1200 }}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            background: bg,
          }}
          className="w-full h-full rounded-3xl flex items-center justify-center overflow-hidden"
        >
          <motion.div style={{ x, y, filter }} className="relative z-10">
            <Image
              src={icon}
              alt="work-icon"
              width={200}
              height={200}
              quality={100}
              priority
              className="pointer-events-none select-none"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-[300px] h-[300px] bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center">
          <p className="text-black dark:text-white font-bold">پروژه باز شد ✅</p>
        </div>
      </Modal>
    </>
  );
};

export default WorkCard;
