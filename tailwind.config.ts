import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Retro-Futuristic Brutalist Theme
        stadium: {
          950: '#05080f', // Deeper black
          900: '#0c0f18', // Near black
          800: '#1a1d2e', // Dark slate
          700: '#2d3548', // Borders
        },
        pitch: {
          500: '#22c55e', // Electric green accent
          400: '#4ade80', // Bright accent
          600: '#16a34a', // Darker green
        },
        floodlight: {
          400: '#fbbf24', // Warm amber highlight
          500: '#f59e0b', // Gold accent
        },
        // Neon accent palette
        neon: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          lime: '#ccff00',
          purple: '#8a2be2',
        },
        // Position colors (vibrant neon)
        gk: '#fbbf24',    // Golden yellow
        def: '#60a5fa',   // Bright blue
        mid: '#4ade80',   // Bright green
        fwd: '#f87171',   // Bright red
      },
      fontFamily: {
        display: ['Archivo Black', 'Impact', 'sans-serif'],
        condensed: ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        body: ['Barlow Condensed', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pitch-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-reveal': 'slide-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'glitch': 'glitch 0.3s infinite',
        'border-pulse': 'border-pulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-reveal': {
          '0%': { opacity: '0', transform: 'translateX(-30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(0, 255, 255, 0.4)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'border-pulse': {
          '0%, 100%': { borderColor: 'rgba(0, 255, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 255, 255, 0.6)' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config