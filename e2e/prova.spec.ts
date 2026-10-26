import { expect, test } from '@playwright/test'

test('prova sobrevive a recarregar e é entregue pelo mapa', async ({ page }) => {
  await page.goto('./#/simulado')
  await page.getByText('Prova (igual ao Detran)').click()
  await page.getByRole('button', { name: /^B/ }).click()
  // a UI só marca depois de gravar; espera isso antes de recarregar
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(1)
  await page.reload()
  await expect(page.getByText('Questão 1 de 30')).toBeVisible()
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(1) // resposta continua marcada
  await page.getByText('Questão 1 de 30').click()
  await page.getByRole('button', { name: 'Entregar prova' }).click()
  await page.getByRole('button', { name: 'Entregar', exact: true }).click()
  await expect(page).toHaveURL(/\/resultado$/)
  await expect(page.getByText(/^\d+\/30$/)).toBeVisible()
})
