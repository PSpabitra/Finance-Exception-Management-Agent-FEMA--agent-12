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
          DEFAULT: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          muted: '#cbd5e1',
        },
        brand: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
          glow: 'rgba(37,99,235,0.15)',
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
          DEFAULT: '#0ea5e9',
          glow: 'rgba(14,165,233,0.15)',
        },
        warn: {
          DEFAULT: '#f59e0b',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted: '#475569',
          faint: '#94a3b8',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(37,99,235,0.15)',
        'glow-red': '0 0 20px rgba(239,68,68,0.2)',
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
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
