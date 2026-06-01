/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          card: '#161c26',
          border: '#1e2736',
          muted: '#242f42',
        },
        brand: {
          DEFAULT: '#f59e0b',
          light: '#fcd34d',
          dark: '#d97706',
          glow: 'rgba(245,158,11,0.15)',
        },
        danger: {
          DEFAULT: '#ef4444',
          glow: 'rgba(239,68,68,0.15)',
        },
        success: {
          DEFAULT: '#10b981',
          glow: 'rgba(16,185,129,0.15)',
        },
        info: {
          DEFAULT: '#3b82f6',
          glow: 'rgba(59,130,246,0.15)',
        },
        warn: {
          DEFAULT: '#f59e0b',
        },
        ink: {
          DEFAULT: '#e2eaf5',
          muted: '#7a8fa8',
          faint: '#3a4d65',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(245,158,11,0.15)',
        'glow-red': '0 0 20px rgba(239,68,68,0.2)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.5)', opacity: 0.5 } },
      },
    },
  },
  plugins: [],
}
