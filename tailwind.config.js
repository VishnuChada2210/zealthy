// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#08605F', // teal
          50: '#E6F7F6',
          100: '#C0E9E7',
          200: '#99DBD7',
          300: '#66C7C4',
          400: '#33B3B0',
          500: '#089F9C',
          600: '#08605F', // base
          700: '#064D4C',
          800: '#053A3A',
          900: '#032727',
        },
        accent: '#F97316',
        bg: '#FEFDFB',
        surface: '#FFFFFF',
        text: '#0F172A',
        muted: '#6B7280',
        success: '#059669',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
        heading: ['Roboto Slab', 'Georgia', 'serif'],
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
