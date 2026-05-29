/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
}
