import { expect, test } from 'vitest';
import { areaDe } from './areas.ts';

test.each([
  ['sinalizacao', 'placas-advertencia', 1],
  ['legislacao', 'infracoes', 2],
  ['legislacao', 'penalidades', 2],
  ['legislacao', 'crimes', 2],
  ['legislacao', 'habilitacao', 3],
  ['direcao_defensiva', 'curvas', 3],
  ['primeiros_socorros', 'hemorragia', 4],
  ['meio_ambiente', 'residuos', 4],
  ['mecanica', 'freios', 4],
])('areaDe(%s,%s) = %i', (t, s, a) => expect(areaDe(t, s)).toBe(a));

test('areaDe tema desconhecido lança', () => expect(() => areaDe('x', 'y')).toThrow());
