"use client";
import React, { useState } from "react";
import { motion, useSpring, useMotionTemplate, transform } from "framer-motion";

export default function LogoBox() {
  /* State */
  const [frame, setFrame] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  /* Constants */
  /* Customize these to change the intensity of the 
  transforms and the bounciness of the animations. */
  const rotateValue = 15;
  const transformValue = rotateValue * 2;
  const springValue = { stiffness: 400, damping: 30 };

  /* UseSpring MotionValues */
  const rotateX = useSpring(0, springValue);
  const rotateY = useSpring(0, springValue);
  const x = useSpring(0, springValue);
  const y = useSpring(0, springValue);
  const shadowX = useSpring(0, springValue);
  const shadowY = useSpring(30, springValue);

  /* MotionTemplate for shadow property */
  /* With useMotionTemplate, you can use MotionValues (and thus, useSpring) within strings. This is useful for animating and interpolating properties like Drop Shadow, Box Shadow, Gradients, and many more. */
  const filter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0, 0, 68, 0.25))`;

  /* Convert cursor position values */
  const convertCursorPosition = (e) => {
    const objectX = (e.nativeEvent.clientX - frame.left) / frame.width;
    const objectY = (e.nativeEvent.clientY - frame.top) / frame.height;

    rotateX.set(transform(objectY, [0, 1], [rotateValue, -rotateValue]));
    rotateY.set(transform(objectX, [0, 1], [-rotateValue, rotateValue]));
    x.set(transform(objectX, [0, 1], [-transformValue, transformValue]));
    y.set(transform(objectY, [0, 1], [-transformValue, transformValue]));

    shadowX.set(transform(objectX, [0, 1], [20, -20]));
    shadowY.set(transform(objectY, [0, 1], [60, 20]));
  };

  /* On Mouse Enter, get object frame and convert values */
  const handleMouseEnter = (e) => {
    const currentElement = e.target.getBoundingClientRect();

    setFrame({
      width: currentElement.width,
      height: currentElement.height,
      top: currentElement.top,
      left: currentElement.left,
    });

    convertCursorPosition(e);
  };

  /* On Mouse Move, convert values */
  const handleMouseMove = (e) => {
    convertCursorPosition(e);
  };

  /* On Mouse Leave, reset */
  const handleMouseLeave = (e) => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    shadowX.set(0);
    shadowY.set(40);
  };

  return (
    <motion.div
      style={{
        perspective: 1200,
      }}
      className="w-full h-full"
    >
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: "pointer",
        }}
        className="w-full h-full"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            display: "flex",
            placeItems: "center",
            placeContent: "center",
            background: "linear-gradient(180deg, #0CF 0%, #86F 100%)",
          }}
          className="w-full h-full rounded-3xl"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              x,
              y,
              filter,
            }}
            width="256"
            height="256"
            className="flex items-center justify-center"
          >
            <path
              d="M113.14 26.767c4.175-6.958 14.86-3.998 14.86 4.116v50.784a7 7 0 007 7h78.87c6.219 0 10.06 6.783 6.86 12.116l-77.87 129.784c-4.175 6.957-14.86 3.998-14.86-4.116v-50.784a7 7 0 00-7-7H42.13c-6.219 0-10.06-6.784-6.86-12.116z"
              fill="#FFF"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
