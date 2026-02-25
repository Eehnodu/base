/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: "#1C1C1C",
          hover: "#262626",
          active: "#141414",
        },
        sub1: {
          DEFAULT: "#3A3A3A",
          hover: "#4A4A4A",
          active: "#2E2E2E",
        },
        sub2: {
          DEFAULT: "#F2F2F2",
          hover: "#EDEDED",
          active: "#DCDCDC",
        },
      },
    },
  },
  plugins: [],
};
