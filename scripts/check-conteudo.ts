import { QUESTOES } from '../src/conteudo/index.ts';
import { validarQuestoes } from '../src/conteudo/validar.ts';

// A Task 3 passa o conjunto real de códigos de placas no lugar de null.
const erros = validarQuestoes(QUESTOES, null);
for (const e of erros) console.error(e);
console.log(`${erros.length} erros`);
process.exit(erros.length ? 1 : 0);
