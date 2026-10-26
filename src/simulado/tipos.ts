import type { Area } from '../conteudo/tipos.ts';

export type Modo = 'prova' | 'treino' | 'assunto' | 'erradas';

/**
 * `ordem[i]` = índice ORIGINAL da alternativa exibida na posição i;
 * `resposta` = índice ORIGINAL da alternativa marcada (ou null).
 */
export interface ItemTentativa {
  qid: string;
  ordem: number[];
  resposta: number | null;
  revisar: boolean;
  /** `Questao.versao` na hora da prova; ausente em tentativas antigas. */
  versao?: string;
}

export interface ResultadoArea {
  acertos: number;
  total: number;
}

export interface Tentativa {
  id: string;
  modo: Modo;
  area: Area | null;
  iniciadaEm: number;
  terminaEm: number | null;
  entregueEm: number | null;
  autoEntregue: boolean;
  itens: ItemTentativa[];
  atual: number;
  acertos: number | null;
  porArea: Partial<Record<Area, ResultadoArea>> | null;
  passou: boolean | null;
}
