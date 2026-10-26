import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import App from './App'

test('abre no caça-palavras com a barra Caça-palavras, Simulado e Histórico', async () => {
  window.location.hash = '#/'
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Caça-palavras' })).toBeInTheDocument()
  const abas = within(screen.getByRole('navigation')).getAllByRole('link').map((a) => a.textContent)
  expect(abas).toEqual(['🔤Caça-palavras', '📝Simulado', '📊Histórico'])
})

test('engrenagem leva a Ajustes', async () => {
  render(<App />)
  await userEvent.click(await screen.findByLabelText('Ajustes'))
  expect(await screen.findByRole('heading', { name: 'Ajustes' })).toBeInTheDocument()
})
