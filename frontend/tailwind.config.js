/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "duck-red": {
          DEFAULT: "#b53701",
          light: "#cb734d",
        },
        "duck-green": {
          DEFAULT: "#01dfb8",
          light: "#4de8cd",
        },
        "duck-yellow": "#fde186",
        "duck-blue": {
          DEFAULT: "#0197df",
          light: "#4db6e8",
        },
      },
    },
  },
  plugins: [],
};
