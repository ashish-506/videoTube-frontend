/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1115",
        surface: "#171A21",
        surface2: "#1D212B",
        border: "#262B35",
        ink: "#EDEDEF",
        "ink-muted": "#9A9FAE",
        gold: "#E8B339",
        "gold-dim": "#B8862A",
        danger: "#E8544B",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
