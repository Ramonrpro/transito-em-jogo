import type { Area } from './tipos.ts';

export const NOMES_AREA: Record<Area, string> = {
  1: 'Placas e sinalização',
  2: 'Infrações',
  3: 'Circulação e direção defensiva',
  4: 'Socorros, meio ambiente e manutenção',
};

/** Quantidade de questões de cada área em uma prova. */
export const COTAS_PROVA: Record<Area, number> = { 1: 8, 2: 4, 3: 13, 4: 5 };

const SUBTEMAS_INFRACOES = new Set(['infracoes', 'penalidades', 'crimes']);

export function areaDe(tema: string, subtema: string): Area {
  switch (tema) {
    case 'sinalizacao':
      return 1;
    case 'legislacao':
      return SUBTEMAS_INFRACOES.has(subtema) ? 2 : 3;
    case 'direcao_defensiva':
      return 3;
    case 'primeiros_socorros':
    case 'meio_ambiente':
    case 'mecanica':
      return 4;
    default:
      throw new Error(`Tema desconhecido: ${tema}`);
  }
}
