import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4173/transito-em-jogo/' },
  projects: [{ name: 'celular', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173/transito-em-jogo/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
