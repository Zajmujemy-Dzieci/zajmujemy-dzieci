const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      red: colors.red,
      green: colors.green,
      purple: colors.purple,
      primary: "#6DB1BF",
      secondary: "#F39A9D",
      childWhite: "#FFEAEC",
      childBlack: "#301A4B",
      childGreen: "#3F6C51",
      childRed: "#A23E48",
    },
    extend: {},
  },
  plugins: [],
};
