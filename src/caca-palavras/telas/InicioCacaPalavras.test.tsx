import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { expect, test } from 'vitest'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { criarPartida } from '../partida.ts'

async function renderizarInicio(opcoes: { emAndamento?: boolean } = {}) {
  const fabrica = new IDBFactory()
  const repo = criarRepositorio(await abrirBanco(fabrica))
  if (opcoes.emAndamento) {
    await repo.salvarPartida(
      criarPartida({ tema: 'curvas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(5), id: 'x' }),
    )
  }
  renderizarRota('/caca-palavras', { fabrica })
  return { repo }
}

test('escolher tema e nível e começar cria a partida e abre a grade', async () => {
  const { repo } = await renderizarInicio()
  await userEvent.click(await screen.findByRole('button', { name: /Curvas e relevo/ }))
  await userEvent.click(screen.getByRole('button', { name: /Médio/ }))
  await userEvent.click(screen.getByRole('button', { name: 'Começar' }))
  expect(await screen.findByRole('heading', { name: 'Curvas e relevo' })).toBeInTheDocument()
  expect(document.querySelectorAll('[data-celula]')).toHaveLength(100)
  expect(await repo.partidaEmAndamento()).toMatchObject({ tema: 'curvas', nivel: 'medio' })
})

test('padrões: tema Placas e nível Fácil marcados', async () => {
  await renderizarInicio()
  expect(await screen.findByRole('button', { name: /Placas/ })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: /Fácil/ })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: /Difícil/ })).toHaveAttribute('aria-pressed', 'false')
})

test('partida em andamento: Continuar abre; Começar pede para descartar', async () => {
  const { repo } = await renderizarInicio({ emAndamento: true }) // curvas · fácil · 0 de 5
  expect(await screen.findByText('Curvas e relevo · Fácil · 0 de 5 palavras')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Começar' }))
  expect(await screen.findByText('Descartar a partida em andamento?')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
  expect((await repo.partidaEmAndamento())?.id).toBe('x')
})

test('Continuar abre a partida em andamento', async () => {
  await renderizarInicio({ emAndamento: true })
  await userEvent.click(await screen.findByRole('button', { name: 'Continuar' }))
  expect(await screen.findByRole('heading', { name: 'Curvas e relevo' })).toBeInTheDocument()
  expect(document.querySelectorAll('[data-celula]')).toHaveLength(64)
})

test('Descartar confirmado apaga a partida em andamento', async () => {
  const { repo } = await renderizarInicio({ emAndamento: true })
  await userEvent.click(await screen.findByRole('button', { name: 'Descartar' }))
  expect(await screen.findByText('Descartar a partida em andamento?')).toBeInTheDocument()
  const botoes = screen.getAllByRole('button', { name: 'Descartar' })
  await userEvent.click(botoes[botoes.length - 1])
  await screen.findByRole('button', { name: 'Começar' })
  expect(screen.queryByText('Você tem uma partida em andamento')).not.toBeInTheDocument()
  expect(await repo.partidaEmAndamento()).toBeUndefined()
})
