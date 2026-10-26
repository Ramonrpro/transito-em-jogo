import fs from 'node:fs';
import { describe, expect, test } from 'vitest';
import { lerTabelaPlacas, validarPlacas } from './placasParser.ts';
import { validarQuestoes } from './validar.ts';
import { QUESTOES } from './index.ts';
import placas from './placas.json';
import creditos from './creditos.json';
import type { Credito, Placa } from './tipos.ts';

const trecho = `
| R-1 | Parada obrigatória | Assinala... | \`File:Brasil R-1.svg\` | CC BY-SA 3.0 — autor: Amateria1121 |
| R-2 | Dê a preferência | Obriga... | \`File:Brasil R-2.svg\`<br>\`File:BR road sign R-2.svg\` | CC BY-SA 3.0 — autor: Amateria1121<br>Domínio público (\`PD-shape (road signs)\`) |
| R-19 | Velocidade máxima permitida | Regulamenta... | \`File:Brasil R-19 (10).svg\`, \`File:Brasil R-19 (60).svg\` | CC BY-SA 4.0 |
| R-41 | Bonde/VLT | (inferido) | — | — |`;

describe('lerTabelaPlacas', () => {
  test('escolhe arquivo e ignora linha sem SVG', () => {
    const p = lerTabelaPlacas(trecho);
    expect(p.map((x) => x.codigo)).toEqual(['R-1', 'R-2', 'R-19']);
    expect(p[1]).toMatchObject({ arquivoCommons: 'File:BR road sign R-2.svg', dominioPublico: true });
    expect(p[2].arquivoCommons).toBe('File:Brasil R-19 (60).svg');
    expect(p[0]).toMatchObject({ nome: 'Parada obrigatória', tipo: 'regulamentacao', dominioPublico: false });
  });
  test('remove anotação entre parênteses do nome', () => {
    const p = lerTabelaPlacas(
      '| A-16 | Bonde / VLT (Res. 160/2004 e MBST 2007: "Bonde") | Adverte... | `File:Brasil A-16.svg` | Domínio público |',
    );
    expect(p[0].nome).toBe('Bonde / VLT');
  });
  test('arquivo real: 120 placas, 51 R e 69 A, sem códigos repetidos', () => {
    const p = lerTabelaPlacas(fs.readFileSync('pesquisa/02-sinalizacao.md', 'utf8'));
    expect(p).toHaveLength(120);
    expect(p.filter((x) => x.tipo === 'regulamentacao')).toHaveLength(51);
    expect(new Set(p.map((x) => x.codigo)).size).toBe(120);
  });
});

describe('validarPlacas', () => {
  const placa: Placa = { codigo: 'R-1', nome: 'n', significado: 's', tipo: 'regulamentacao', arquivoCommons: 'File:x.svg', dominioPublico: false };
  const cred: Credito = { codigo: 'R-1', arquivoCommons: 'File:x.svg', autor: 'a', licenca: 'CC', urlLicenca: null, urlPagina: 'u' };
  test('aceita conteúdo completo', () => {
    expect(validarPlacas([placa], [cred], new Set(['R-1']))).toEqual([]);
  });
  test('acusa SVG ausente, crédito ausente e crédito incompleto', () => {
    expect(validarPlacas([placa], [cred], new Set())).toEqual(['R-1: sem SVG em public/placas']);
    expect(validarPlacas([placa], [], new Set(['R-1']))).toEqual(['R-1: sem crédito']);
    expect(validarPlacas([{ ...placa, dominioPublico: true }], [], new Set(['R-1']))).toEqual([]);
    expect(validarPlacas([{ ...placa, nome: 'Bonde (x)' }], [cred], new Set(['R-1']))).toEqual(['R-1: nome com anotação']);
    const erros = validarPlacas([placa], [{ ...cred, autor: ' ', licenca: '' }], new Set(['R-1']));
    expect(erros).toEqual(['R-1: crédito sem autor', 'R-1: crédito sem licença']);
  });
});

test('conteúdo gerado é válido de ponta a ponta', () => {
  const svgs = new Set<string>(fs.readdirSync('public/placas').map((f) => f.replace('.svg', '')));
  expect(validarPlacas(placas as Placa[], creditos as Credito[], svgs)).toEqual([]);
  expect(validarQuestoes(QUESTOES, new Set((placas as Placa[]).map((p) => p.codigo)))).toEqual([]);
});
