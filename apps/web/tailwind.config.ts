import type { Config } from "tailwindcss";
import sharedPreset from "@pvm/config/tailwind";

const config: Config = {
  presets: [sharedPreset],
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
