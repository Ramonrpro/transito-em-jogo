/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import pacote from './package.json' with { type: 'json' }

export default defineConfig({
  base: '/transito-em-jogo/',
  define: { __APP_VERSION__: JSON.stringify(pacote.version) },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTestes.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
