module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'sans-serif'],
        serif: ['serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
