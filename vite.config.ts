/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/transito-em-jogo/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTestes.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
