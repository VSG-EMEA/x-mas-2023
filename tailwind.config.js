/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{html,js}'],
  theme: {
    extend: {},
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '3rem',
      '5xl': '4rem',
      '6xl': ['5rem', '1'],
      '7xl': ['6rem', '1'],
      '8xl': ['8rem', '1']
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      red: {
        100: '#fe5471',
        200: '#f83354',
        300: '#ef1439',
        400: '#ce0e2d',
        500: '#b1132d',
        600: '#97162b',
        700: '#7e1728',
        800: '#661724',
        900: '#50161f'
      },
      blue: {
        100: '#0078d4',
        200: '#0069ba',
        300: '#005a9f',
        400: '#004a83',
        500: '#024273',
        600: '#043961',
        700: '#053050',
        800: '#062740',
        900: '#051e31'
      },
      black: '#222222'
    }
  },
  plugins: []
}
