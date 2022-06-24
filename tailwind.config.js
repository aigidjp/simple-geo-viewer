module.exports = {
  mode: 'jit',
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layout/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      body: [
        'Open Sans',
        'sans-serif'
      ],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
