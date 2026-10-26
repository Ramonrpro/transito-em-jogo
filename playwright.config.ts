import { defineConfig, devices } from '@playwright/test'

const baseURLExterna = process.env.PLAYWRIGHT_BASE_URL
const baseURLLocal = 'http://localhost:4173/transito-em-jogo/'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: baseURLExterna ?? baseURLLocal },
  projects: [{ name: 'celular', use: { ...devices['Pixel 7'] } }],
  webServer: baseURLExterna
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port 4173',
        url: baseURLLocal,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
