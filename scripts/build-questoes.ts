import { readFileSync, writeFileSync } from 'node:fs';
import { transformarQuestoes } from '../src/conteudo/transformar.ts';
import type { QuestaoBruta } from '../src/conteudo/tipos.ts';

const ler = (arquivo: string): QuestaoBruta[] =>
  JSON.parse(readFileSync(new URL(`../pesquisa/${arquivo}`, import.meta.url), 'utf8'));

const questoes = transformarQuestoes([
  ...ler('04-questoes-legislacao-sinalizacao.json'),
  ...ler('05-questoes-demais-modulos.json'),
]);
writeFileSync(
  new URL('../src/conteudo/questoes.json', import.meta.url),
  JSON.stringify(questoes, null, 2) + '\n',
);
console.log(`${questoes.length} questões gravadas em src/conteudo/questoes.json`);
