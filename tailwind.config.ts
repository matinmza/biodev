import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        iranSans: ["var(--font-iran-sans)", "var(--font-sf-pro)"],
        sfPro: ["var(--font-sf-pro)", "var(--font-iran-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
