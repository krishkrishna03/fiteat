module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 30px 80px rgba(124, 58, 237, 0.18)',
      },
      colors: {
        ink: '#0f172a',
        sky: '#0ea5e9',
        violet: '#7c3aed',
      },
    },
  },
  plugins: [],
}
