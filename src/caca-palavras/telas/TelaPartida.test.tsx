import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { expect, test, vi } from 'vitest'
import { PALAVRAS_POR_GRADE, PLACAS_POR_CODIGO } from '../../conteudo/index.ts'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { criarPartida } from '../partida.ts'

async function abrirPartida() {
  const fabrica = new IDBFactory()
  const repo = criarRepositorio(await abrirBanco(fabrica))
  const p = criarPartida({ tema: 'curvas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(5), id: 'x' })
  await repo.salvarPartida(p)
  renderizarRota('/caca-palavras/x', { fabrica })
  return { p, repo }
}

// lança enquanto a casa não existe, para o waitFor tentar de novo
const casa = (i: number) => {
  const el = document.querySelector(`[data-celula="${i}"]`)
  if (!el) throw new Error(`casa ${i} ainda não existe`)
  return el as HTMLElement
}

test('mostra tema, contagem e as 64 casas do fácil', async () => {
  await abrirPartida()
  expect(await screen.findByRole('heading', { name: 'Curvas e relevo' })).toBeInTheDocument()
  expect(screen.getByText('0 de 5')).toBeInTheDocument()
  expect(document.querySelectorAll('[data-celula]')).toHaveLength(64)
})

test('tocar na primeira e na última letra acha a palavra, mostra o cartão e grava', async () => {
  const { p, repo } = await abrirPartida()
  const c = p.colocacoes[0]
  await userEvent.click(await waitFor(() => casa(c.celulas[0])))
  await userEvent.click(casa(c.celulas.at(-1)!))
  expect(await screen.findByRole('heading', { name: 'Achou!' })).toBeInTheDocument()
  expect(screen.getByText(PALAVRAS_POR_GRADE.get(c.palavra)!.significado)).toBeInTheDocument()
  expect(screen.getByText('1 de 5')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: `${c.palavra}, achada` })).toBeInTheDocument()
  await waitFor(async () => expect((await repo.obterPartida('x'))!.achadas).toEqual([c.palavra]))
})

test('tocar duas vezes na mesma casa cancela', async () => {
  const { p } = await abrirPartida()
  const c = p.colocacoes[0]
  await userEvent.click(await waitFor(() => casa(c.celulas[0])))
  await userEvent.click(casa(c.celulas[0]))
  await userEvent.click(casa(c.celulas.at(-1)!)) // vira nova âncora, não seleção
  expect(screen.queryByRole('heading', { name: 'Achou!' })).not.toBeInTheDocument()
})

test('etiqueta mostra a dica', async () => {
  const { p } = await abrirPartida()
  const w = p.colocacoes[0].palavra
  await userEvent.click(await screen.findByRole('button', { name: w }))
  expect(screen.getByText(`${w}: ${PALAVRAS_POR_GRADE.get(w)!.dica}`)).toBeInTheDocument()
})

test('palavra com placa mostra a imagem com o nome no alt', async () => {
  const { p } = await abrirPartida()
  // no fácil de Curvas cabem 10 palavras, 6 com placa: as 5 sorteadas sempre incluem uma
  const c = p.colocacoes.find((c) => PALAVRAS_POR_GRADE.get(c.palavra)!.placa)!
  const placa = PLACAS_POR_CODIGO.get(PALAVRAS_POR_GRADE.get(c.palavra)!.placa!)!
  await userEvent.click(await waitFor(() => casa(c.celulas[0])))
  await userEvent.click(casa(c.celulas.at(-1)!))
  expect(await screen.findByAltText(`Placa ${placa.codigo}: ${placa.nome}`)).toBeInTheDocument()
})

test('a última palavra conclui a partida e o botão vira "Ver resultado"', async () => {
  const { p, repo } = await abrirPartida()
  for (const c of p.colocacoes) {
    await userEvent.click(await waitFor(() => casa(c.celulas[0])))
    await userEvent.click(casa(c.celulas.at(-1)!))
    if (c !== p.colocacoes.at(-1)) await userEvent.click(await screen.findByRole('button', { name: 'Continuar' }))
  }
  expect(await screen.findByRole('button', { name: 'Ver resultado' })).toBeInTheDocument()
  await waitFor(async () => expect((await repo.obterPartida('x'))!.terminadaEm).not.toBeNull())
})

test('o tempo só conta com a tela visível', async () => {
  const agora = vi.spyOn(Date, 'now').mockReturnValue(1_000)
  const { p, repo } = await abrirPartida()
  await waitFor(() => casa(0))
  agora.mockReturnValue(6_000)
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
  document.dispatchEvent(new Event('visibilitychange'))
  await waitFor(async () => expect((await repo.obterPartida('x'))!.tempoMs).toBe(5_000))
  agora.mockReturnValue(60_000)
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
  document.dispatchEvent(new Event('visibilitychange'))
  agora.mockReturnValue(61_000)
  const c = p.colocacoes[0]
  await userEvent.click(casa(c.celulas[0]))
  await userEvent.click(casa(c.celulas.at(-1)!))
  await waitFor(async () => expect((await repo.obterPartida('x'))!.tempoMs).toBe(6_000))
  agora.mockRestore()
  Reflect.deleteProperty(document, 'visibilityState')
})

test('partida inexistente', async () => {
  renderizarRota('/caca-palavras/nada', { fabrica: new IDBFactory() })
  expect(await screen.findByText('Partida não encontrada.')).toBeInTheDocument()
})
