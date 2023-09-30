import tailwindNesting from 'tailwindcss/nesting/index.js'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindNesting,
    tailwind,
    autoprefixer,
  ]
}