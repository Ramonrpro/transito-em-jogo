import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { expect, test } from 'vitest'
import { abrirBanco } from '../dados/db.ts'
import { criarRepositorio } from '../dados/repositorio.ts'
import { renderizarRota } from '../testes/renderizar.tsx'
import { criarRng } from '../util/aleatorio.ts'
import { criarTentativa } from '../simulado/tentativa.ts'
import type { Modo, Tentativa } from '../simulado/tipos.ts'

type Quando = 'hoje' | 'ontem'
let contador = 0

function entregue(modo: Modo, acertos: number, total: number, quando: Quando, passou: boolean | null): Tentativa {
  const d = new Date()
  const base =
    quando === 'hoje'
      ? Date.now() - 600_000
      : new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 12).getTime()
  const iniciadaEm = base + ++contador * 1000
  const t = criarTentativa({
    modo,
    area: modo === 'assunto' ? 3 : null,
    qids: Array.from({ length: total }, (_, i) => `q${i}`),
    agora: iniciadaEm,
    rng: criarRng(1),
  })
  return { ...t, entregueEm: iniciadaEm + 600_000, acertos, passou, porArea: null }
}

const prova = (acertos: number, quando: Quando) => entregue('prova', acertos, 30, quando, acertos >= 20)
const treino = (acertos: number, quando: Quando) => entregue('treino', acertos, 10, quando, null)
const assunto = (acertos: number) => entregue('assunto', acertos, 10, 'hoje', null)

async function renderizarHistorico(tentativas: Tentativa[]) {
  const fabrica = new IDBFactory()
  const repo = criarRepositorio(await abrirBanco(fabrica))
  for (const t of tentativas) await repo.salvarTentativa(t)
  renderizarRota('/historico', { fabrica })
}

const caixa = (nome: string) => screen.getByText(nome).parentElement as HTMLElement

test('conta simulados e aprovados e lista do mais recente', async () => {
  await renderizarHistorico([prova(25, 'ontem'), prova(18, 'hoje'), treino(8, 'hoje')])
  const linhas = await screen.findAllByTestId('atividade')
  expect(caixa('simulados')).toHaveTextContent('2')
  expect(caixa('aprovados')).toHaveTextContent('1')
  expect(linhas[0]).toHaveTextContent('Treino · 8/10')
  expect(linhas[1]).toHaveTextContent('Prova · 18/30 ✘')
  expect(linhas[2]).toHaveTextContent('Prova · 25/30 ✔')
  expect(linhas[2]).toHaveTextContent('ontem, 10 min')
})

test('rotula treino por assunto com a área', async () => {
  await renderizarHistorico([assunto(7)])
  const linha = await screen.findByTestId('atividade')
  expect(linha).toHaveTextContent('🎯 Circulação e direção defensiva · 7/10')
})

test('tocar na atividade abre o resultado', async () => {
  const t = treino(8, 'hoje')
  await renderizarHistorico([t])
  const linha = await screen.findByTestId('atividade')
  expect(within(linha).getByRole('link')).toHaveAttribute('href', `/simulado/${t.id}/resultado`)
  await userEvent.click(linha.querySelector('a') as HTMLElement)
})

test('histórico vazio convida a começar', async () => {
  await renderizarHistorico([])
  expect(await screen.findByText('Nenhum simulado ainda.')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Fazer a primeira prova' }))
  expect(await screen.findByText(/simulado/i, { selector: 'h1' })).toBeInTheDocument()
})
