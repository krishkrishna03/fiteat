module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 30px 80px rgba(132, 204, 22, 0.15)',
      },
      colors: {
        'lime': '#84cc16',
        'dark-green': '#0f4c3a',
        'forest': '#1a2428',
      },
    },
  },
  plugins: [],
}
