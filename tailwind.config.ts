import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    animatePlugin,
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#006Fee",
              foreground: "#fff",
            },
            focus: "#006Fee",
          },
        },
      },
    }),
  ],
};

export default config;
