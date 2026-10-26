import { screen, within } from '@testing-library/react'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, expect, test } from 'vitest'
import { QUESTOES_POR_ID } from '../../conteudo/index.ts'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { criarTentativa } from '../tentativa.ts'

let fabrica: IDBFactory
let repo: ReturnType<typeof criarRepositorio>

beforeEach(async () => {
  fabrica = new IDBFactory()
  repo = criarRepositorio(await abrirBanco(fabrica))
})

async function renderizarRevisao(itens: { qid: string; ordem: number[]; resposta: number | null }[]) {
  const t = criarTentativa({ modo: 'treino', qids: itens.map((i) => i.qid), agora: 1, rng: criarRng(1) })
  t.itens = itens.map((i) => ({ ...i, revisar: false }))
  t.entregueEm = 2
  t.acertos = 0
  t.porArea = {}
  await repo.salvarTentativa(t)
  renderizarRota(`/simulado/${t.id}/revisao`, { fabrica })
  await screen.findAllByTestId('questao-revisao')
}

test('revisão respeita a ordem salva e marca a resposta', async () => {
  const q = QUESTOES_POR_ID.get('sin-001')!
  await renderizarRevisao([{ qid: 'sin-001', ordem: [3, 2, 1, 0], resposta: 3 }])
  const alts = screen.getAllByTestId('alternativa')
  expect(alts[0]).toHaveTextContent(q.alternativas[3])
  expect(alts[0]).toHaveTextContent('Sua resposta')
  expect(alts[1]).toHaveTextContent('Correta') // original 2 é a correta
  expect(screen.getByText(/Por quê\?/)).toBeInTheDocument()
})

test('resposta certa leva só "Correta"; sem resposta mostra "Sem resposta"', async () => {
  await renderizarRevisao([
    { qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 2 },
    { qid: 'sin-002', ordem: [0, 1, 2, 3], resposta: null },
  ])
  const [primeira, segunda] = screen.getAllByTestId('questao-revisao')
  expect(within(primeira).queryByText('Sua resposta')).not.toBeInTheDocument()
  expect(within(primeira).getByText('Correta')).toBeInTheDocument()
  expect(within(segunda).getByText('Sem resposta')).toBeInTheDocument()
})

test('questão removida do banco não quebra a revisão', async () => {
  await renderizarRevisao([
    { qid: 'sin-033', ordem: [0, 1, 2, 3], resposta: 1 },
    { qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 2 },
  ])
  expect(screen.getByText('Esta questão foi removida do banco depois da sua prova.')).toBeInTheDocument()
  expect(screen.getAllByTestId('alternativa')).toHaveLength(4)
})
