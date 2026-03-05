import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core palette
        deep: {
          DEFAULT: '#020617',
          50: '#0a0f1e',
          100: '#0f172a',
          200: '#1e293b',
          300: '#334155',
          400: '#475569',
        },
        electric: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
          glow: '#93c5fd',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
          glow: '#c4b5fd',
        },
        neon: {
          cyan: '#22d3ee',
          green: '#4ade80',
          pink: '#f472b6',
          orange: '#fb923c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.2)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        depth: '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-1':
          'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(34, 211, 238, 0.1) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(244, 114, 182, 0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
        'mesh-2':
          'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'grid-flow': 'gridFlow 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        scanLine: {
          '0%': { top: '0%', opacity: '1' },
          '50%': { top: '100%', opacity: '0.5' },
          '100%': { top: '0%', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gridFlow: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
