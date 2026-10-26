import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import ConviteInstalar from './ConviteInstalar'

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(IPHONE)
  localStorage.clear()
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function montar(rota: string) {
  render(
    <MemoryRouter initialEntries={[rota]}>
      <ConviteInstalar />
    </MemoryRouter>,
  )
}

test('no iPhone aparece após 1,5 s e "Entendi" grava a dispensa', () => {
  montar('/simulado')
  expect(screen.queryByText('Instale o app')).toBeNull()
  act(() => void vi.advanceTimersByTime(1500))
  expect(screen.getByText('Instale o app')).toBeInTheDocument()
  act(() => screen.getByRole('button', { name: 'Entendi' }).click())
  expect(screen.queryByText('Instale o app')).toBeNull()
  expect(localStorage.getItem('tej:conviteDispensadoEm')).not.toBeNull()
})

test('nunca aparece com a prova em andamento', () => {
  montar('/simulado/abc')
  act(() => void vi.advanceTimersByTime(5000))
  expect(screen.queryByText('Instale o app')).toBeNull()
})
