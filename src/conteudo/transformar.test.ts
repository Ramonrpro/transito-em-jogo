import { expect, test } from 'vitest';
import legislacao from '../../pesquisa/04-questoes-legislacao-sinalizacao.json';
import demais from '../../pesquisa/05-questoes-demais-modulos.json';
import { transformarQuestoes, versaoDaQuestao } from './transformar.ts';
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

test('versao é estável e muda com o conteúdo que a pessoa vê', () => {
  const base = { enunciado: 'P?', alternativas: ['a', 'b', 'c', 'd'] as [string, string, string, string], correta: 1 as const, placa: null }
  const v = versaoDaQuestao(base);
  expect(v).toMatch(/^[0-9a-f]{8}$/);
  expect(versaoDaQuestao({ ...base })).toBe(v);
  expect(versaoDaQuestao({ ...base, correta: 2 })).not.toBe(v);
  expect(versaoDaQuestao({ ...base, placa: 'R-1' })).not.toBe(v);
  expect(versaoDaQuestao({ ...base, enunciado: 'P??' })).not.toBe(v);
  expect(versaoDaQuestao({ ...base, alternativas: ['a', 'b', 'c', 'x'] })).not.toBe(v);
  const bruta = (correta: number) => ({
    id: 'f-1', tema: 'sinalizacao', subtema: 'placas-regulamentacao', enunciado: 'P?',
    alternativas: ['a', 'b', 'c', 'd'], correta, explicacao: 'x', base_legal: 'y', placa: null, fonte: 'z', observacao: null,
  });
  expect(transformarQuestoes([bruta(1)])[0].versao).toBe(v);
  expect(transformarQuestoes([bruta(1)])[0].versao).toBe(transformarQuestoes([bruta(1)])[0].versao);
  expect(transformarQuestoes([bruta(2)])[0].versao).not.toBe(v);
});
