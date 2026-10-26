import type { Palavra } from '../conteudo/tipos.ts';
import { embaralhar } from '../util/aleatorio.ts';
import type { Colocacao, Direcao } from './tipos.ts';

const TENTATIVAS_PREENCHIMENTO = 20;

const inverter = (s: string) => [...s].reverse().join('');

/** Não achadas primeiro; pula palavra que contém ou está contida em outra já escolhida (inclusive ao contrário). */
export function escolherPalavras(
  candidatas: readonly Palavra[],
  quantidade: number,
  tamanho: number,
  jaAchadas: ReadonlySet<string>,
  rng: () => number,
): Palavra[] {
  const cabem = candidatas.filter((p) => p.grade.length <= tamanho);
  const ordem = [
    ...embaralhar(cabem.filter((p) => !jaAchadas.has(p.grade)), rng),
    ...embaralhar(cabem.filter((p) => jaAchadas.has(p.grade)), rng),
  ];
  const escolhidas: Palavra[] = [];
  for (const p of ordem) {
    if (escolhidas.length >= quantidade) break;
    const g = p.grade;
    const r = inverter(g);
    const conflita = escolhidas.some((e) => {
      const o = e.grade;
      return g.includes(o) || o.includes(g) || r.includes(o) || o.includes(r);
    });
    if (!conflita) escolhidas.push(p);
  }
  return escolhidas;
}

/** Todos os caminhos (8 direções) que leem a palavra; caminhos com o mesmo conjunto de casas contam uma vez. */
export function ocorrencias(letras: string, tamanho: number, palavra: string): number[][] {
  const achados: number[][] = [];
  const vistos = new Set<string>();
  const n = palavra.length;
  for (let l = 0; l < tamanho; l++) {
    for (let c = 0; c < tamanho; c++) {
      if (letras[l * tamanho + c] !== palavra[0]) continue;
      for (let dl = -1; dl <= 1; dl++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dl === 0 && dc === 0) continue;
          const fl = l + dl * (n - 1);
          const fc = c + dc * (n - 1);
          if (fl < 0 || fl >= tamanho || fc < 0 || fc >= tamanho) continue;
          const celulas: number[] = [];
          let ok = true;
          for (let k = 0; k < n; k++) {
            const i = (l + dl * k) * tamanho + (c + dc * k);
            if (letras[i] !== palavra[k]) {
              ok = false;
              break;
            }
            celulas.push(i);
          }
          if (!ok) continue;
          const chave = [...celulas].sort((a, b) => a - b).join(',');
          if (vistos.has(chave)) continue;
          vistos.add(chave);
          achados.push(celulas);
        }
      }
    }
  }
  return achados;
}

export function gerarGrade(
  palavras: readonly string[],
  tamanho: number,
  direcoes: readonly Direcao[],
  rng: () => number,
): { letras: string; colocacoes: Colocacao[] } | null {
  const celulas: string[] = new Array(tamanho * tamanho).fill('');
  const colocacoes: Colocacao[] = [];
  const porTamanho = [...palavras].sort((a, b) => b.length - a.length);

  for (const palavra of porTamanho) {
    const n = palavra.length;
    const opcoes: Array<[number, number, Direcao]> = [];
    for (const d of direcoes) {
      for (let l = 0; l < tamanho; l++) {
        const fl = l + d[0] * (n - 1);
        if (fl < 0 || fl >= tamanho) continue;
        for (let c = 0; c < tamanho; c++) {
          const fc = c + d[1] * (n - 1);
          if (fc < 0 || fc >= tamanho) continue;
          let cabe = true;
          for (let k = 0; k < n; k++) {
            const atual = celulas[(l + d[0] * k) * tamanho + (c + d[1] * k)];
            if (atual !== '' && atual !== palavra[k]) {
              cabe = false;
              break;
            }
          }
          if (cabe) opcoes.push([l, c, d]);
        }
      }
    }
    if (opcoes.length === 0) return null;
    const [l, c, d] = opcoes[Math.floor(rng() * opcoes.length)];
    const idx: number[] = [];
    for (let k = 0; k < n; k++) {
      const i = (l + d[0] * k) * tamanho + (c + d[1] * k);
      celulas[i] = palavra[k];
      idx.push(i);
    }
    colocacoes.push({ palavra, celulas: idx });
  }

  const alfabeto = palavras.join('');
  for (let t = 0; t < TENTATIVAS_PREENCHIMENTO; t++) {
    const letras = celulas
      .map((x) => (x !== '' ? x : alfabeto[Math.floor(rng() * alfabeto.length)]))
      .join('');
    if (palavras.every((p) => ocorrencias(letras, tamanho, p).length === 1)) {
      return { letras, colocacoes };
    }
  }
  return null;
}
