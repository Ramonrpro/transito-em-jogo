import { IDBFactory } from 'fake-indexeddb';
import { expect, test } from 'vitest';
import type { Partida } from '../caca-palavras/tipos.ts';
import type { Tentativa } from '../simulado/tipos.ts';
import { abrirBanco } from './db.ts';
import { criarRepositorio } from './repositorio.ts';

function tent(p: Partial<Tentativa> = {}): Tentativa {
  return {
    id: 'x', modo: 'prova', area: null, iniciadaEm: 0, terminaEm: null, entregueEm: null,
    autoEntregue: false, itens: [], atual: 0, acertos: null, porArea: null, passou: null, ...p,
  };
}

test('lista só entregues, mais recentes primeiro; em andamento à parte', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await repo.salvarTentativa(tent({ id:'a', iniciadaEm:1, entregueEm:2 }));
  await repo.salvarTentativa(tent({ id:'b', iniciadaEm:3, entregueEm:4 }));
  await repo.salvarTentativa(tent({ id:'c', iniciadaEm:5, entregueEm:null }));
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['b','a']);
  expect((await repo.tentativaEmAndamento())!.id).toBe('c');
});
test('caderno de erros: sai após 2 acertos seguidos e zera ao errar', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await repo.registrarResposta('q1', false, 10);
  await repo.registrarResposta('q1', true, 11);
  expect((await repo.listarErradas())[0].acertosSeguidos).toBe(1);
  await repo.registrarResposta('q1', false, 12);
  expect((await repo.listarErradas())[0].acertosSeguidos).toBe(0);
  await repo.registrarResposta('q1', true, 13); await repo.registrarResposta('q1', true, 14);
  expect(await repo.listarErradas()).toEqual([]);
  expect((await repo.vistas()).has('q1')).toBe(true);
});
test('respostas disparadas juntas não se perdem', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await Promise.all([repo.registrarResposta('q1', false, 1), repo.registrarResposta('q2', false, 1)]);
  expect((await repo.listarErradas()).map(e => e.qid).sort()).toEqual(['q1','q2']);
});
test('sem IndexedDB: cai para memória e avisa', async () => {
  const quebrada = { open: () => { throw new Error('bloqueado'); } } as unknown as IDBFactory;
  const banco = await abrirBanco(quebrada);
  expect(banco.persistente).toBe(false);
  const repo = criarRepositorio(banco);
  await repo.salvarTentativa(tent({ id:'a', entregueEm: 2 }));
  expect(await repo.obterTentativa('a')).toBeDefined();
});

test('conexão fecha em versionchange: um upgrade futuro não fica bloqueado', async () => {
  const fabrica = new IDBFactory();
  await abrirBanco(fabrica);
  await new Promise<void>((resolve, reject) => {
    const req = fabrica.open('transito-em-jogo', 2);
    req.onupgradeneeded = () => undefined;
    req.onsuccess = () => { req.result.close(); resolve(); };
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('bloqueado'));
  });
});

test('sem fábrica de IndexedDB: cai para memória', async () => {
  const original = globalThis.indexedDB;
  // @ts-expect-error simulando ambiente sem IndexedDB
  globalThis.indexedDB = undefined;
  try {
    expect((await abrirBanco()).persistente).toBe(false);
  } finally {
    globalThis.indexedDB = original;
  }
});

function partida(p: Partial<Partida> = {}): Partida {
  return {
    id: 'p', tema: 'placas', nivel: 'facil', tamanho: 8, letras: 'A'.repeat(64), colocacoes: [],
    achadas: [], iniciadaEm: 0, terminadaEm: null, tempoMs: 0, ...p,
  };
}

test('partidas: lista só concluídas, mais recentes primeiro; em andamento é a mais recente', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await repo.salvarPartida(partida({ id: 'a', iniciadaEm: 1, terminadaEm: 10 }));
  await repo.salvarPartida(partida({ id: 'b', iniciadaEm: 2, terminadaEm: 20 }));
  await repo.salvarPartida(partida({ id: 'c', iniciadaEm: 3, terminadaEm: null }));
  await repo.salvarPartida(partida({ id: 'd', iniciadaEm: 4, terminadaEm: null }));
  expect((await repo.listarPartidas()).map(p => p.id)).toEqual(['b', 'a']);
  expect((await repo.partidaEmAndamento())?.id).toBe('d');
  expect((await repo.obterPartida('a'))?.id).toBe('a');
  await repo.descartarPartida('d');
  expect((await repo.partidaEmAndamento())?.id).toBe('c');
  await repo.apagarTudo();
  expect(await repo.listarPartidas()).toEqual([]);
  expect(await repo.partidaEmAndamento()).toBeUndefined();
});
