import { readFileSync, writeFileSync } from 'node:fs';
import { transformarPalavras } from '../src/conteudo/palavras.ts';
import type { PalavraBruta } from '../src/conteudo/tipos.ts';

const brutas: PalavraBruta[] = JSON.parse(
  readFileSync(new URL('../pesquisa/07-palavras.json', import.meta.url), 'utf8'),
);
const palavras = transformarPalavras(brutas);
writeFileSync(
  new URL('../src/conteudo/palavras.json', import.meta.url),
  JSON.stringify(palavras, null, 2) + '\n',
);
console.log(`${palavras.length} palavras gravadas em src/conteudo/palavras.json`);
