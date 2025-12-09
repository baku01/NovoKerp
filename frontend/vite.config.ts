/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/chamadaProcedure': {
        target: 'http://www.atscs.com.br',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://www.atscs.com.br',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
