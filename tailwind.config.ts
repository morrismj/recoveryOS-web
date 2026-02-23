import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "ink-950": "#0b0f14",
        "ink-800": "#1c2430",
        "fog-50": "#f4f6f8",
        "fog-100": "#e7ebf0",
        "sea-500": "#2a9d8f",
        "sand-500": "#e9c46a",
        "rose-500": "#e76f51"
      }
    }
  },
  plugins: []
};

export default config;
