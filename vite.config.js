import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',   // relative paths — works for GitHub Pages subdirectory and root
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
})
