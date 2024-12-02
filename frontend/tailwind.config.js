/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        notion: {
          default: '#2F3437',
          dark: '#191919',
          darker: '#121212',
          subtle: '#373C3F',
          border: '#393B3D',
          text: '#E3E3E3',
          dimmed: '#999999',
          accent: '#0A84FF'
        }
      }
    },
  },
  plugins: [],
};