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
        "primary-red": "#CD4438",
        "primary-yellow": "#EAD254",
        "secondary-blue": "#2D527F",
      },
    },
  },
  plugins: [],
}