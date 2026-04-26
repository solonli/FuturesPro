/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D4FF',
        secondary: '#6366F1',
        dark: {
          100: '#e0e0e0',
          200: '#a0a0b0',
          300: '#1a1a2e',
          400: '#16213e',
          500: '#0f0f1a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

