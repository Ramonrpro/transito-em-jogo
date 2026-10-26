import { IDBFactory } from 'fake-indexeddb';
import { expect, test, vi } from 'vitest';
import { abrirBanco, BancoDesatualizadoError } from './db.ts';

test('banco versão 1 com simulados vira versão 2 sem perder nada', async () => {
  const fabrica = new IDBFactory();
  await new Promise<void>((ok) => {
    const req = fabrica.open('transito-em-jogo', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('tentativas', { keyPath: 'id' }).put({ id: 't1', entregueEm: 5 });
      db.createObjectStore('erradas', { keyPath: 'qid' });
      db.createObjectStore('vistas', { keyPath: 'qid' }).put({ qid: 'q1' });
    };
    req.onsuccess = () => { req.result.close(); ok(); };
  });
  const banco = await abrirBanco(fabrica);
  expect(banco.persistente).toBe(true);
  expect((await banco.getAll('tentativas')).map(t => t.id)).toEqual(['t1']);
  expect(await banco.getAll('vistas')).toEqual([{ qid: 'q1' }]);
  expect(await banco.getAll('partidas')).toEqual([]);
});
test('banco mais novo que o código: BancoDesatualizadoError, não memória', async () => {
  const fabrica = new IDBFactory();
  await new Promise<void>((ok) => { const r = fabrica.open('transito-em-jogo', 3); r.onsuccess = () => { r.result.close(); ok(); }; });
  await expect(abrirBanco(fabrica)).rejects.toBeInstanceOf(BancoDesatualizadoError);
});
test('outra aba sobe a versão: aoDesatualizar é chamado', async () => {
  const fabrica = new IDBFactory(); const aviso = vi.fn();
  await abrirBanco(fabrica, { aoDesatualizar: aviso });
  await new Promise<void>((ok) => { const r = fabrica.open('transito-em-jogo', 3); r.onsuccess = () => { r.result.close(); ok(); }; });
  expect(aviso).toHaveBeenCalledOnce();
});
