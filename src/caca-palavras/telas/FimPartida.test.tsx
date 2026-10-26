import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { expect, test } from 'vitest'
import { PALAVRAS_POR_GRADE } from '../../conteudo/index.ts'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { criarPartida } from '../partida.ts'
import type { Colocacao } from '../tipos.ts'

async function renderizarFim(
  opcoes: { tempoMs?: number; anteriores?: number[]; colocacoesExtras?: Colocacao[]; rota?: string } = {},
) {
  const fabrica = new IDBFactory()
  const repo = criarRepositorio(await abrirBanco(fabrica))
  const base = criarPartida({ tema: 'curvas', nivel: 'medio', jaAchadas: new Set(), agora: 0, rng: criarRng(5), id: 'x' })
  const colocacoes = [...base.colocacoes, ...(opcoes.colocacoesExtras ?? [])]
  const p = {
    ...base,
    colocacoes,
    achadas: colocacoes.map((c) => c.palavra),
    tempoMs: opcoes.tempoMs ?? 100_000,
    terminadaEm: 1_000_000,
  }
  await repo.salvarPartida(p)
  const anteriores = opcoes.anteriores ?? []
  for (const [i, tempoMs] of anteriores.entries()) {
    const o = criarPartida({
      tema: 'curvas', nivel: 'medio', jaAchadas: new Set(), agora: 0, rng: criarRng(10 + i), id: `a${i}`,
    })
    await repo.salvarPartida({ ...o, achadas: o.colocacoes.map((c) => c.palavra), tempoMs, terminadaEm: 500_000 + i })
  }
  renderizarRota(opcoes.rota ?? '/caca-palavras/x/fim', { fabrica })
  return { repo, p }
}

test('fim mostra tempo, recorde e o que aprendeu', async () => {
  await renderizarFim({ tempoMs: 277_000, anteriores: [250_000] }) // curvas · médio
  expect(await screen.findByRole('heading', { name: '🏁 Achou todas!' })).toBeInTheDocument()
  expect(screen.getByText('Curvas e relevo · Médio · 04:37')).toBeInTheDocument()
  expect(screen.getByText('Seu melhor tempo neste tema e nível: 04:10')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'O que você aprendeu' })).toBeInTheDocument()
})

test('lista cada palavra achada com a dica', async () => {
  const { p } = await renderizarFim()
  const w = p.colocacoes[0].palavra
  const info = PALAVRAS_POR_GRADE.get(w)!
  expect(await screen.findByText(info.palavra)).toBeInTheDocument()
  expect(screen.getByText(info.dica)).toBeInTheDocument()
})

test('novo recorde e primeira partida', async () => {
  await renderizarFim({ tempoMs: 200_000, anteriores: [250_000] })
  expect(await screen.findByText('🏆 Novo recorde neste tema e nível!')).toBeInTheDocument()
})

test('primeira partida', async () => {
  await renderizarFim({ tempoMs: 200_000 })
  expect(await screen.findByText('Primeira partida neste tema e nível.')).toBeInTheDocument()
})

test('palavra que saiu do conteúdo não quebra o fim', async () => {
  await renderizarFim({ colocacoesExtras: [{ palavra: 'XYZW', celulas: [0, 1, 2, 3] }] })
  expect(await screen.findByText('XYZW')).toBeInTheDocument()
})

test('partida inexistente mostra aviso e link', async () => {
  await renderizarFim({ rota: '/caca-palavras/nao-existe/fim' })
  expect(await screen.findByText('Partida não encontrada.')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Voltar ao caça-palavras' })).toBeInTheDocument()
})

test('Jogar de novo cria outra partida do mesmo tema e nível', async () => {
  const { repo } = await renderizarFim()
  await userEvent.click(await screen.findByRole('button', { name: 'Jogar de novo' }))
  expect(await screen.findByRole('heading', { name: 'Curvas e relevo' })).toBeInTheDocument()
  expect(document.querySelectorAll('[data-celula]')).toHaveLength(100)
  const nova = await repo.partidaEmAndamento()
  expect(nova).toMatchObject({ tema: 'curvas', nivel: 'medio' })
  expect(nova?.id).not.toBe('x')
})

test('Escolher outro tema volta ao início', async () => {
  await renderizarFim()
  await userEvent.click(await screen.findByRole('button', { name: 'Escolher outro tema' }))
  expect(await screen.findByRole('heading', { name: 'Escolha um tema' })).toBeInTheDocument()
})
