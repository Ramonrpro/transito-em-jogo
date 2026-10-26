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

async function renderizarRevisao(
  itens: { qid: string; ordem: number[]; resposta: number | null; versao?: string }[],
  opcoes: { entregue?: boolean } = {},
) {
  const t = criarTentativa({ modo: 'treino', qids: itens.map((i) => i.qid), agora: 1, rng: criarRng(1) })
  t.itens = itens.map((i) => ({ ...i, revisar: false }))
  t.entregueEm = opcoes.entregue === false ? null : 2
  t.acertos = 0
  t.porArea = {}
  await repo.salvarTentativa(t)
  renderizarRota(`/simulado/${t.id}/revisao`, { fabrica })
  if (opcoes.entregue !== false) await screen.findAllByTestId('questao-revisao')
  return t
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

test('resposta certa marcada mostra "Sua resposta · Correta"; sem resposta mostra "Sem resposta"', async () => {
  await renderizarRevisao([
    { qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 2 },
    { qid: 'sin-002', ordem: [0, 1, 2, 3], resposta: null },
  ])
  const [primeira, segunda] = screen.getAllByTestId('questao-revisao')
  expect(within(primeira).getByText('Sua resposta · Correta')).toBeInTheDocument()
  expect(within(primeira).queryByText('Correta', { exact: true })).not.toBeInTheDocument()
  const alts = within(primeira).getAllByTestId('alternativa')
  expect(alts[2]).toHaveAttribute('data-estado', 'correta-marcada')
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

test('correta não marcada e errada marcada têm estados e textos distintos', async () => {
  await renderizarRevisao([{ qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 0 }])
  const alts = screen.getAllByTestId('alternativa')
  expect(alts[0]).toHaveAttribute('data-estado', 'errada')
  expect(alts[0]).toHaveTextContent('Sua resposta')
  expect(alts[0]).not.toHaveTextContent('Correta')
  expect(alts[2]).toHaveAttribute('data-estado', 'correta')
  expect(alts[2]).toHaveTextContent('Correta')
  expect(alts[2]).not.toHaveTextContent('Sua resposta')
})

test('tentativa em andamento redireciona para a questão e não revela o gabarito', async () => {
  const t = await renderizarRevisao([{ qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: null }], {
    entregue: false,
  })
  expect(await screen.findByText('Questão 1 de 1')).toBeInTheDocument()
  expect(screen.queryByTestId('questao-revisao')).not.toBeInTheDocument()
  expect(screen.queryByText('Correta')).not.toBeInTheDocument()
  expect(t.id).toBeTruthy()
})

test('aviso de "atualizada" só quando a versão guardada difere da atual', async () => {
  const atual = QUESTOES_POR_ID.get('sin-001')!.versao
  await renderizarRevisao([
    { qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 2, versao: 'antiga00' },
    { qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 2, versao: atual },
    { qid: 'sin-001', ordem: [0, 1, 2, 3], resposta: 2 },
  ])
  const [a, b, c] = screen.getAllByTestId('questao-revisao')
  const aviso = 'Esta questão foi atualizada depois da sua prova.'
  expect(within(a).getByText(aviso)).toBeInTheDocument()
  expect(within(a).getAllByTestId('alternativa')).toHaveLength(4)
  expect(within(b).queryByText(aviso)).not.toBeInTheDocument()
  expect(within(c).queryByText(aviso)).not.toBeInTheDocument()
})
