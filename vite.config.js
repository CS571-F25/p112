import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/p112/',            // repo name so assets resolve on GitHub Pages
  build: { outDir: 'docs' }  // build straight into /docs for Pages
})
