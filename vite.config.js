import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // must match wait-on in package.json
    host: true,  // allow network access
  },
  build: {
    outDir: 'dist',          // production build output
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
})
