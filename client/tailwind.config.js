module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      red: {
        DEFAULT: '#e4663f',
      },
      yellow: {
        DEFAULT: '#f8d347',
      },
      black: {
        DEFAULT: '#414141',
      },
      blue: {
        DEFAULT: '#6fcbf7',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
      12: '12px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
