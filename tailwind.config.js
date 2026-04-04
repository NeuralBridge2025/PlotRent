/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#32632e',
        'primary-container': '#4a7c44',
        secondary: '#a03f29',
        surface: '#fcf9f4',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f7f4ef',
        'surface-container': '#f1eee9',
        'surface-container-high': '#ebe8e3',
        'surface-container-highest': '#e5e2dd',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-surface': '#1c1b18',
        'on-surface-variant': '#49454f',
        outline: '#7a757f',
        'outline-variant': '#cac4cf',
        'primary-fixed-dim': '#9ed493',
        'on-secondary-container': '#741f0b',
      },
      fontFamily: {
        manrope: ['Manrope'],
        inter: ['Inter'],
      },
    },
  },
  plugins: [],
};
