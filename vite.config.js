import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project site at https://<user>.github.io/Ai-image-generator/
export default defineConfig({
  base: '/Ai-image-generator/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'docs',
  },
})