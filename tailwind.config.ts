import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#339933",
        "green-dark": "#1a4d1a",
        "green-deep": "#0f2e0f",
        "green-light": "#f0f7f0",
        "green-mid": "#e0f0e0",
        orange: "#ff6b35",
        "orange-dark": "#e0541e",
        neutral: "#2d2d2d",
        white: "#fafdf9",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        "dm-mono": ["var(--font-dm-mono)", "monospace"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
