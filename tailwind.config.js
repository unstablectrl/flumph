module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Code', '-apple-system', 'sans-serif'],
        serif: ['serif'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
}
