import { expect, test } from 'vitest';
import { QUESTOES, QUESTOES_POR_ID } from '../conteudo/index.ts';
import { criarRng } from '../util/aleatorio.ts';
import { formatarMinSeg } from '../util/tempo.ts';
import { sortearProva } from './sorteio.ts';
import {
  alternarRevisar,
  alternativaOriginal,
  criarTentativa,
  duracaoGastaMs,
  entregar,
  expirou,
  irPara,
  responder,
  restanteMs,
} from './tentativa.ts';
import type { Tentativa } from './tipos.ts';

/** Prova real sorteada, com exatamente n respostas certas (o resto errado). */
function provaComAcertos(n: number): Tentativa {
  const qids = sortearProva(QUESTOES, new Set(), criarRng(11));
  let t = criarTentativa({ modo: 'prova', qids, agora: 0, rng: criarRng(12) });
  qids.forEach((qid, i) => {
    const q = QUESTOES_POR_ID.get(qid)!;
    const original = i < n ? q.correta : (q.correta + 1) % 4;
    t = responder(t, i, original);
  });
  return t;
}

test('criarTentativa da prova termina em 60 min e embaralha alternativas', () => {
  const t = criarTentativa({ modo: 'prova', qids: ['a', 'b'], agora: 1000, rng: criarRng(4) });
  expect(t.terminaEm).toBe(1000 + 3_600_000);
  expect(t.atual).toBe(0);
  for (const it of t.itens) expect([...it.ordem].sort()).toEqual([0, 1, 2, 3]);
});

test('fora da prova não há prazo', () => {
  const t = criarTentativa({ modo: 'treino', qids: ['a'], agora: 1000, rng: criarRng(4) });
  expect(t.terminaEm).toBeNull();
  expect(restanteMs(t, 5000)).toBeNull();
  expect(expirou(t, 1e12)).toBe(false);
});

test('alternativaOriginal traduz a posição exibida', () =>
  expect(
    alternativaOriginal({ qid: 'x', ordem: [2, 0, 3, 1], resposta: null, revisar: false }, 0),
  ).toBe(2));

test('treino trava a primeira resposta; prova permite trocar', () => {
  const tr = responder(criarTentativa({ modo: 'treino', qids: ['a'], agora: 0, rng: criarRng(1) }), 0, 1);
  expect(responder(tr, 0, 2).itens[0].resposta).toBe(1);
  const pr = responder(criarTentativa({ modo: 'prova', qids: ['a'], agora: 0, rng: criarRng(1) }), 0, 1);
  expect(responder(pr, 0, 2).itens[0].resposta).toBe(2);
});

test('responder, alternarRevisar e irPara não mutam a entrada', () => {
  const t = criarTentativa({ modo: 'prova', qids: ['a', 'b'], agora: 0, rng: criarRng(1) });
  const r = responder(t, 0, 1);
  expect(t.itens[0].resposta).toBeNull();
  expect(r).not.toBe(t);
  expect(alternarRevisar(t, 1).itens[1].revisar).toBe(true);
  expect(t.itens[1].revisar).toBe(false);
  expect(irPara(t, 1).atual).toBe(1);
  expect(t.atual).toBe(0);
});

test('entregar: 20 acertos passa, 19 não; porArea soma 30', () => {
  const t20 = provaComAcertos(20);
  const t19 = provaComAcertos(19);
  const r20 = entregar(t20, QUESTOES_POR_ID, 5000);
  expect(r20.passou).toBe(true);
  expect(r20.acertos).toBe(20);
  const r19 = entregar(t19, QUESTOES_POR_ID, 5000);
  expect(r19.passou).toBe(false);
  expect(r19.acertos).toBe(19);
  expect(Object.values(r19.porArea!).reduce((s, a) => s + a.total, 0)).toBe(30);
});

test('entregar fora da prova: passou é null; questão ausente conta como errada', () => {
  let t = criarTentativa({ modo: 'treino', qids: ['fantasma'], agora: 0, rng: criarRng(1) });
  t = responder(t, 0, 0);
  const e = entregar(t, QUESTOES_POR_ID, 10);
  expect(e.passou).toBeNull();
  expect(e.acertos).toBe(0);
  expect(e.entregueEm).toBe(10);
});

test('entrega automática registra exatamente 60:00', () => {
  const t = entregar(provaComAcertos(10), QUESTOES_POR_ID, 9_999_999, true);
  expect(t.autoEntregue).toBe(true);
  expect(duracaoGastaMs(t)).toBe(3_600_000);
});

test('entregar duas vezes não muda nada; responder após entrega lança', () => {
  const e = entregar(provaComAcertos(10), QUESTOES_POR_ID, 5000);
  expect(entregar(e, QUESTOES_POR_ID, 9000)).toBe(e);
  expect(() => responder(e, 0, 1)).toThrow();
});

test('restanteMs nunca é negativo', () => {
  const t = criarTentativa({ modo: 'prova', qids: ['a'], agora: 0, rng: criarRng(1) });
  expect(restanteMs(t, 4_000_000)).toBe(0);
  expect(expirou(t, 4_000_000)).toBe(true);
  expect(expirou(t, 1000)).toBe(false);
  expect(formatarMinSeg(3_600_000)).toBe('60:00');
});
