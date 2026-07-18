/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        voyage: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b3ccff",
          300: "#82abf5",
          400: "#4f7fe0",
          500: "#2f5cc4",
          600: "#20429c",
          700: "#1a3378",
          800: "#152a5f",
          900: "#0f1f47",
          950: "#0a1530",
        },
        horizon: {
          400: "#ff9466",
          500: "#ff7a4d",
          600: "#f2612f",
        },
        lagoon: {
          300: "#8be9de",
          400: "#4fd6c4",
          500: "#2bbba9",
        },
        sand: {
          50: "#fbf8f2",
          100: "#f4eee1",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "voyage-gradient": "linear-gradient(135deg, #0f1f47 0%, #1a3378 45%, #2f5cc4 100%)",
        "horizon-gradient": "linear-gradient(120deg, #ff7a4d 0%, #ff9466 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(15, 31, 71, 0.15)",
        card: "0 10px 30px -10px rgba(15, 31, 71, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        spinSlow: "spinSlow 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
