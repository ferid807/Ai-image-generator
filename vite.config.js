import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import './index.css';

// For GitHub Pages project site at https://<user>.github.io/Ai-image-generator/
export default defineConfig({
  base: '/Ai-image-generator/',
  plugins: [react()],
})