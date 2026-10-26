import fs from 'node:fs';
import { CREDITOS, PLACAS, QUESTOES } from '../src/conteudo/index.ts';
import { validarPlacas } from '../src/conteudo/placasParser.ts';
import { validarQuestoes } from '../src/conteudo/validar.ts';

const svgs = new Set(
  fs.existsSync('public/placas')
    ? fs.readdirSync('public/placas').filter((f) => f.endsWith('.svg')).map((f) => f.replace(/\.svg$/, ''))
    : [],
);
const erros = [
  ...validarPlacas(PLACAS, CREDITOS, svgs),
  ...validarQuestoes(QUESTOES, new Set(PLACAS.map((p) => p.codigo))),
];
for (const e of erros) console.error(e);
console.log(`${erros.length} erros`);
process.exit(erros.length ? 1 : 0);
