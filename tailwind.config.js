/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ["Helvetica Compressed", "sans-serif"],
        absolute: ["Absolute Empire", "sans-serif"],
        clashDisplay: ["ClashDisplay", "sans-serif"],
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
      },
    },
  },
  plugins: [],
};
