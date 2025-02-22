/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

  ],

  theme: {
    extend: {
      colors: {
        'dark': '#232A3C',
        'medium': '#293245'
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}