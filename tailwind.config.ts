import { Config } from 'tailwindcss'

export default {
  content: ["./src/**/*.{vue}"],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
