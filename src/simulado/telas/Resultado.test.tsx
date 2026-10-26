import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, expect, test } from 'vitest'
import { QUESTOES_POR_ID } from '../../conteudo/index.ts'
import type { Area } from '../../conteudo/tipos.ts'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { iniciar } from '../fluxo.ts'
import { criarTentativa } from '../tentativa.ts'
import type { Tentativa } from '../tipos.ts'

let fabrica: IDBFactory
let repo: ReturnType<typeof criarRepositorio>

beforeEach(async () => {
  fabrica = new IDBFactory()
  repo = criarRepositorio(await abrirBanco(fabrica))
})

const qidsProva = () => [...QUESTOES_POR_ID.keys()].slice(0, 30)

async function salvarEntregue(t: Tentativa) {
  await repo.salvarTentativa(t)
  renderizarRota(`/simulado/${t.id}/resultado`, { fabrica })
}

function provaEntregueCom(acertos: number, porArea?: Partial<Record<Area, { acertos: number; total: number }>>) {
  const t = criarTentativa({ modo: 'prova', qids: qidsProva(), agora: 1000, rng: criarRng(1) })
  return {
    ...t,
    entregueEm: 1000 + 754_000,
    acertos,
    porArea: porArea ?? { 1: { acertos, total: 30 } },
    passou: acertos >= 20,
  }
}

test('20/30 na prova: PASSOU ✔; 19/30: NÃO PASSOU', async () => {
  await salvarEntregue(provaEntregueCom(20))
  expect(await screen.findByText('PASSOU ✔')).toBeInTheDocument()
  expect(screen.getByTestId('nota')).toHaveTextContent('20/30')
  expect(screen.getByText('mínimo 20 · tempo 12:34 de 60:00')).toBeInTheDocument()
})

test('19/30: NÃO PASSOU e aviso de entrega automática', async () => {
  const t = { ...provaEntregueCom(19), autoEntregue: true }
  await salvarEntregue(t)
  expect(await screen.findByText('NÃO PASSOU')).toBeInTheDocument()
  expect(screen.getByText(/entregue automaticamente/)).toBeInTheDocument()
})

test('aponta o ponto fraco e treina a área', async () => {
  await salvarEntregue(
    provaEntregueCom(22, {
      1: { acertos: 8, total: 8 },
      2: { acertos: 4, total: 4 },
      3: { acertos: 5, total: 13 },
      4: { acertos: 5, total: 5 },
    }),
  )
  expect(
    await screen.findByText('💡 Ponto fraco: Circulação e direção defensiva. Que tal um treino só disso?'),
  ).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Treinar Circulação e direção defensiva' }))
  const t = await repo.tentativaEmAndamento()
  expect(t?.modo).toBe('assunto')
  expect(t?.area).toBe(3)
})

test('sem ponto fraco quando tudo certo; "Refazer só as erradas" some com 0 erradas', async () => {
  const t = provaEntregueCom(30)
  t.itens = t.itens.map((it) => ({ ...it, resposta: QUESTOES_POR_ID.get(it.qid)!.correta }))
  await salvarEntregue({ ...t, porArea: { 1: { acertos: 30, total: 30 } } })
  expect(await screen.findByText('Revisar as 30 questões')).toBeInTheDocument()
  expect(screen.queryByText(/Ponto fraco/)).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Refazer só as/ })).not.toBeInTheDocument()
})

test('refaz só as erradas desta tentativa; com outra em andamento pede para descartar', async () => {
  const t = provaEntregueCom(28)
  t.itens = t.itens.map((it, i) => ({
    ...it,
    resposta: i < 2 ? null : QUESTOES_POR_ID.get(it.qid)!.correta,
  }))
  await salvarEntregue(t)
  await userEvent.click(await screen.findByRole('button', { name: 'Refazer só as 2 erradas' }))
  const nova = await repo.tentativaEmAndamento()
  expect(nova?.modo).toBe('erradas')
  expect(nova?.itens.map((i) => i.qid).sort()).toEqual([t.itens[0].qid, t.itens[1].qid].sort())
})

test('treino em andamento: pergunta antes de descartar, sem lançar erro', async () => {
  await iniciar(repo, { modo: 'treino', agora: 5, rng: criarRng(2) })
  const t = provaEntregueCom(10, { 2: { acertos: 1, total: 4 }, 1: { acertos: 9, total: 26 } })
  t.itens = t.itens.map((it) => ({ ...it, resposta: null }))
  await salvarEntregue(t)
  await userEvent.click(await screen.findByRole('button', { name: 'Refazer só as 30 erradas' }))
  expect(await screen.findByText('Descartar o treino em andamento?')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Descartar' }))
  await screen.findByText(/Questão 1 de/)
  expect((await repo.tentativaEmAndamento())?.modo).toBe('erradas')
})

test('fora da prova mostra o modo e o tempo, sem selo', async () => {
  const t = { ...provaEntregueCom(5), modo: 'assunto' as const, area: 2 as Area, passou: null, terminaEm: null }
  await salvarEntregue(t)
  expect(await screen.findByText('Por assunto: Infrações · tempo 12:34')).toBeInTheDocument()
  expect(screen.queryByText('PASSOU ✔')).not.toBeInTheDocument()
  expect(screen.queryByText('NÃO PASSOU')).not.toBeInTheDocument()
})
