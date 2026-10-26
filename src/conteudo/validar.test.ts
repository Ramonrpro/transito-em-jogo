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
    { ...base, id: 'a', alternativas: ['x', 'y', 'z'] },
    { ...base, id: 'b', correta: 4 },
    { ...base, id: 'c', placa: 'R-999' },
    { ...base, id: 'd', explicacao: '' },
    { ...base, id: 'e', alternativas: ['x', 'x', 'y', 'z'] },
    { ...base, id: 'e' }, // id repetido
  ] as Questao[];
  const erros = validarQuestoes(ruins, new Set(['R-1']));
  for (const id of ['a', 'b', 'c', 'd', 'e']) {
    expect(erros.some((e) => e.includes(id))).toBe(true);
  }
  expect(erros.some((e) => e.includes('repetido'))).toBe(true);
});

test('validarQuestoes com placas nulo pula a regra da placa', () => {
  const base = transformarQuestoes(fixtureValida)[0];
  const erros = validarQuestoes([{ ...base, placa: 'R-999' }], null);
  expect(erros.some((e) => e.includes('placa'))).toBe(false);
});
