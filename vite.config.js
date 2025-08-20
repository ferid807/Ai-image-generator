import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project site at https://<user>.github.io/Ai-image-generator/
export default defineConfig({
  plugins: [react()],
  base: '/Ai-image-generator/',
  
})
