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
        pain: {
          low: '#fef3c7',      // Yellow
          medium: '#fb923c',   // Orange
          high: '#ef4444',     // Red
        }
      }
    },
  },
  plugins: [],
}
export default config
