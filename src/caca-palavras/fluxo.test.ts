import { IDBFactory } from 'fake-indexeddb';
import { expect, test } from 'vitest';
import { abrirBanco } from '../dados/db.ts';
import { criarRepositorio } from '../dados/repositorio.ts';
import { criarRng } from '../util/aleatorio.ts';
import { iniciarPartida } from './fluxo.ts';

test('iniciarPartida grava e prioriza palavras ainda não achadas', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  const p1 = await iniciarPartida(repo, { tema: 'placas', nivel: 'facil', agora: 1, rng: criarRng(1) });
  await repo.salvarPartida({ ...p1, achadas: p1.colocacoes.map((c) => c.palavra), terminadaEm: 2 });
  const p2 = await iniciarPartida(repo, { tema: 'placas', nivel: 'facil', agora: 3, rng: criarRng(2) });
  expect(await repo.obterPartida(p2.id)).toEqual(p2);
  const novas = p2.colocacoes.filter((c) => !p1.colocacoes.some((d) => d.palavra === c.palavra));
  expect(novas).toHaveLength(3); // placas fácil: 8 palavras cabem, 5 já vistas
});
