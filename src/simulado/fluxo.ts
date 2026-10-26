import type { Repositorio } from '../dados/repositorio.ts'
import type { Area } from '../conteudo/tipos.ts'
import { QUESTOES, QUESTOES_POR_ID } from '../conteudo/index.ts'
import { sortearErradas, sortearProva, sortearTreino } from './sorteio.ts'
import {
  acertou,
  alternarRevisar,
  alternativaOriginal,
  criarTentativa,
  entregar,
  expirou,
  irPara,
  responder,
} from './tentativa.ts'
import type { Modo, Tentativa } from './tipos.ts'

export class TentativaEmAndamentoError extends Error {
  constructor() {
    super('Já existe uma tentativa em andamento.')
    this.name = 'TentativaEmAndamentoError'
  }
}

// Serializa "iniciar" para que dois toques seguidos não criem duas tentativas.
let filaIniciar: Promise<unknown> = Promise.resolve()

export function iniciar(
  repo: Repositorio,
  p: { modo: Modo; area?: Area | null; qids?: string[]; agora: number; rng: () => number },
): Promise<Tentativa> {
  const execucao = filaIniciar.then(async () => {
    if (await repo.tentativaEmAndamento()) throw new TentativaEmAndamentoError()
    const vistas = await repo.vistas()
    let qids: string[]
    switch (p.modo) {
      case 'prova':
        qids = sortearProva(QUESTOES, vistas, p.rng)
        break
      case 'treino':
        qids = sortearTreino(QUESTOES, vistas, p.rng, null)
        break
      case 'assunto':
        qids = sortearTreino(QUESTOES, vistas, p.rng, p.area ?? null)
        break
      case 'erradas':
        qids = sortearErradas(p.qids ?? (await repo.listarErradas()).map((e) => e.qid), p.rng)
        break
    }
    const t = criarTentativa({ modo: p.modo, area: p.area ?? null, qids, agora: p.agora, rng: p.rng })
    await repo.salvarTentativa(t)
    return t
  })
  filaIniciar = execucao.catch(() => undefined)
  return execucao
}

// Toda mutação de tentativa passa por esta fila e age sobre a versão GUARDADA,
// nunca sobre a cópia do chamador (que pode estar velha).
let filaMutacao: Promise<unknown> = Promise.resolve()
function mutar<T>(fn: () => Promise<T>): Promise<T> {
  const execucao = filaMutacao.then(fn)
  filaMutacao = execucao.catch(() => undefined)
  return execucao
}

/** Guardada, se ainda aceita mudanças; senão `undefined` (entregue ou prova expirada). */
async function editavel(repo: Repositorio, t: Tentativa, agora: number): Promise<Tentativa | undefined> {
  const guardada = (await repo.obterTentativa(t.id)) ?? t
  if (guardada.entregueEm !== null) return undefined
  if (guardada.modo === 'prova' && expirou(guardada, agora)) return undefined
  return guardada
}

/** Marca a alternativa exibida em `indiceExibido` na questão atual e grava. */
export function responderEPersistir(
  repo: Repositorio,
  t: Tentativa,
  indiceExibido: number,
  agora: number,
): Promise<Tentativa> {
  return mutar(async () => {
    const base = await editavel(repo, t, agora)
    if (!base) return (await repo.obterTentativa(t.id)) ?? t
    const item = base.itens[base.atual]
    const nova = responder(base, base.atual, alternativaOriginal(item, indiceExibido))
    if (nova === base) return base // treino: resposta travada
    await repo.salvarTentativa(nova)
    if (base.modo !== 'prova') {
      const q = QUESTOES_POR_ID.get(item.qid)
      await repo.registrarResposta(item.qid, acertou(nova.itens[base.atual], q), agora)
    }
    return nova
  })
}

export function irParaEPersistir(
  repo: Repositorio,
  t: Tentativa,
  indice: number,
  agora: number,
): Promise<Tentativa> {
  return mutar(async () => {
    const base = await editavel(repo, t, agora)
    if (!base) return (await repo.obterTentativa(t.id)) ?? t
    if (indice < 0 || indice >= base.itens.length) return base
    const nova = irPara(base, indice)
    await repo.salvarTentativa(nova)
    return nova
  })
}

export function alternarRevisarEPersistir(
  repo: Repositorio,
  t: Tentativa,
  agora: number,
): Promise<Tentativa> {
  return mutar(async () => {
    const base = await editavel(repo, t, agora)
    if (!base) return (await repo.obterTentativa(t.id)) ?? t
    const nova = alternarRevisar(base, base.atual)
    await repo.salvarTentativa(nova)
    return nova
  })
}

const entregando = new Map<string, Promise<Tentativa>>()

export function entregarEPersistir(
  repo: Repositorio,
  t: Tentativa,
  agora: number,
  auto: boolean,
): Promise<Tentativa> {
  if (t.entregueEm !== null) return Promise.resolve(t)
  const emCurso = entregando.get(t.id)
  if (emCurso) return emCurso
  const execucao = mutar(async () => {
    const guardada = (await repo.obterTentativa(t.id)) ?? t
    if (guardada.entregueEm !== null) return guardada
    const e = entregar(guardada, QUESTOES_POR_ID, agora, auto)
    await repo.salvarTentativa(e)
    if (e.modo === 'prova') {
      for (const item of e.itens) {
        await repo.registrarResposta(item.qid, acertou(item, QUESTOES_POR_ID.get(item.qid)), agora)
      }
    }
    return e
  })
  entregando.set(t.id, execucao)
  const limpar = () => entregando.delete(t.id)
  execucao.then(limpar, limpar)
  return execucao
}

export async function retomarOuEncerrar(
  repo: Repositorio,
  agora: number,
): Promise<{ emAndamento?: Tentativa; encerrada?: Tentativa }> {
  const t = await repo.tentativaEmAndamento()
  if (!t) return {}
  if (t.modo === 'prova' && expirou(t, agora)) {
    return { encerrada: await entregarEPersistir(repo, t, agora, true) }
  }
  return { emAndamento: t }
}
