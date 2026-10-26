import { IDBFactory } from 'fake-indexeddb';
import { expect, test } from 'vitest';
import type { Partida } from '../caca-palavras/tipos.ts';
import type { Tentativa } from '../simulado/tipos.ts';
import { abrirBanco } from './db.ts';
import { criarRepositorio } from './repositorio.ts';
import { exportarCopia, importarCopia, nomeArquivoCopia } from './backup.ts';

function tent(p: Partial<Tentativa> = {}): Tentativa {
  return {
    id: 'x', modo: 'prova', area: null, iniciadaEm: 0, terminaEm: null, entregueEm: null,
    autoEntregue: false, itens: [], atual: 0, acertos: null, porArea: null, passou: null, ...p,
  };
}

test('exportar → apagar → importar restaura igual', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarTentativa(tent({ id:'a', entregueEm: 2 })); await repo.registrarResposta('q1', false, 1);
  const copia = await exportarCopia(banco, Date.UTC(2026, 9, 26, 12));
  await repo.apagarTudo(); await importarCopia(banco, JSON.parse(JSON.stringify(copia)));
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['a']);
  expect((await repo.listarErradas()).map(e => e.qid)).toEqual(['q1']);
});
test.each([[{}, 'formato'], [{ app:'outro', formato:1 }, 'formato'],
  [{ app:'transito-em-jogo', formato:99, exportadaEm:1, tentativas:[], erradas:[], vistas:[] }, 'versao-nova'],
  ['não é json', 'formato']])('cópia inválida %# não toca nos dados', async (bruto, motivo) => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarTentativa(tent({ id:'a', entregueEm: 2 }));
  await expect(importarCopia(banco, bruto)).rejects.toMatchObject({ motivo });
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['a']);
});
test('nome do arquivo da cópia', () =>
  expect(nomeArquivoCopia(new Date(2026, 9, 26, 15).getTime())).toBe('transito-em-jogo-copia-2026-10-26.json'));

test('importar logo após registrarResposta: a restauração, chamada depois, vence', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  const copiaSemQ9 = JSON.parse(JSON.stringify(await exportarCopia(banco, 1)));
  const a = repo.registrarResposta('q9', false, 1);
  const b = importarCopia(banco, copiaSemQ9);
  await Promise.all([a, b]);
  expect((await repo.listarErradas()).map(e => e.qid)).not.toContain('q9');
});

function partida(p: Partial<Partida> = {}): Partida {
  return {
    id: 'p', tema: 'placas', nivel: 'facil', tamanho: 8, letras: 'A'.repeat(64), colocacoes: [],
    achadas: [], iniciadaEm: 0, terminadaEm: null, tempoMs: 0, ...p,
  };
}

test('cópia formato 2 leva as partidas e volta igual', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarPartida(partida({ id: 'p1', terminadaEm: 9 }));
  const copia = await exportarCopia(banco, 1);
  expect(copia.formato).toBe(2);
  await repo.apagarTudo(); await importarCopia(banco, JSON.parse(JSON.stringify(copia)));
  expect((await repo.listarPartidas()).map(p => p.id)).toEqual(['p1']);
});
test('cópia formato 1 (etapa 1) ainda restaura e zera as partidas', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarPartida(partida({ id: 'p1', terminadaEm: 9 }));
  await importarCopia(banco, { app: 'transito-em-jogo', formato: 1, exportadaEm: 1,
    tentativas: [tent({ id: 'a', entregueEm: 2 })], erradas: [], vistas: ['q1'] });
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['a']);
  expect(await repo.listarPartidas()).toEqual([]);
});
test('formato 2 com partida inválida não toca nos dados', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarPartida(partida({ id: 'p1', terminadaEm: 9 }));
  await expect(importarCopia(banco, { app: 'transito-em-jogo', formato: 2, exportadaEm: 1,
    tentativas: [], erradas: [], vistas: [], partidas: [{ id: 3 }] })).rejects.toMatchObject({ motivo: 'formato' });
  expect((await repo.listarPartidas()).map(p => p.id)).toEqual(['p1']);
});
