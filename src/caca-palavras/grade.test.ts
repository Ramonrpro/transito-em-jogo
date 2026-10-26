import { expect, test } from 'vitest';
import { PALAVRAS, PALAVRAS_POR_GRADE } from '../conteudo/index.ts';
import { criarRng } from '../util/aleatorio.ts';
import { escolherPalavras, gerarGrade, ocorrencias } from './grade.ts';
import { criarPartida, palavrasDoTema } from './partida.ts';
import { NIVEIS, ORDEM_NIVEIS, TEMAS } from './regras.ts';

const dirDe = (cel: number[], n: number) => [
  Math.sign(Math.floor(cel[1] / n) - Math.floor(cel[0] / n)),
  Math.sign((cel[1] % n) - (cel[0] % n)),
];

test('todo tema × nível monta grade válida (100 sementes)', () => {
  for (const { id: tema } of TEMAS)
    for (const nivel of ORDEM_NIVEIS)
      for (let s = 1; s <= 100; s++) {
        const cfg = NIVEIS[nivel];
        const p = criarPartida({ tema, nivel, jaAchadas: new Set(), agora: 0, rng: criarRng(s) });
        expect(p.letras).toMatch(new RegExp(`^[A-Z]{${cfg.tamanho ** 2}}$`));
        expect(p.colocacoes).toHaveLength(cfg.palavras);
        for (const c of p.colocacoes) {
          expect(c.celulas.map((i) => p.letras[i]).join('')).toBe(c.palavra);
          expect(cfg.direcoes.map((d) => d.join())).toContain(dirDe(c.celulas, cfg.tamanho).join());
          expect(ocorrencias(p.letras, cfg.tamanho, c.palavra)).toHaveLength(1);
          if (tema !== 'misturado') expect(PALAVRAS_POR_GRADE.get(c.palavra)!.tema).toBe(tema);
        }
      }
});

test('escolherPalavras prioriza as ainda não achadas', () => {
  const cand = palavrasDoTema('placas').filter((p) => p.grade.length <= 8); // 8 palavras
  const ja = new Set(cand.slice(0, 5).map((p) => p.grade));
  const escolhidas = escolherPalavras(cand, 5, 8, ja, criarRng(1)).map((p) => p.grade);
  expect(escolhidas).toEqual(expect.arrayContaining(cand.slice(5).map((p) => p.grade)));
});

test('escolherPalavras nunca põe uma palavra dentro de outra', () => {
  const w = (grade: string) => ({ ...PALAVRAS[0], palavra: grade, grade });
  for (let s = 1; s <= 30; s++) {
    const g = escolherPalavras(
      [w('PISTA'), w('PISTAS'), w('ATSIP'), w('CURVA')],
      4,
      8,
      new Set(),
      criarRng(s),
    ).map((p) => p.grade);
    expect(g.filter((x) => ['PISTA', 'PISTAS', 'ATSIP'].includes(x))).toHaveLength(1);
  }
});

test('ocorrencias acha de trás para frente e conta palíndromo uma vez', () => {
  const letras = 'ARARA' + 'X'.repeat(20); // 5×5
  expect(ocorrencias(letras, 5, 'ARA')).toHaveLength(2); // posições 0–2 e 2–4
  expect(ocorrencias('ABCDE' + 'X'.repeat(20), 5, 'EDC')).toEqual([[4, 3, 2]]);
});

test('gerarGrade devolve null quando a palavra não cabe', () =>
  expect(gerarGrade(['ABCDEFGHI'], 8, NIVEIS.facil.direcoes, criarRng(1))).toBeNull());
