import { IDBFactory } from 'fake-indexeddb'
import { expect, test } from 'vitest'
import { QUESTOES_POR_ID } from '../conteudo/index.ts'
import { abrirBanco } from '../dados/db.ts'
import { criarRepositorio } from '../dados/repositorio.ts'
import { criarRng } from '../util/aleatorio.ts'
import {
  entregarEPersistir,
  iniciar,
  responderEPersistir,
  retomarOuEncerrar,
  TentativaEmAndamentoError,
} from './fluxo.ts'
import { duracaoGastaMs } from './tentativa.ts'
import type { Tentativa } from './tipos.ts'

const novoRepo = async () => criarRepositorio(await abrirBanco(new IDBFactory()))

// posição exibida da alternativa correta
const exibidaCorreta = (t: Tentativa, i: number) =>
  t.itens[i].ordem.indexOf(QUESTOES_POR_ID.get(t.itens[i].qid)!.correta)

test('prova expirada com o app fechado é entregue sozinha, com tempo 60:00', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  await responderEPersistir(repo, t, 0, 10)
  const r = await retomarOuEncerrar(repo, 3_600_000 + 5_000)
  expect(r.encerrada).toMatchObject({ id: t.id, autoEntregue: true })
  expect(duracaoGastaMs(r.encerrada!)).toBe(3_600_000)
  expect(r.encerrada!.itens[0].resposta).not.toBeNull()
  expect(await repo.tentativaEmAndamento()).toBeUndefined()
})

test('prova ainda no prazo é retomada', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  const r = await retomarOuEncerrar(repo, 1000)
  expect(r.emAndamento?.id).toBe(t.id)
  expect(r.encerrada).toBeUndefined()
})

test('não deixa iniciar com outra em andamento', async () => {
  const repo = await novoRepo()
  await iniciar(repo, { modo: 'treino', agora: 0, rng: criarRng(1) })
  await expect(iniciar(repo, { modo: 'prova', agora: 1, rng: criarRng(1) })).rejects.toBeInstanceOf(
    TentativaEmAndamentoError,
  )
})

test('entregar duas vezes registra o caderno uma vez só', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  const qid = t.itens[0].qid
  await repo.registrarResposta(qid, false, 0) // já estava no caderno (0 acertos)
  const t1 = await responderEPersistir(repo, t, exibidaCorreta(t, 0), 10)
  const e1 = await entregarEPersistir(repo, t1, 100, false)
  await entregarEPersistir(repo, e1, 200, false)
  expect((await repo.listarErradas()).find((e) => e.qid === qid)!.acertosSeguidos).toBe(1)
  expect((await repo.obterTentativa(t.id))!.entregueEm).toBe(100)
})

test('entregas simultâneas contam uma vez só e questões sem resposta vão para o caderno', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  const [a, b] = await Promise.all([
    entregarEPersistir(repo, t, 100, false),
    entregarEPersistir(repo, t, 150, false),
  ])
  expect(a.entregueEm).toBe(100)
  expect(b.entregueEm).toBe(100)
  expect((await repo.listarErradas()).length).toBe(30)
  expect((await repo.vistas()).size).toBe(30)
})

test('treino: tocar duas vezes na mesma questão registra uma vez', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'treino', agora: 0, rng: criarRng(1) })
  const qid = t.itens[0].qid
  await repo.registrarResposta(qid, false, 0)
  const t1 = await responderEPersistir(repo, t, exibidaCorreta(t, 0), 1)
  await responderEPersistir(repo, t1, exibidaCorreta(t, 0), 2)
  expect((await repo.listarErradas()).find((e) => e.qid === qid)!.acertosSeguidos).toBe(1)
})

test('erradas usa o caderno quando não vêm qids', async () => {
  const repo = await novoRepo()
  await repo.registrarResposta('leg-074', false, 0)
  const t = await iniciar(repo, { modo: 'erradas', agora: 0, rng: criarRng(1) })
  expect(t.itens.map((i) => i.qid)).toEqual(['leg-074'])
})

test('resposta tardia com cópia velha não reabre uma prova entregue nem conta em dobro', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  const qid = t.itens[0].qid
  await repo.registrarResposta(qid, false, 0)
  const [e, tardia] = await Promise.all([
    entregarEPersistir(repo, t, 100, false),
    responderEPersistir(repo, t, exibidaCorreta(t, 0), 101),
  ])
  const guardada = (await repo.obterTentativa(t.id))!
  expect(guardada.entregueEm).toBe(100)
  expect(tardia.entregueEm).toBe(100)
  expect(guardada.itens).toEqual(e.itens)
  expect(guardada.itens[0].resposta).toBeNull()
  expect(await repo.tentativaEmAndamento()).toBeUndefined()
  expect((await repo.listarErradas()).find((x) => x.qid === qid)!.acertosSeguidos).toBe(0)
})

test('prova expirada: responder com cópia velha não grava nada', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  const r = await responderEPersistir(repo, t, 0, 3_600_001)
  expect(r.itens[0].resposta).toBeNull()
  expect((await repo.obterTentativa(t.id))!.itens[0].resposta).toBeNull()
})

test('treino: duas respostas com a mesma cópia velha registram uma vez só', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'treino', agora: 0, rng: criarRng(1) })
  const qid = t.itens[0].qid
  await repo.registrarResposta(qid, false, 0)
  await Promise.all([
    responderEPersistir(repo, t, exibidaCorreta(t, 0), 1),
    responderEPersistir(repo, t, exibidaCorreta(t, 0), 2),
  ])
  expect((await repo.listarErradas()).find((e) => e.qid === qid)!.acertosSeguidos).toBe(1)
})

test('tentativa apagada nesse meio tempo não é ressuscitada nem registra respostas', async () => {
  const repo = await novoRepo()
  const t = await iniciar(repo, { modo: 'prova', agora: 0, rng: criarRng(1) })
  expect(t.itens[0].versao).toBe(QUESTOES_POR_ID.get(t.itens[0].qid)!.versao)
  await repo.apagarTudo()
  const r = await responderEPersistir(repo, t, 0, 1)
  expect(r.id).toBe(t.id)
  const e = await entregarEPersistir(repo, t, 2, false)
  expect(e.entregueEm).toBeNull()
  expect(await repo.obterTentativa(t.id)).toBeUndefined()
  expect(await repo.listarTentativas()).toEqual([])
  expect((await repo.listarErradas()).length).toBe(0)
  expect((await repo.vistas()).size).toBe(0)
})
