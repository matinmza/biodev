import type { MetadataRoute } from "next";
import en from "@/i18n/dictionaries/en.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en.meta.title,
    short_name: en.menu.os,
    description: en.meta.description,
    start_url: "/en",
    display: "standalone",
    background_color: "#0a0b10",
    theme_color: "#0a0b10",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
