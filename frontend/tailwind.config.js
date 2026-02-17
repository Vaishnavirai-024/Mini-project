/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite reverse',
        'scan':       'scan 2.4s ease-in-out infinite alternate',
        'glow':       'glow 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease both',
        'counter':    'counter 1.2s ease both',
      },
      keyframes: {
        float:     { '0%,100%': { transform: 'translateY(0)' },   '50%': { transform: 'translateY(-18px)' } },
        scan:      { '0%':      { top: '12%' },                   '100%': { top: '84%' } },
        glow:      { '0%,100%': { boxShadow: '0 0 20px rgba(124,58,237,.4)' }, '50%': { boxShadow: '0 0 40px rgba(124,58,237,.7)' } },
        fadeInUp:  { from:      { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '80px 80px',
      },
    },
  },
  plugins: [],
}
