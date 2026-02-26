/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-tertiary': '#1a1a24',
        'accent-green': '#00ff88',
        'accent-red': '#ff4757',
        'accent-blue': '#00d4ff',
        'accent-purple': '#a855f7',
        'accent-yellow': '#ffc107',
        'accent-orange': '#ff6b35',
        'text-primary': '#ffffff',
        'text-secondary': '#8b8b9a',
        'text-tertiary': '#4a4a5a',
        'border-color': '#2a2a3a',
      },
      fontFamily: {
        'heading': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 255, 136, 0.05)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine': 'shine 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
