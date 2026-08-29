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
        target: process.env.VITE_API_TARGET || 'http://localhost:5206',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true, // Needed for Docker volumes
    },
  },
  resolve: {
    alias: {
      "@/api": path.resolve(__dirname, "./src/data/api"),
      "@/queries": path.resolve(__dirname, "./src/data/queries"),
      "@/types": path.resolve(__dirname, "./src/data/types"),
      "@/components/Analytics": path.resolve(__dirname, "./src/features/Analytics"),
      "@/components/Auth": path.resolve(__dirname, "./src/features/Auth"),
      "@/components/Categories": path.resolve(__dirname, "./src/features/Categories"),
      "@/components/FocusSession": path.resolve(__dirname, "./src/features/FocusSession"),
      "@/components/Habits": path.resolve(__dirname, "./src/features/Habits"),
      "@/components/Sync": path.resolve(__dirname, "./src/features/Sync"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
