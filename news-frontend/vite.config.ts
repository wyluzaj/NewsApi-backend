import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/keywords': 'http://localhost:8080',
      '/languages': 'http://localhost:8080',
    }
  }
})
