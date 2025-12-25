import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', "cursive", "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        card: ['"Playfair Display"', "serif"],
      },
      colors: {
        innocent: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#059669",
          card: "#22c55e",
        },
        impostor: {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
          card: "#f43f5e",
        },
        ranking: {
          gold: "#fbbf24",
          silver: "#94a3b8",
          bronze: "#f97316",
        },
        board: {
          cream: "#fef9f3",
          beige: "#f5f1e8",
          brown: "#8b7355",
          dark: "#3d3526",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        "card-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.1)",
        "card-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.1)",
        "card-3d":
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      borderRadius: {
        card: "1rem",
        "card-lg": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;

