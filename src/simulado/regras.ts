import { COTAS_PROVA } from '../conteudo/areas.ts';

export const PROVA = {
  total: 30,
  minimoAprovacao: 20,
  duracaoMs: 3_600_000,
  cotas: COTAS_PROVA,
} as const;

export const TREINO_TAMANHO = 10;
export const ERRADAS_MAXIMO = 30;
export const ACERTOS_PARA_SAIR = 2;
