import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true, // Allow all hosts, preventing Vite from blocking ngrok domains
    proxy: {
      '/api': {
        // Use BACKEND_URL from env if available (e.g., in Docker), otherwise use localhost
        target: process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})