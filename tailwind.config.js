/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jupiter: {
          bg: '#0b0b0e',
          card: '#131318',
          input: '#1b1b1f',
          border: '#25252b',
          hover: '#2a2a32',
          green: '#c7f284',
          'green-dark': '#a8d96f',
          red: '#ff6b6b',
          orange: '#ffaa00',
        },
      },
    },
  },
  plugins: [],
};
