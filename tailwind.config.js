/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      "custom": "Raleway, sans-serif",
    },
    extend: {
      colors: {
        "primary-blue": "#437BBF",
        "secondary-blue": "#162940",
        "tertiary-blue": "#0D1929",
        "primary-red": "#CD4438",
        "primary-yellow": "#EAD254",
      },
    },
  },
  plugins: [],
}