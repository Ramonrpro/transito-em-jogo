import dados from './questoes.json';
import placasDados from './placas.json';
import creditosDados from './creditos.json';
import type { Credito, Placa, Questao } from './tipos.ts';

export const QUESTOES = dados as Questao[];
export const QUESTOES_POR_ID: ReadonlyMap<string, Questao> = new Map(
  QUESTOES.map((q) => [q.id, q]),
);
export const PLACAS = placasDados as Placa[];
export const PLACAS_POR_CODIGO: ReadonlyMap<string, Placa> = new Map(
  PLACAS.map((p) => [p.codigo, p]),
);
export const CREDITOS = creditosDados as Credito[];

/** Data da última revisão do conteúdo (exibida em Ajustes). */
export const CONTEUDO_REVISADO_EM = '25/10/2026';
