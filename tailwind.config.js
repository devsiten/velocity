/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          tertiary: '#1a1a25',
          elevated: '#222230',
        },
        accent: {
          primary: '#00ff88',
          secondary: '#00cc6a',
          warning: '#ffaa00',
          danger: '#ff4444',
          info: '#00aaff',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0b0',
          muted: '#606070',
        },
        border: {
          primary: '#2a2a3a',
          secondary: '#3a3a4a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 255, 136, 0.2)',
        'glow-md': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 255, 136, 0.4)',
      },
    },
  },
  plugins: [],
};
