/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(13, 48, 72)',
          50: '#e6eaed',
          100: '#ccd5db',
          200: '#99abb7',
          300: '#668193',
          400: '#33576f',
          500: '#0d3048',
          600: '#0a263a',
          700: '#081d2b',
          800: '#05131d',
          900: '#030a0e',
        },
        secondary: {
          DEFAULT: 'rgb(230, 114, 42)',
          50: '#fef3ec',
          100: '#fde7d9',
          200: '#fbcfb3',
          300: '#f9b78d',
          400: '#f79f67',
          500: '#e6722a',
          600: '#b85b22',
          700: '#8a4419',
          800: '#5c2d11',
          900: '#2e1708',
        },
        success: {
          DEFAULT: 'rgba(149, 240, 145, 1)',
          50: '#e6eaed',
          100: '#ccd5db',
          200: '#99abb7',
          300: '#668193',
          400: '#33576f',
          500: '#22ef34',
          600: '#16d822',
          700: '#0d8313',
          800: '#05131d',
          900: '#030a0e',
          foreground: '#036e09ff',
        },
        background: {
          DEFAULT: 'rgba(224, 224, 224, 1)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
