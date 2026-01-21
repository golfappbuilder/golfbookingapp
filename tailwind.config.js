/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['var(--font-pacifico)'],
      },
      colors: {
        // Masters color palette
        'masters-green': {
          DEFAULT: '#006747',
          light: '#1a8a6a',
          dark: '#004d35',
        },
        'masters-yellow': {
          DEFAULT: '#FFC72C',
          light: '#FFD85C',
          dark: '#E6B025',
        },
        // Keep golf-green for backwards compatibility, but mapped to masters colors
        'golf-green': {
          50: '#e6f3ef',
          100: '#ccebe0',
          200: '#99d7c1',
          300: '#66c3a2',
          400: '#33af83',
          500: '#009b64',
          600: '#006747',
          700: '#004d35',
          800: '#003324',
          900: '#001a12',
        },
      },
    },
  },
  plugins: [],
}
