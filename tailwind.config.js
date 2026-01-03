/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        genesis: {
          primary: '#b91c1c',
          'primary-light': '#dc2626',
          'primary-dark': '#991b1b',
        },
      },
    },
  },
  plugins: [],
}
