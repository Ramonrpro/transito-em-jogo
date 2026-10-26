import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { afterEach, expect, test, vi } from 'vitest'
import { exportarCopia } from '../dados/backup.ts'
import { abrirBanco } from '../dados/db.ts'
import { criarRepositorio } from '../dados/repositorio.ts'
import { criarTentativa } from '../simulado/tentativa.ts'
import type { Tentativa } from '../simulado/tipos.ts'
import { renderizarRota } from '../testes/renderizar.tsx'
import { criarRng } from '../util/aleatorio.ts'

let fabrica: IDBFactory

afterEach(() => vi.restoreAllMocks())

function tent(p: { id: string; entregueEm: number }): Tentativa {
  const t = criarTentativa({ modo: 'treino', area: null, qids: ['q1', 'q2'], agora: 1, rng: criarRng(1) })
  return { ...t, id: p.id, entregueEm: p.entregueEm, acertos: 1, passou: null, porArea: null }
}

const repoDoTeste = async () => criarRepositorio(await abrirBanco(fabrica))

async function renderizarComTentativa(rota: string, t: Tentativa) {
  fabrica = new IDBFactory()
  await (await repoDoTeste()).salvarTentativa(t)
  renderizarRota(rota, { fabrica })
  await screen.findByText('Seus dados (ficam só neste celular)')
}

const ids = async () => (await (await repoDoTeste()).listarTentativas()).map((t) => t.id)
const arquivo = (conteudo: string) => new File([conteudo], 'x.json', { type: 'application/json' })

test('restaurar arquivo inválido mostra erro e mantém o histórico', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  await userEvent.upload(screen.getByLabelText('📂 Restaurar de uma cópia'), arquivo('{"app":"outro"}'))
  await userEvent.click(await screen.findByRole('button', { name: 'Restaurar' }))
  expect(await screen.findByText('Este arquivo não é uma cópia válida do Trânsito em Jogo.')).toBeInTheDocument()
  expect(await ids()).toEqual(['a'])
})

test('arquivo que não é JSON também é formato inválido', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  await userEvent.upload(screen.getByLabelText('📂 Restaurar de uma cópia'), arquivo('não é json'))
  await userEvent.click(await screen.findByRole('button', { name: 'Restaurar' }))
  expect(await screen.findByText('Este arquivo não é uma cópia válida do Trânsito em Jogo.')).toBeInTheDocument()
  expect(await ids()).toEqual(['a'])
})

test('cópia de versão mais nova mostra a mensagem certa e mantém o histórico', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  const copia = { ...(await exportarCopia(await abrirBanco(fabrica), 5)), formato: 99 }
  await userEvent.upload(screen.getByLabelText('📂 Restaurar de uma cópia'), arquivo(JSON.stringify(copia)))
  await userEvent.click(await screen.findByRole('button', { name: 'Restaurar' }))
  expect(
    await screen.findByText('Esta cópia foi feita numa versão mais nova do app. Atualize o app e tente de novo.'),
  ).toBeInTheDocument()
  expect(await ids()).toEqual(['a'])
})

test('restaurar cópia válida substitui o histórico só depois de confirmar', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  const copia = {
    app: 'transito-em-jogo',
    formato: 1,
    exportadaEm: 5,
    tentativas: [tent({ id: 'b', entregueEm: 3 })],
    erradas: [],
    vistas: [],
  }
  await userEvent.upload(screen.getByLabelText('📂 Restaurar de uma cópia'), arquivo(JSON.stringify(copia)))
  expect(await screen.findByText('Restaurar esta cópia?')).toBeInTheDocument()
  expect(screen.getByText('O histórico atual deste celular será substituído.')).toBeInTheDocument()
  expect(await ids()).toEqual(['a'])
  await userEvent.click(screen.getByRole('button', { name: 'Restaurar' }))
  expect(await screen.findByText('Cópia restaurada.')).toBeInTheDocument()
  expect(await ids()).toEqual(['b'])
})

test('cancelar a restauração não altera nada', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  await userEvent.upload(screen.getByLabelText('📂 Restaurar de uma cópia'), arquivo('{}'))
  await userEvent.click(await screen.findByRole('button', { name: 'Cancelar' }))
  expect(screen.queryByText('Este arquivo não é uma cópia válida do Trânsito em Jogo.')).not.toBeInTheDocument()
  expect(await ids()).toEqual(['a'])
})

test('apagar pede confirmação e limpa', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  await userEvent.click(screen.getByText('🗑 Apagar meu histórico'))
  expect(await screen.findByText('Apagar todo o seu histórico deste celular?')).toBeInTheDocument()
  expect(screen.getByText('Isso não pode ser desfeito.')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Apagar' }))
  await vi.waitFor(async () => expect(await ids()).toEqual([]))
})

test('salvar cópia baixa um JSON com o nome do arquivo', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  let blob: Blob | undefined
  URL.createObjectURL = vi.fn((b: Blob) => ((blob = b), 'blob:x'))
  URL.revokeObjectURL = vi.fn()
  const nomes: string[] = []
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    nomes.push(this.download)
  })
  await userEvent.click(screen.getByText('💾 Salvar cópia do histórico'))
  await vi.waitFor(() => expect(nomes).toHaveLength(1))
  expect(nomes[0]).toMatch(/^transito-em-jogo-copia-\d{4}-\d{2}-\d{2}\.json$/)
  const json = JSON.parse(await blob!.text())
  expect(json.tentativas.map((t: Tentativa) => t.id)).toEqual(['a'])
})

test('sobre mostra revisão, versão e link para créditos', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }))
  expect(screen.getByText('Conteúdo revisado em 25/10/2026')).toBeInTheDocument()
  expect(screen.getByText(/^Versão \d/)).toBeInTheDocument()
  await userEvent.click(screen.getByText('Fontes e créditos das imagens ›'))
  expect(await screen.findByText('Fontes do conteúdo')).toBeInTheDocument()
})
