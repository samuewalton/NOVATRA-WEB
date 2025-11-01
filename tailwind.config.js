/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'novatra-green': '#2C5F5D',
        'novatra-beige': '#F7F5F3',
      },
      fontFamily: {
        'heebo': ['Heebo', 'sans-serif'],
        'assistant': ['Assistant', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
