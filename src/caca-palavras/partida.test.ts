import { expect, test } from 'vitest';
import { criarRng } from '../util/aleatorio.ts';
import { criarPartida, palavrasJaAchadas, registrarAchada, resumoRecorde } from './partida.ts';
import type { Nivel } from './tipos.ts';

test('criarPartida começa zerada', () => {
  const p = criarPartida({ tema: 'curvas', nivel: 'medio', jaAchadas: new Set(), agora: 7, rng: criarRng(1), id: 'x' });
  expect(p).toMatchObject({
    id: 'x', tema: 'curvas', nivel: 'medio', tamanho: 10, achadas: [],
    iniciadaEm: 7, terminadaEm: null, tempoMs: 0,
  });
});

test('registrarAchada: idempotente, termina na última e não muda depois', () => {
  let p = criarPartida({ tema: 'placas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(2) });
  const [a, ...resto] = p.colocacoes.map((c) => c.palavra);
  p = registrarAchada(p, a, 10, 5);
  expect(registrarAchada(p, a, 20, 9)).toBe(p);
  expect(registrarAchada(p, 'NAOEXISTE', 20, 9)).toBe(p);
  for (const w of resto) p = registrarAchada(p, w, 99, 4000);
  expect(p.terminadaEm).toBe(99);
  expect(p.tempoMs).toBe(4000);
  expect(registrarAchada(p, a, 200, 1)).toBe(p);
});

test('resumoRecorde: primeira, novo recorde e não recorde', () => {
  const fim = (id: string, terminadaEm: number, tempoMs: number, nivel: Nivel = 'facil') => ({
    ...criarPartida({ tema: 'vias', nivel, jaAchadas: new Set(), agora: 0, rng: criarRng(1), id }),
    terminadaEm,
    tempoMs,
  });
  const a = fim('a', 100, 300_000), b = fim('b', 200, 250_000), c = fim('c', 300, 280_000);
  const outra = fim('d', 50, 1_000, 'dificil');
  const todas = [a, b, c, outra];
  expect(resumoRecorde(a, todas)).toEqual({ melhorMs: 300_000, novoRecorde: false, primeira: true });
  expect(resumoRecorde(b, todas)).toEqual({ melhorMs: 250_000, novoRecorde: true, primeira: false });
  expect(resumoRecorde(c, todas)).toEqual({ melhorMs: 250_000, novoRecorde: false, primeira: false });
});

test('palavrasJaAchadas junta as achadas de todas', () => {
  const p = criarPartida({ tema: 'vias', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(1) });
  expect(palavrasJaAchadas([{ ...p, achadas: ['PISTA'] }, { ...p, achadas: ['ILHA', 'PISTA'] }]))
    .toEqual(new Set(['PISTA', 'ILHA']));
});
