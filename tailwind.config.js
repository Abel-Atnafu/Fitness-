/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060b18',
          900: '#0d1526',
          800: '#111d35',
          700: '#1a2a47',
          600: '#243558',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
        },
        ethRed: '#da121a',
        ethGreen: '#078930',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d97706, #fbbf24)',
        'green-gradient': 'linear-gradient(135deg, #065f46, #84cc16)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'fire': 'fireFlicker 0.8s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fireFlicker: {
          '0%': { transform: 'scaleY(1) rotate(-2deg)', filter: 'brightness(1)' },
          '100%': { transform: 'scaleY(1.1) rotate(2deg)', filter: 'brightness(1.3)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(251,191,36,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(251,191,36,0)' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        'gold-glow': '0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.12)',
        'green-glow': '0 0 20px rgba(132,204,22,0.3)',
        'red-glow': '0 0 20px rgba(218,18,26,0.3)',
      },
    },
  },
  plugins: [],
}
