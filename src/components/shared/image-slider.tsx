"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative, FreeMode } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-creative";

const images = [
  "/images/matin/matin1.png",
  "/images/matin/matin2.png",
  "/images/matin/matin3.png",
  "/images/matin/matin4.png",
];

export default function ImageSlider() {
  return (
    <div className="relative w-full h-full overflow-hidden  rounded-3xl">
      <Swiper
        effect={"creative"}
        grabCursor={true}
        modules={[EffectCreative, Autoplay, FreeMode]}
        className="w-full h-full"
        loop={true}
        speed={1000}
        creativeEffect={{
          prev: {
            translate: [0, 0, -400],
            opacity: 0,
          },
          next: {
            translate: ["100%", 0, 0],
            opacity: 0,
          },
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full h-full"
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover rounded-3xl"
                priority={index === 0}
                quality={100}
              />
              <div className="absolute inset-0  w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
