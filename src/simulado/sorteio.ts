import type { Area, Questao } from '../conteudo/tipos.ts';
import { embaralhar } from '../util/aleatorio.ts';
import { ERRADAS_MAXIMO, PROVA, TREINO_TAMANHO } from './regras.ts';

/** Não vistas primeiro (embaralhadas), depois as vistas (embaralhadas); pega até `n`. */
function priorizarNaoVistas(
  qs: readonly Questao[],
  vistas: ReadonlySet<string>,
  rng: () => number,
  n: number,
): string[] {
  const naoVistas = embaralhar(
    qs.filter((q) => !vistas.has(q.id)),
    rng,
  );
  const jaVistas = embaralhar(
    qs.filter((q) => vistas.has(q.id)),
    rng,
  );
  return [...naoVistas, ...jaVistas].slice(0, n).map((q) => q.id);
}

export function sortearProva(
  qs: Questao[],
  vistas: ReadonlySet<string>,
  rng: () => number,
): string[] {
  const escolhidas: string[] = [];
  for (const chave of Object.keys(PROVA.cotas)) {
    const area = Number(chave) as Area;
    const cota = PROVA.cotas[area];
    const daArea = priorizarNaoVistas(
      qs.filter((q) => q.area === area),
      vistas,
      rng,
      cota,
    );
    if (daArea.length < cota) {
      throw new Error(`Área ${area} tem ${daArea.length} questões; a prova exige ${cota}.`);
    }
    escolhidas.push(...daArea);
  }
  return embaralhar(escolhidas, rng);
}

export function sortearTreino(
  qs: Questao[],
  vistas: ReadonlySet<string>,
  rng: () => number,
  area: Area | null,
  tamanho: number = TREINO_TAMANHO,
): string[] {
  const candidatas = area === null ? qs : qs.filter((q) => q.area === area);
  return priorizarNaoVistas(candidatas, vistas, rng, tamanho);
}

export function sortearErradas(
  qids: readonly string[],
  rng: () => number,
  maximo: number = ERRADAS_MAXIMO,
): string[] {
  return embaralhar(qids, rng).slice(0, maximo);
}
