import { ACERTOS_PARA_SAIR } from '../simulado/regras.ts';
import type { Partida } from '../caca-palavras/tipos.ts';
import type { Tentativa } from '../simulado/tipos.ts';
import type { Banco, EntradaErrada } from './db.ts';

export type { EntradaErrada } from './db.ts';

export interface Repositorio {
  persistente: boolean;
  salvarTentativa(t: Tentativa): Promise<void>;
  obterTentativa(id: string): Promise<Tentativa | undefined>;
  /** Só entregues, mais recentes primeiro. */
  listarTentativas(): Promise<Tentativa[]>;
  tentativaEmAndamento(): Promise<Tentativa | undefined>;
  descartarTentativa(id: string): Promise<void>;
  registrarResposta(qid: string, acertou: boolean, agora: number): Promise<void>;
  listarErradas(): Promise<EntradaErrada[]>;
  vistas(): Promise<Set<string>>;
  salvarPartida(p: Partida): Promise<void>;
  obterPartida(id: string): Promise<Partida | undefined>;
  /** Só concluídas, mais recentes primeiro (por terminadaEm). */
  listarPartidas(): Promise<Partida[]>;
  /** A não concluída mais recente (por iniciadaEm), se houver. */
  partidaEmAndamento(): Promise<Partida | undefined>;
  descartarPartida(id: string): Promise<void>;
  apagarTudo(): Promise<void>;
}

export function criarRepositorio(banco: Banco): Repositorio {
  // Todas as operações passam pela fila do banco (a mesma usada por exportar/importar):
  // registrarResposta lê e depois grava, e não pode se misturar com outras escritas.
  const enfileirar = <T>(op: () => Promise<T>): Promise<T> => banco.serializar(op);

  return {
    persistente: banco.persistente,
    salvarTentativa: (t) => enfileirar(() => banco.put('tentativas', t)),
    obterTentativa: (id) => enfileirar(() => banco.get('tentativas', id)),
    listarTentativas: () =>
      enfileirar(async () =>
        (await banco.getAll('tentativas'))
          .filter((t) => t.entregueEm !== null)
          .sort((a, b) => b.iniciadaEm - a.iniciadaEm),
      ),
    tentativaEmAndamento: () =>
      enfileirar(async () => (await banco.getAll('tentativas')).find((t) => t.entregueEm === null)),
    descartarTentativa: (id) => enfileirar(() => banco.delete('tentativas', id)),
    registrarResposta: (qid, acertou, agora) =>
      enfileirar(async () => {
        await banco.put('vistas', { qid });
        if (!acertou) {
          await banco.put('erradas', { qid, acertosSeguidos: 0, erradaEm: agora });
          return;
        }
        const atual = await banco.get('erradas', qid);
        if (!atual) return;
        const acertosSeguidos = atual.acertosSeguidos + 1;
        if (acertosSeguidos >= ACERTOS_PARA_SAIR) await banco.delete('erradas', qid);
        else await banco.put('erradas', { ...atual, acertosSeguidos });
      }),
    listarErradas: () => enfileirar(() => banco.getAll('erradas')),
    vistas: () => enfileirar(async () => new Set((await banco.getAll('vistas')).map((v) => v.qid))),
    salvarPartida: (p) => enfileirar(() => banco.put('partidas', p)),
    obterPartida: (id) => enfileirar(() => banco.get('partidas', id)),
    listarPartidas: () =>
      enfileirar(async () =>
        (await banco.getAll('partidas'))
          .filter((p) => p.terminadaEm !== null)
          .sort((a, b) => (b.terminadaEm ?? 0) - (a.terminadaEm ?? 0)),
      ),
    partidaEmAndamento: () =>
      enfileirar(async () =>
        (await banco.getAll('partidas'))
          .filter((p) => p.terminadaEm === null)
          .sort((a, b) => b.iniciadaEm - a.iniciadaEm)[0],
      ),
    descartarPartida: (id) => enfileirar(() => banco.delete('partidas', id)),
    apagarTudo: () =>
      enfileirar(() =>
        banco.substituirTudo({ tentativas: [], erradas: [], vistas: [], partidas: [] }),
      ),
  };
}
