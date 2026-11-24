/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1B33',
          light: '#1F3A5F',
          dark: '#0A1222',
          muted: '#2B4A75',
        },
        orange: {
          DEFAULT: '#FF7A1A',
          soft: '#FFE9D6',
          hover: '#E6680D',
          light: '#FFF2E8',
        },
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',
        background: '#F7F8FC',
        dark: {
          bg: '#0B1120',
          card: '#131E35',
          border: '#1F2E4D',
          hover: '#1A294A'
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 27, 51, 0.06), 0 2px 6px -1px rgba(15, 27, 51, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(15, 27, 51, 0.08), 0 4px 10px -2px rgba(15, 27, 51, 0.04)',
        'glow-orange': '0 0 20px rgba(255, 122, 26, 0.35)',
        'glow-navy': '0 0 20px rgba(31, 58, 95, 0.35)',
      }
    },
  },
  plugins: [],
}
