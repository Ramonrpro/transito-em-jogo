import { expect, test } from 'vitest';
import { QUESTOES, QUESTOES_POR_ID } from '../conteudo/index.ts';
import { criarRng } from '../util/aleatorio.ts';
import { sortearErradas, sortearProva, sortearTreino } from './sorteio.ts';

function contar(xs: number[]): Record<string, number> {
  const r: Record<string, number> = {};
  for (const x of xs) r[x] = (r[x] ?? 0) + 1;
  return r;
}

test('sortearProva: 30 únicas com cotas 8/4/13/5', () => {
  const ids = sortearProva(QUESTOES, new Set(), criarRng(1));
  expect(new Set(ids).size).toBe(30);
  const porArea = contar(ids.map((id) => QUESTOES_POR_ID.get(id)!.area));
  expect(porArea).toEqual({ 1: 8, 2: 4, 3: 13, 4: 5 });
});

test('sortearProva prioriza não vistas', () => {
  const area1 = QUESTOES.filter((q) => q.area === 1).map((q) => q.id);
  const naoVistas = area1.slice(0, 8);
  const vistas = new Set(QUESTOES.map((q) => q.id).filter((id) => !naoVistas.includes(id)));
  const ids = sortearProva(QUESTOES, vistas, criarRng(2));
  expect(ids.filter((id) => QUESTOES_POR_ID.get(id)!.area === 1).sort()).toEqual(
    [...naoVistas].sort(),
  );
});

test('sortearProva lança se faltar questão numa área', () =>
  expect(() =>
    sortearProva(
      QUESTOES.filter((q) => q.area !== 2),
      new Set(),
      criarRng(1),
    ),
  ).toThrow());

test('sortearTreino por área', () => {
  const ids = sortearTreino(QUESTOES, new Set(), criarRng(3), 2);
  expect(ids).toHaveLength(10);
  expect(ids.every((id) => QUESTOES_POR_ID.get(id)!.area === 2)).toBe(true);
});

test('sortearTreino sem área e respeitando tamanho; vistas por último', () => {
  const ids = sortearTreino(QUESTOES, new Set(), criarRng(3), null, 5);
  expect(ids).toHaveLength(5);
  const todas = QUESTOES.map((q) => q.id);
  const vistas = new Set(todas.slice(5));
  const so5 = sortearTreino(QUESTOES, vistas, criarRng(3), null, 5);
  expect(so5.sort()).toEqual(todas.slice(0, 5).sort());
});

test('sortearErradas limita ao máximo e não repete', () => {
  const qids = Array.from({ length: 50 }, (_, i) => `q${i}`);
  const r = sortearErradas(qids, criarRng(1));
  expect(r).toHaveLength(30);
  expect(new Set(r).size).toBe(30);
  expect(sortearErradas(qids, criarRng(1), 5)).toHaveLength(5);
});
