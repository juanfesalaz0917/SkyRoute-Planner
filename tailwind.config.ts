import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // University colors
        'primary-blue': '#1e3a8a',
        'secondary-orange': '#ea580c',
        'primary-light': '#3b82f6',
        'primary-dark': '#0f172a',
        'orange-light': '#f97316',
        'orange-dark': '#b84506',
        
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
        
        // Neutral palette
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      spacing: {
        'navbar-height': '64px',
        'sidebar-width': '280px',
        'sidebar-width-collapsed': '80px',
      },
      shadows: {
        'navbar': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'sidebar': '2px 0 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
      },
      borderRadius: {
        'DEFAULT': '6px',
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config
