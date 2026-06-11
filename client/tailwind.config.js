export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F59E0B', dark: '#D97706', light: '#FCD34D' },
        dark: { DEFAULT: '#0A0A0A', card: '#111111', border: '#1F1F1F', muted: '#2A2A2A' }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
};
