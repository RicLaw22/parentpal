/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-indigo': '#1E1B4B',
        'brand-saffron': '#F59E0B',
      },
      fontFamily: {
        baloo: ['var(--font-baloo)', 'Baloo\\ 2', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,158,11,0.4)' },
          '50%': { boxShadow: '0 0 24px 8px rgba(245,158,11,0.18)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'bounce-soft': 'bounce-soft 2.2s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.6s linear infinite',
        'confetti-fall': 'confetti-fall var(--duration) var(--delay) linear forwards',
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        'slide-up': 'slide-up 0.35s ease-out forwards',
        'spin-slow': 'spin-slow 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
