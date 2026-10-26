import { expect, test } from '@playwright/test'

test('depois da primeira visita funciona sem internet, com as placas', async ({ page, context }) => {
  await page.goto('./')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Simulado' })).toBeVisible()
  const ok = await page.evaluate(async () => !!(await caches.match(new URL('placas/R-10.svg', location.href).href, { ignoreSearch: true })))
  expect(ok).toBe(true)
})

test('manifest com escopo definitivo', async ({ request }) => {
  const m = await (await request.get('./manifest.webmanifest')).json()
  expect(m).toMatchObject({ id: '/transito-em-jogo/', scope: '/transito-em-jogo/', start_url: '/transito-em-jogo/', display: 'standalone', lang: 'pt-BR' })
})
