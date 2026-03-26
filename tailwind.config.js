/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#002147',
        'suss-red': '#C8102E',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-up-1': 'fadeUp 0.5s ease 0.05s both',
        'fade-up-2': 'fadeUp 0.5s ease 0.15s both',
        'fade-up-3': 'fadeUp 0.5s ease 0.25s both',
        'fade-up-4': 'fadeUp 0.5s ease 0.35s both',
        'fade-in': 'fadeIn 0.4s ease both',
      },
    },
  },
  plugins: [],
}
