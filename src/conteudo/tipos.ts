export type Area = 1 | 2 | 3 | 4;

export interface Questao {
  id: string;
  area: Area;
  tema: string;
  subtema: string;
  enunciado: string;
  alternativas: [string, string, string, string];
  correta: 0 | 1 | 2 | 3;
  explicacao: string;
  baseLegal: string;
  placa: string | null;
  fonte: string;
  /** Preenchido só quando o banco oficial marca outra resposta. */
  respostaBancoOficial: string | null;
}

/** Formato das questões em pesquisa/04 e pesquisa/05. */
export interface QuestaoBruta {
  id: string;
  tema: string;
  subtema: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
  base_legal: string;
  placa: string | null;
  fonte: string;
  observacao: string | null;
}
