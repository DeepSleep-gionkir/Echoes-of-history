/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          800: "#25262B", // Panel (Glass)
          900: "#1A1B1E", // Surface (Glass) / Background fallback
          950: "#101113", // Primary Background (Deep Blue-Grey)
        },
        stone: {
          100: "#F1EBE4", // Paper (Modal)
          800: "#2D2A26", // Text (Ink)
        },
        amber: {
          400: "#FAB005", // Authority
        },
        rose: {
          500: "#FA5252", // Enemy / Danger
        },
        emerald: {
          500: "#40C057", // Ally / Safe
        },
        blue: {
          500: "#339AF0", // Interact
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', "-apple-system", "sans-serif"],
        serif: ['"Gowun Batang"', "serif"],
      },
      keyframes: {
        "stamp-drop": {
          "0%": { transform: "scale(3) rotate(-15deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "stamp-drop":
          "stamp-drop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out forwards",
        ticker: "ticker 30s linear infinite",
        marquee: "marquee 60s linear infinite",
      },
    },
  },
  plugins: [],
};
