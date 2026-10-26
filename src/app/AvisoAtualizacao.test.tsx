import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import AvisoAtualizacao from './AvisoAtualizacao'

const atualizar = vi.fn()
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [true, vi.fn()], offlineReady: [false, vi.fn()], updateServiceWorker: atualizar }),
}))

const montar = (rota: string) =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <AvisoAtualizacao />
    </MemoryRouter>,
  )

test('não aparece durante a prova', () => {
  montar('/simulado/abc')
  expect(screen.queryByText('Nova versão disponível')).toBeNull()
})

test('fora da prova mostra o aviso e Atualizar chama o service worker uma vez', async () => {
  montar('/simulado')
  expect(screen.getByText('Nova versão disponível')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Atualizar' }))
  expect(atualizar).toHaveBeenCalledExactlyOnceWith(true)
})
