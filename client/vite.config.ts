import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    allowedHosts: ['taskstrack.localhost', 'localhost', '127.0.0.1'],
    proxy: {
      '/mock/api': {
        target: 'http://localhost:4200',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5206',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true, // Needed for Docker volumes
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
