/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fef7e8',
          100: '#fdebc5',
          200: '#facd89',
          300: '#f6b759',
          400: '#f3a334',
          500: '#D4AF37',   // ← Your existing color
          600: '#B8860B',   // ← Your existing color  
          700: '#9c6f09',
          800: '#7e5a07',
          900: '#644805'
        }
      }
    }
  },
  plugins: [],
}
