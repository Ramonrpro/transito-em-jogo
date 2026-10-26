import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import App from './App'

test('abre no simulado e mostra a barra inferior com Simulado e Histórico', async () => {
  window.location.hash = '#/'
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Simulado' })).toBeInTheDocument()
  const nav = screen.getByRole('navigation')
  expect(within(nav).getByText('Simulado')).toBeInTheDocument()
  expect(within(nav).getByText('Histórico')).toBeInTheDocument()
})

test('engrenagem leva a Ajustes', async () => {
  render(<App />)
  await userEvent.click(await screen.findByLabelText('Ajustes'))
  expect(await screen.findByRole('heading', { name: 'Ajustes' })).toBeInTheDocument()
})
