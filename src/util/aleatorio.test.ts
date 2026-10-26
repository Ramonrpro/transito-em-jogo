import { expect, test } from 'vitest';
import { criarRng, embaralhar } from './aleatorio.ts';
import { formatarMinSeg } from './tempo.ts';

test('criarRng é determinístico e fica em [0,1)', () => {
  const a = criarRng(7);
  const b = criarRng(7);
  for (let i = 0; i < 100; i++) {
    const v = a();
    expect(v).toBe(b());
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  }
});

test('embaralhar não muta e preserva os itens', () => {
  const original = [1, 2, 3, 4, 5, 6, 7, 8];
  const copia = [...original];
  const r = embaralhar(original, criarRng(3));
  expect(original).toEqual(copia);
  expect([...r].sort()).toEqual(copia);
  expect(r).not.toEqual(copia);
});

test('formatarMinSeg', () => {
  expect(formatarMinSeg(3_600_000)).toBe('60:00');
  expect(formatarMinSeg(65_000)).toBe('01:05');
  expect(formatarMinSeg(0)).toBe('00:00');
  expect(formatarMinSeg(-5)).toBe('00:00');
});
