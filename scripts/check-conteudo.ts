import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { CREDITOS, PALAVRAS, PLACAS, QUESTOES } from '../src/conteudo/index.ts';
import { lerPalavrasReferencia, transformarPalavras, validarPalavras } from '../src/conteudo/palavras.ts';
import { validarPlacas } from '../src/conteudo/placasParser.ts';
import { validarQuestoes } from '../src/conteudo/validar.ts';

const svgs = new Set(
  fs.existsSync('public/placas')
    ? fs.readdirSync('public/placas').filter((f) => f.endsWith('.svg')).map((f) => f.replace(/\.svg$/, ''))
    : [],
);
const codigosPlacas = new Set(PLACAS.map((p) => p.codigo));
const referencia = lerPalavrasReferencia(fs.readFileSync('pesquisa/00-REFERENCIA-COMPACTA.md', 'utf8'));
const palavrasBrutas = JSON.parse(fs.readFileSync('pesquisa/07-palavras.json', 'utf8'));
const erros = [
  ...validarPlacas(PLACAS, CREDITOS, svgs),
  ...validarQuestoes(QUESTOES, codigosPlacas),
  ...validarPalavras(PALAVRAS, codigosPlacas, referencia.map((r) => r.palavra)),
];
// A fonte editada sem regenerar: comparação pura, nada é gravado.
if (!isDeepStrictEqual(transformarPalavras(palavrasBrutas), PALAVRAS)) {
  erros.push('src/conteudo/palavras.json desatualizado: rode npm run conteudo:palavras');
}
for (const e of erros) console.error(e);
console.log(`${erros.length} erros`);
process.exit(erros.length ? 1 : 0);
