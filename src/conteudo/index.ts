import dados from './questoes.json';
import type { Questao } from './tipos.ts';

export const QUESTOES = dados as Questao[];
export const QUESTOES_POR_ID: ReadonlyMap<string, Questao> = new Map(
  QUESTOES.map((q) => [q.id, q]),
);
