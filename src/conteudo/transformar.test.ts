import { expect, test } from 'vitest';
import legislacao from '../../pesquisa/04-questoes-legislacao-sinalizacao.json';
import demais from '../../pesquisa/05-questoes-demais-modulos.json';
import { transformarQuestoes } from './transformar.ts';
import type { QuestaoBruta } from './tipos.ts';

test('transformarQuestoes nas fontes reais', () => {
  const qs = transformarQuestoes([
    ...(legislacao as QuestaoBruta[]),
    ...(demais as QuestaoBruta[]),
  ]);
  expect(qs).toHaveLength(379); // 383 − sin-033 − 3 duplicatas
  expect(qs.find((q) => q.id === 'sin-033')).toBeUndefined();
  expect(qs.map((q) => q.id)).not.toContain('dd-019');
  expect(qs.find((q) => q.id === 'leg-074')!.respostaBancoOficial).toBe(
    'Sim, desde que tenham condições de cuidar de sua própria segurança',
  );
  expect(
    qs
      .filter((q) => q.respostaBancoOficial)
      .map((q) => q.id)
      .sort(),
  ).toEqual(['leg-074', 'leg-113', 'leg-118', 'ps-009', 'sin-026']);
});
