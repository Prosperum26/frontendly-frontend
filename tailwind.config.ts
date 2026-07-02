import type { Config } from 'tailwindcss';

/** Tùy chọn v4: liên kết bằng `@config` trong `src/index.css`. */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editor: {
          dark: '#0D1117',
          panel: '#161B22',
        },
        syntax: {
          blue: '#58A6FF',
          green: '#3FB950',
          amber: '#F0883E',
          grey: '#8B949E',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'xp-fill': 'xpFill 0.6s ease-out forwards',
        'flame-flicker': 'flameFlicker 2s ease-in-out infinite',
      },
      keyframes: {
        xpFill: {
          '0%': { width: '0%' },
        },
        flameFlicker: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
} satisfies Config;
