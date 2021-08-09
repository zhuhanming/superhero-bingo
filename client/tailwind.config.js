module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: [
      'grid-cols-1',
      'grid-cols-2',
      'grid-cols-3',
      'grid-cols-4',
      'grid-cols-5',
      'grid-cols-6',
      'grid-cols-7',
      'grid-cols-8',
      'grid-cols-9',
      'grid-cols-10',
    ],
  },
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
        DEFAULT: '#231f20',
      },
      blue: {
        DEFAULT: '#6fcbf7',
      },
      green: {
        DEFAULT: '#34D399',
      },
      white: {
        DEFAULT: '#ffffff',
      },
      gray: {
        DEFAULT: '#E5E7EB',
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
