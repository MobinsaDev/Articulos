import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    allowedHosts: ['localhost','mobinsa2.dyndns.org','192.168.1.191'],
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,

      }
    }
  }
})
