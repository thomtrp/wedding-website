/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'parisienne': ['Parisienne', 'cursive'],
          'cormorant': ['Cormorant Garamond', 'serif'],
        },
        colors: {
          creme: {
            50: '#fffef9',
            100: '#faf8f0',
            200: '#f5f2e8',
            300: '#f0ead6',
            400: '#ebe2c4',
            500: '#e6dab2',
          },
          neutral: {
            50: '#ffffff',
            100: '#fafafa',
            200: '#f5f5f5',
            300: '#f0f0f0',
            400: '#e8e8e8',
            500: '#e0e0e0',
            600: '#d0d0d0',
            700: '#a8a8a8',
          },
          olive: {
            300: '#b8b88f',
            400: '#a5a672',
            500: '#8b8c5a',
            600: '#6b6d3f',
            700: '#5a5c33',
            800: '#4a4b2a',
            900: '#3a3b22',
          },
        },
      },
    },
    plugins: [],
  }