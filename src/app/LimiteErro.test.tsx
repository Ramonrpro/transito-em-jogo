import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import LimiteErro from './LimiteErro.tsx'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function Bomba(): never {
  throw new Error('boom')
}

test('erro de renderização mostra o aviso e o botão recarrega', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const recarregar = vi.fn()
  vi.stubGlobal('location', { ...window.location, reload: recarregar })
  render(
    <LimiteErro>
      <Bomba />
    </LimiteErro>,
  )
  expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado. Suas respostas já salvas não se perdem.')
  await userEvent.click(screen.getByRole('button', { name: 'Recarregar' }))
  expect(recarregar).toHaveBeenCalled()
})

test('promessa rejeitada sem tratamento também mostra o aviso', () => {
  render(
    <LimiteErro>
      <p>tudo certo</p>
    </LimiteErro>,
  )
  expect(screen.getByText('tudo certo')).toBeInTheDocument()
  act(() => {
    window.dispatchEvent(new Event('unhandledrejection'))
  })
  expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado.')
})
