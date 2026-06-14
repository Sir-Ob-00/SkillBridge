/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx', 
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#8b003b',
        secondary: '#ffc712',
        success: '#08540a',
        background: '#f9feff',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        heading: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};