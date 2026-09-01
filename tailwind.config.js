/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#3B988F',
          50: '#EAF6F4',
          100: '#D2EAE6',
          200: '#A5D5CD',
          300: '#77C0B5',
          400: '#4FA69C',
          500: '#3B988F',
          600: '#2F7A72',
          700: '#235C56',
          800: '#173E3A',
          900: '#0C201E',
        },
        yellow: {
          DEFAULT: '#F4DB73',
          50: '#FEFBEA',
          100: '#FDF6CE',
          200: '#FBECA0',
          300: '#F4DB73',
          400: '#ECCB41',
          500: '#D9B41F',
          600: '#B08E12',
          700: '#826A0D',
          800: '#54450A',
          900: '#2C2405',
        },
        blue: {
          DEFAULT: '#2682B5',
          50: '#EAF3F8',
          100: '#D2E6F0',
          200: '#A5CDE1',
          300: '#77B4D2',
          400: '#4F9BC3',
          500: '#2682B5',
          600: '#1E6891',
          700: '#164E6D',
          800: '#0F3449',
          900: '#071A25',
        },
        ink: {
          DEFAULT: '#1A2230',
          soft: '#4A5568',
          muted: '#8A94A6',
        },
        canvas: '#F7F8FA',
        line: '#E6E9EF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        soft: '0 4px 16px rgba(16,24,40,0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
