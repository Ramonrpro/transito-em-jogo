import { COTAS_PROVA, NOMES_AREA } from './areas.ts';
import type { Area, Questao } from './tipos.ts';

const vazio = (s: unknown) => typeof s !== 'string' || s.trim() === '';

export function validarQuestoes(
  qs: Questao[],
  codigosPlacas: ReadonlySet<string> | null,
): string[] {
  const erros: string[] = [];
  const ids = new Set<string>();
  for (const q of qs) {
    if (ids.has(q.id)) erros.push(`${q.id}: id repetido`);
    ids.add(q.id);

    const alts = q.alternativas;
    if (!Array.isArray(alts) || alts.length !== 4 || alts.some(vazio)) {
      erros.push(`${q.id}: precisa de exatamente 4 alternativas não vazias`);
    } else if (new Set(alts.map((a) => a.trim())).size !== 4) {
      erros.push(`${q.id}: alternativas repetidas`);
    }
    if (![0, 1, 2, 3].includes(q.correta)) erros.push(`${q.id}: correta fora de 0..3`);
    if (vazio(q.enunciado)) erros.push(`${q.id}: enunciado vazio`);
    if (vazio(q.explicacao)) erros.push(`${q.id}: explicação vazia`);
    if (vazio(q.baseLegal)) erros.push(`${q.id}: base legal vazia`);
    if (q.placa !== null && codigosPlacas && !codigosPlacas.has(q.placa)) {
      erros.push(`${q.id}: placa ${q.placa} inexistente`);
    }
  }
  for (const area of [1, 2, 3, 4] as Area[]) {
    const n = qs.filter((q) => q.area === area).length;
    if (n < COTAS_PROVA[area]) {
      erros.push(`área ${area} (${NOMES_AREA[area]}): ${n} questões, mínimo ${COTAS_PROVA[area]}`);
    }
  }
  return erros;
}
