import { expect, test } from 'vitest';
import { transformarQuestoes } from './transformar.ts';
import { validarQuestoes } from './validar.ts';
import type { Questao, QuestaoBruta } from './tipos.ts';

const fixtureValida: QuestaoBruta[] = [
  {
    id: 'f-1',
    tema: 'sinalizacao',
    subtema: 'placas-regulamentacao',
    enunciado: 'Pergunta?',
    alternativas: ['a', 'b', 'c', 'd'],
    correta: 0,
    explicacao: 'Porque sim.',
    base_legal: 'CTB art. 1',
    placa: 'R-1',
    fonte: 'x',
    observacao: null,
  },
];

test('validarQuestoes acusa cada problema', () => {
  const base = transformarQuestoes(fixtureValida)[0];
  const ruins = [
    { ...base, id: 'q-a', alternativas: ['x', 'y', 'z'] },
    { ...base, id: 'q-b', correta: 4 },
    { ...base, id: 'q-c', placa: 'R-999' },
    { ...base, id: 'q-d', explicacao: '' },
    { ...base, id: 'q-e', alternativas: ['x', 'x', 'y', 'z'] },
    { ...base, id: 'q-e' }, // id repetido
  ] as Questao[];
  const erros = validarQuestoes(ruins, new Set(['R-1']));
  const regra = (id: string, re: RegExp) =>
    erros.some((e) => e.startsWith(`${id}:`) && re.test(e));
  expect(regra('q-a', /4 alternativas/)).toBe(true);
  expect(regra('q-b', /correta/)).toBe(true);
  expect(regra('q-c', /placa/)).toBe(true);
  expect(regra('q-d', /explica/)).toBe(true);
  expect(regra('q-e', /alternativas repetidas/)).toBe(true);
  expect(regra('q-e', /id repetido/)).toBe(true);
});

test('validarQuestoes acusa área abaixo da cota da prova', () => {
  const base = transformarQuestoes(fixtureValida)[0]; // área 1
  const erros = validarQuestoes(
    Array.from({ length: 8 }, (_, i) => ({ ...base, id: `s-${i}` })),
    null,
  );
  expect(erros.some((e) => /área 2.*mínimo 4/.test(e))).toBe(true);
  expect(erros.some((e) => /área 1/.test(e))).toBe(false);
});

test('validarQuestoes com placas nulo pula a regra da placa', () => {
  const base = transformarQuestoes(fixtureValida)[0];
  const erros = validarQuestoes([{ ...base, placa: 'R-999' }], null);
  expect(erros.some((e) => e.includes('placa'))).toBe(false);
});
