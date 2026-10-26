/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import pacote from './package.json' with { type: 'json' }

export default defineConfig({
  base: '/transito-em-jogo/',
  define: { __APP_VERSION__: JSON.stringify(pacote.version) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Trânsito em Jogo',
        short_name: 'Trânsito',
        description: 'Estude para a prova teórica do Detran com caça-palavras de trânsito e simulados do banco oficial de questões.',
        id: '/transito-em-jogo/',
        lang: 'pt-BR',
        start_url: '/transito-em-jogo/',
        scope: '/transito-em-jogo/',
        display: 'standalone',
        background_color: '#FAFAF9',
        theme_color: '#111111',
        icons: [
          { src: 'icons/icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icone-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        navigateFallback: '/transito-em-jogo/index.html',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTestes.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
