/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:  "#C026D3",
        secondary:"#E879F9",
        accent:   "#F59E0B",
        dark:     "#FDF4FF",
        card:     "#FFFFFF",
        surface:  "#FAF0FE",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}