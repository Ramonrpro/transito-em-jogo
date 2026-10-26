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
  /** Impressão digital (8 hex) de enunciado, alternativas, correta e placa. */
  versao: string;
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

export interface Placa {
  codigo: string;
  nome: string;
  significado: string;
  tipo: 'regulamentacao' | 'advertencia';
  arquivoCommons: string;
  dominioPublico: boolean;
}

export interface Credito {
  codigo: string;
  arquivoCommons: string;
  autor: string;
  licenca: string;
  urlLicenca: string | null;
  urlPagina: string;
}

export type TemaPalavra = 'placas' | 'curvas' | 'vias' | 'regras' | 'defensiva' | 'socorros' | 'veiculo';

/** Formato de pesquisa/07-palavras.json. */
export interface PalavraBruta {
  palavra: string;
  tema: TemaPalavra;
  dica: string;
  significado: string;
  placa: string | null;
  base: string;
}

export interface Palavra extends PalavraBruta {
  grade: string;
}
