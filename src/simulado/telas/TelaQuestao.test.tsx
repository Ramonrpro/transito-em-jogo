import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { QUESTOES_POR_ID } from '../../conteudo/index.ts'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { iniciar } from '../fluxo.ts'

const falhas = vi.hoisted(() => ({ entregas: 0 }))
vi.mock('../fluxo.ts', async (original) => {
  const real = await original<typeof import('../fluxo.ts')>()
  return {
    ...real,
    entregarEPersistir: (...args: Parameters<typeof real.entregarEPersistir>) => {
      if (falhas.entregas > 0) {
        falhas.entregas--
        return Promise.reject(new Error('conexão perdida'))
      }
      return real.entregarEPersistir(...args)
    },
  }
})

let fabrica: IDBFactory
let repo: ReturnType<typeof criarRepositorio>

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] })
  fabrica = new IDBFactory()
  repo = criarRepositorio(await abrirBanco(fabrica))
})
afterEach(() => {
  falhas.entregas = 0
  vi.useRealTimers()
})

async function prepararProva() {
  const t = await iniciar(repo, { modo: 'prova', agora: Date.now(), rng: criarRng(1) })
  renderizarRota(`/simulado/${t.id}`, { fabrica })
  await screen.findByText('Questão 1 de 30')
  return t
}

async function prepararTreinoCom(qid: string) {
  const t = await iniciar(repo, { modo: 'erradas', qids: [qid], agora: Date.now(), rng: criarRng(1) })
  renderizarRota(`/simulado/${t.id}`, { fabrica })
  await screen.findByText('Questão 1 de 1')
  return t
}

const alternativaErrada = (t: { itens: { qid: string; ordem: number[] }[] }) => {
  const q = QUESTOES_POR_ID.get(t.itens[0].qid)!
  const pos = t.itens[0].ordem.findIndex((o) => o !== q.correta)
  return screen.getAllByRole('button', { pressed: false })[pos]
}

test('prova mostra "Questão 1 de 30" e 60:00, e entrega sozinha ao zerar', async () => {
  const t = await prepararProva()
  expect(screen.getByText(/60:00/)).toBeInTheDocument()
  await act(() => vi.advanceTimersByTimeAsync(3_600_000 + 1000))
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
  const salva = await repo.obterTentativa(t.id)
  expect(salva!.entregueEm).not.toBeNull()
  expect(salva!.autoEntregue).toBe(true)
})

test('prova: marcar, revisar e entregar pelo mapa pedindo confirmação', async () => {
  const t = await prepararProva()
  await userEvent.click(screen.getByRole('button', { name: /^B/ }))
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /^B/ })).toHaveAttribute('aria-pressed', 'true'),
  )
  await userEvent.click(screen.getByRole('button', { name: '☆ Revisar depois' }))
  expect(await screen.findByRole('button', { name: '★ Marcada para revisar' })).toBeInTheDocument()
  await userEvent.click(screen.getByText('Questão 1 de 30'))
  await userEvent.click(screen.getByRole('button', { name: 'Entregar prova' }))
  expect(await screen.findByText('Entregar a prova?')).toBeInTheDocument()
  expect(screen.getByText('Você deixou 29 questões sem resposta.')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Entregar' }))
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
  const salva = await repo.obterTentativa(t.id)
  expect(salva!.entregueEm).not.toBeNull()
  expect(salva!.autoEntregue).toBe(false)
})

test('treino mostra a correta e o "Por quê?" depois de errar', async () => {
  const t = await prepararTreinoCom('leg-074')
  await userEvent.click(alternativaErrada(t))
  expect(screen.getByText('Por quê?')).toBeInTheDocument()
  expect(document.querySelector('[data-estado="correta"]')).not.toBeNull()
  expect(document.querySelector('[data-estado="errada"]')).not.toBeNull()
  expect(screen.getByText(/no banco oficial esta questão aparece com a resposta/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Ver resultado' }))
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
})

test('imagem de placa não entrega a resposta', async () => {
  await prepararTreinoCom('sin-001')
  expect(screen.getByRole('img')).toHaveAttribute('alt', 'Imagem da placa')
})

test('ao zerar, um toque logo depois não reabre a prova entregue', async () => {
  const t = await prepararProva()
  await act(() => vi.advanceTimersByTimeAsync(3_600_000 + 1000))
  await userEvent.click(screen.queryByRole('button', { name: /^B/ }) ?? document.body)
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
  const salva = await repo.obterTentativa(t.id)
  expect(salva!.entregueEm).not.toBeNull()
  expect(salva!.autoEntregue).toBe(true)
  expect(await repo.tentativaEmAndamento()).toBeUndefined()
})

test('entregar com 1 questão em branco usa o singular', async () => {
  const t = await prepararProva()
  for (let i = 0; i < 29; i++) {
    await userEvent.click(screen.getByRole('button', { name: /^A/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Próxima questão' }))
  }
  await userEvent.click(screen.getByRole('button', { name: 'Entregar' }))
  expect(await screen.findByText('Você deixou 1 questão sem resposta.')).toBeInTheDocument()
  expect(t.id).toBeTruthy()
})

test('treino: certo e errado também aparecem em texto, não só em cor', async () => {
  const t = await prepararTreinoCom('leg-074')
  await userEvent.click(alternativaErrada(t))
  expect(screen.getByText('Correta')).toBeInTheDocument()
  expect(screen.getByText('Sua resposta')).toBeInTheDocument()
  expect(document.querySelector('[data-estado="correta"]')).toHaveTextContent('Correta')
  expect(document.querySelector('[data-estado="errada"]')).toHaveTextContent('Sua resposta')
})

test('entrega que falha mostra o aviso e deixa tentar de novo', async () => {
  const t = await prepararProva()
  falhas.entregas = 1
  await userEvent.click(screen.getByText('Questão 1 de 30'))
  await userEvent.click(screen.getByRole('button', { name: 'Entregar prova' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Entregar' }))
  const alerta = await screen.findByRole('alert')
  expect(alerta).toHaveTextContent('Não foi possível salvar a entrega. Tente de novo.')
  expect((await repo.obterTentativa(t.id))!.entregueEm).toBeNull()
  await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
  expect((await repo.obterTentativa(t.id))!.entregueEm).not.toBeNull()
})

test('entrega automática que falha também pode ser repetida, mantendo o flag auto', async () => {
  const t = await prepararProva()
  falhas.entregas = 1
  await act(() => vi.advanceTimersByTimeAsync(3_600_000 + 1000))
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível salvar a entrega.')
  await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
  const salva = await repo.obterTentativa(t.id)
  expect(salva!.autoEntregue).toBe(true)
  expect(salva!.entregueEm).toBe(t.terminaEm)
})
