import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { expect, test } from 'vitest'
import { abrirBanco } from '../../dados/db.ts'
import { criarRepositorio } from '../../dados/repositorio.ts'
import { renderizarRota } from '../../testes/renderizar.tsx'
import { criarRng } from '../../util/aleatorio.ts'
import { iniciar } from '../fluxo.ts'

const fabricaQuebrada = {
  open() {
    throw new Error('sem IndexedDB')
  },
} as unknown as IDBFactory

test('"Refazer erradas (0)" fica desabilitado e "já viu 0 de 379"', async () => {
  renderizarRota('/simulado', { fabrica: new IDBFactory() })
  expect(await screen.findByRole('button', { name: /Refazer erradas \(0\)/ })).toBeDisabled()
  expect(screen.getByText('Banco: já viu 0 de 379 questões')).toBeInTheDocument()
})

test('sem IndexedDB mostra o aviso de memória', async () => {
  renderizarRota('/simulado', { fabrica: fabricaQuebrada })
  expect(await screen.findByText(/não está salvando dados/)).toBeInTheDocument()
})

test('com prova em andamento mostra o cartão e pede confirmação para descartar', async () => {
  const fabrica = new IDBFactory()
  const repo = criarRepositorio(await abrirBanco(fabrica))
  await iniciar(repo, { modo: 'prova', agora: Date.now(), rng: criarRng(1) })
  renderizarRota('/simulado', { fabrica })
  expect(await screen.findByText(/Você tem uma prova em andamento · faltam 59:/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Descartar' }))
  expect(await screen.findByText('Descartar a prova em andamento?')).toBeInTheDocument()
  expect(screen.getByText('Ela não vai para o histórico.')).toBeInTheDocument()
  await userEvent.click(screen.getAllByRole('button', { name: 'Descartar' }).at(-1)!)
  await screen.findByText('Banco: já viu 0 de 379 questões')
  expect(screen.queryByText(/em andamento/)).not.toBeInTheDocument()
  expect(await repo.tentativaEmAndamento()).toBeUndefined()
})

test('prova expirada encontrada ao abrir vai direto para o resultado', async () => {
  const fabrica = new IDBFactory()
  const repo = criarRepositorio(await abrirBanco(fabrica))
  const t = await iniciar(repo, { modo: 'prova', agora: Date.now() - 4_000_000, rng: criarRng(1) })
  renderizarRota('/simulado', { fabrica })
  expect(await screen.findByRole('heading', { name: 'Resultado' })).toBeInTheDocument()
  expect((await repo.obterTentativa(t.id))!.autoEntregue).toBe(true)
})

test('"Por assunto" abre a escolha entre as 4 áreas', async () => {
  renderizarRota('/simulado', { fabrica: new IDBFactory() })
  await userEvent.click(await screen.findByRole('button', { name: /Por assunto/ }))
  expect(screen.getByRole('button', { name: 'Placas e sinalização' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Infrações' })).toBeInTheDocument()
})
