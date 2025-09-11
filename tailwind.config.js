/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Penting! Mengaktifkan dark mode berbasis class
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}