/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold-1': '#fcf6ba',
        'gold-2': '#bf953f',
        'deep-space-blue': '#000819',
        'mesh-line': 'rgba(191, 149, 63, 0.12)',
      },
      fontFamily: {
        'display': ['"Space Grotesk"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 26s linear infinite',
        'mirror-sweep': 'mirror-sweep 5s ease-in-out infinite',
        'rainbow-scroll': 'rainbow-scroll 5s linear infinite',
        'rotate-glow': 'rotate-glow 15s linear infinite',
        'shimmer-flow': 'shimmer-flow 8s linear infinite',
        'lighthouse-pulse': 'lighthouse-pulse 3s ease-in-out infinite',
        'crystal-shimmer': 'crystal-shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'mirror-sweep': {
          '0%': { 'background-position': '0% center' },
          '100%': { 'background-position': '200% center' },
        },
        'rainbow-scroll': {
          '0%': { 'background-position': '0% center' },
          '100%': { 'background-position': '200% center' },
        },
        'rotate-glow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer-flow': {
          '0%': { 'background-position': '0% center' },
          '100%': { 'background-position': '200% center' },
        },
        'lighthouse-pulse': {
          '0%, 100%': { 'background-position': '0% center', filter: 'brightness(1)' },
          '50%': { 'background-position': '100% center', filter: 'brightness(1.2)' },
        },
        'crystal-shimmer': {
          '0%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%' },
          '100%': { 'background-position': '0% 0%' },
        },
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}