/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF7',
        ink: '#1E2126',
        'ink-soft': '#4B505A',
        line: '#E4E2DC',
        accent: {
          DEFAULT: '#4B3FE0',
          soft: '#EEECFC',
          deep: '#372FA8',
        },
        category: {
          under: '#2E6BD1',
          'under-bg': '#EAF1FC',
          healthy: '#1F8F5F',
          'healthy-bg': '#E8F6EF',
          over: '#B8720C',
          'over-bg': '#FBF1DE',
          obesity: '#C23B3B',
          'obesity-bg': '#FBEAEA',
        },
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fillbar: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        rise: 'rise 0.35s ease-out',
        fillbar: 'fillbar 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
