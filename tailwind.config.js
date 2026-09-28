/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#E8E1D7',
          400: '#D5CAC0',
          500: '#B3A497',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          600: '#6B6664',
          700: '#4A4644',
          800: '#2C2A29',
          900: '#1A1817',
        },
        rose: {
          50: '#FAF2F3',
          100: '#F4E3E5',
          200: '#E8C5C8',
          300: '#DBA6AB',
          400: '#CB848B',
          500: '#B3646C',
        },
        pistachio: {
          50: '#F4F7F2',
          100: '#E6ECE1',
          200: '#D2DEC9',
          300: '#B8CBAC',
          400: '#9BB48C',
          500: '#7B986A',
        },
        powder: {
          50: '#F2F6F9',
          100: '#E3ECF3',
          200: '#D1DEE8',
          300: '#B1C7D8',
          400: '#8CAFC7',
          500: '#648EAC',
        },
        terracotta: {
          50: '#FAF3F0',
          100: '#F4E3DD',
          200: '#E5C1B5',
          300: '#D39C8A',
          400: '#D9886E',
          500: '#BA6549',
          600: '#994B32',
        },
        marigold: {
          50: '#FDF8EC',
          100: '#F9ECCB',
          200: '#F2D794',
          300: '#E8C15B',
          400: '#D8A730',
          500: '#B8861B',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 42, 41, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(44, 42, 41, 0.08)',
        'soft-xl': '0 20px 40px -6px rgba(44, 42, 41, 0.12)',
        'atelier': '0 2px 10px rgba(0, 0, 0, 0.03), 0 12px 28px rgba(44, 42, 41, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};
