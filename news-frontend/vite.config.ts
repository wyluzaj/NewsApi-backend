import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDocker = process.env.IS_DOCKER === 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': isDocker ? 'http://backend:8080' : 'http://localhost:8080',
      '/users': isDocker ? 'http://backend:8080' : 'http://localhost:8080',
      '/keywords': isDocker ? 'http://backend:8080' : 'http://localhost:8080',
      '/languages': isDocker ? 'http://backend:8080' : 'http://localhost:8080',
    }
  }
})