import type { TemaPalavra } from '../conteudo/tipos.ts';

export type Nivel = 'facil' | 'medio' | 'dificil';
export type TemaPartida = TemaPalavra | 'misturado';
/** [passo na linha, passo na coluna] */
export type Direcao = readonly [number, number];

export interface Colocacao {
  /** Grade da palavra. */
  palavra: string;
  /** Índices linha*tamanho+coluna, na ordem de leitura da palavra. */
  celulas: number[];
}

export interface Partida {
  id: string;
  tema: TemaPartida;
  nivel: Nivel;
  tamanho: number;
  /** tamanho² letras A–Z, linha por linha. */
  letras: string;
  colocacoes: Colocacao[];
  /** Grades, na ordem em que foram achadas. */
  achadas: string[];
  iniciadaEm: number;
  terminadaEm: number | null;
  /** Tempo com a tela visível, acumulado até a última gravação. */
  tempoMs: number;
}
