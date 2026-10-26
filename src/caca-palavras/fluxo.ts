import type { Repositorio } from '../dados/repositorio.ts';
import { criarPartida, palavrasJaAchadas } from './partida.ts';
import type { Nivel, Partida, TemaPartida } from './tipos.ts';

/** Cria a partida priorizando palavras que a pessoa ainda não achou, e grava. */
export async function iniciarPartida(
  repo: Repositorio,
  p: { tema: TemaPartida; nivel: Nivel; agora: number; rng: () => number },
): Promise<Partida> {
  const jaAchadas = palavrasJaAchadas(await repo.listarPartidas());
  const partida = criarPartida({ tema: p.tema, nivel: p.nivel, jaAchadas, agora: p.agora, rng: p.rng });
  await repo.salvarPartida(partida);
  return partida;
}
