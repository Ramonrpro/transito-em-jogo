import { expect, test } from 'vitest';
import { criarRng } from '../util/aleatorio.ts';
import { criarPartida, registrarAchada } from './partida.ts';
import { celulaNoPonto, conferirSelecao, linhaEntre } from './selecao.ts';

test('linhaEntre em linha reta e de trás para frente', () => {
  expect(linhaEntre(0, 4, 8)).toEqual([0, 1, 2, 3, 4]);
  expect(linhaEntre(4, 0, 8)).toEqual([4, 3, 2, 1, 0]);
  expect(linhaEntre(0, 24, 8)).toEqual([0, 8, 16, 24]);
  expect(linhaEntre(0, 27, 8)).toEqual([0, 9, 18, 27]);
  expect(linhaEntre(5, 5, 8)).toEqual([5]);
});

test('linhaEntre encaixa o dedo torto na direção mais próxima e corta na borda', () => {
  expect(linhaEntre(0, 12, 8)).toEqual([0, 1, 2, 3, 4]); // (1,4): horizontal
  expect(linhaEntre(0, 28, 8)).toEqual([0, 9, 18, 27, 36]); // (3,4): diagonal
  expect(linhaEntre(6, 23, 8)).toEqual([6, 15]); // (0,6)→(2,7): diagonal cortada
});

test('celulaNoPonto converte e prende nas bordas', () => {
  const r = { left: 10, top: 20, width: 80, height: 80 };
  expect(celulaNoPonto(r, 8, 15, 25)).toBe(0);
  expect(celulaNoPonto(r, 8, 89, 99)).toBe(63);
  expect(celulaNoPonto(r, 8, 200, -5)).toBe(7);
  expect(celulaNoPonto({ left: 0, top: 0, width: 0, height: 0 }, 8, 5, 5)).toBe(-1);
});

test('conferirSelecao aceita nos dois sentidos e ignora as já achadas', () => {
  const p = criarPartida({ tema: 'placas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(3) });
  const c = p.colocacoes[0];
  expect(conferirSelecao(p, c.celulas)).toBe(c.palavra);
  expect(conferirSelecao(p, [...c.celulas].reverse())).toBe(c.palavra);
  expect(conferirSelecao(p, c.celulas.slice(1))).toBeNull();
  expect(conferirSelecao(registrarAchada(p, c.palavra, 1, 1), c.celulas)).toBeNull();
});
