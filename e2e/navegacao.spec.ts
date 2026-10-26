import { test, expect } from '@playwright/test'

test('navega entre abas no celular', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Simulado' })).toBeVisible()
  await page.getByRole('navigation').getByText('Histórico').click()
  await expect(page.getByRole('heading', { name: 'Histórico' })).toBeVisible()
})
