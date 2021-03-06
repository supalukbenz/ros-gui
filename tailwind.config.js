module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  enabled: process.env.NODE_ENV === 'production',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        custom: {
          primary: '#485a73',
          secondary: '#dea01e',
        },
      },
      backgroundColor: {
        custom: {
          primary: '#485a73',
          secondary: '#dea01e',
        },
      },
      borderColor: {
        custom: {
          primary: '#485a73',
        },
      },
      screens: {
        mobile: { max: '640px' },
        // => @media (max-width: 640px) { ... }

        tabsm: { max: '640px' },
        // => @media (max-width: 640px) { ... }

        tablet: { max: '768px' },
        // => @media (max-width: 768px) { ... }

        desktop: { max: '1024px' },
        // => @media (max-width: 768px) { ... }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
