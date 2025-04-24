// بدّل export default إلى module.exports
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {        // حطّ screens على مستوى theme، مش داخل extend
      xs: "300px",
      sm: "750px",
      md: "750px",
      lg: "976px",
      xl: "1280px",   // ضيفه لو حابب
      "2xl": "1536px",
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [],
};
