import type { Config } from 'tailwindcss';

/** Tùy chọn v4: liên kết bằng `@config` trong `src/index.css`. */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
} satisfies Config;
