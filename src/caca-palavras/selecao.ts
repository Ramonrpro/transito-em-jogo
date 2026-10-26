import type { Partida } from './tipos.ts';

// Ordem por ângulo atan2(Δlinha, Δcoluna) em múltiplos de 45°, a partir de 0° (→).
const PASSOS: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1],
];

/** Casas do arrasto, encaixado na direção mais próxima das 8 e cortado na borda. */
export function linhaEntre(inicio: number, fim: number, tamanho: number): number[] {
  if (inicio === fim) return [inicio];
  const l0 = Math.floor(inicio / tamanho);
  const c0 = inicio % tamanho;
  const dl = Math.floor(fim / tamanho) - l0;
  const dc = (fim % tamanho) - c0;
  const k = Math.round(Math.atan2(dl, dc) / (Math.PI / 4));
  const [pl, pc] = PASSOS[((k % 8) + 8) % 8];
  const passos = Math.max(Math.abs(dl), Math.abs(dc));
  const r: number[] = [];
  for (let i = 0; i <= passos; i++) {
    const l = l0 + pl * i;
    const c = c0 + pc * i;
    if (l < 0 || l >= tamanho || c < 0 || c >= tamanho) break;
    r.push(l * tamanho + c);
  }
  return r;
}

/** Casa sob o ponto da tela, presa nas bordas. -1 quando a grade ainda não tem layout. */
export function celulaNoPonto(
  ret: { left: number; top: number; width: number; height: number },
  tamanho: number,
  x: number,
  y: number,
): number {
  if (ret.width <= 0 || ret.height <= 0) return -1;
  const prender = (v: number) => Math.min(tamanho - 1, Math.max(0, v));
  const c = prender(Math.floor(((x - ret.left) / ret.width) * tamanho));
  const l = prender(Math.floor(((y - ret.top) / ret.height) * tamanho));
  return l * tamanho + c;
}

/** Grade da palavra ainda não achada cuja colocação é igual a `celulas` (ou ao contrário); senão null. */
export function conferirSelecao(p: Partida, celulas: readonly number[]): string | null {
  const direto = celulas.join(',');
  const inverso = [...celulas].reverse().join(',');
  for (const c of p.colocacoes) {
    if (p.achadas.includes(c.palavra)) continue;
    const chave = c.celulas.join(',');
    if (chave === direto || chave === inverso) return c.palavra;
  }
  return null;
}
