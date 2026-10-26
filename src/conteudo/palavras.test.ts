import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { PALAVRAS, PALAVRAS_POR_GRADE, PLACAS } from './index.ts';
import {
  lerPalavrasReferencia, normalizarPalavra, TEMAS_PALAVRA, transformarPalavras, validarPalavras,
} from './palavras.ts';
import type { Palavra, TemaPalavra } from './tipos.ts';

const ok = (p: Partial<Palavra> = {}): Palavra => ({
  palavra: 'CURVA', grade: 'CURVA', tema: 'curvas', dica: 'Placa A-2: curva suave',
  significado: 'Avisa uma curva suave adiante.', placa: 'A-2a', base: 'MBST Vol. II', ...p,
});
const PL = new Set(['A-2a']);

test('normalizarPalavra tira acento, cedilha e hífen', () => {
  expect(normalizarPalavra('DEPRESSÃO')).toBe('DEPRESSAO');
  expect(normalizarPalavra('PISCA-ALERTA')).toBe('PISCAALERTA');
  expect(normalizarPalavra('CARROÇA')).toBe('CARROCA');
  expect(normalizarPalavra('MICROÔNIBUS')).toBe('MICROONIBUS');
  expect(normalizarPalavra('freio-motor')).toBe('FREIOMOTOR');
});
test('lerPalavrasReferencia lê as 131 palavras do §14 da referência', () => {
  const ref = lerPalavrasReferencia(readFileSync('pesquisa/00-REFERENCIA-COMPACTA.md', 'utf8'));
  expect(ref).toHaveLength(131);
  expect([...new Set(ref.map(r => r.grupo))]).toEqual(
    ['Placas', 'Curvas', 'Vias', 'Regras', 'Direção defensiva', 'Primeiros socorros', 'Veículo']);
  expect(ref.find(r => r.palavra === 'DEPRESSÃO')).toEqual({ palavra: 'DEPRESSÃO', grupo: 'Placas', dica: 'A-19' });
  expect(ref.find(r => r.palavra === 'TORNIQUETE')!.dica).toBe('prova: "não"');
  expect(ref.at(-1)).toEqual({ palavra: 'RECALL', grupo: 'Veículo', dica: 'chamado gratuito' });
});
test('transformarPalavras acrescenta a grade', () =>
  expect(transformarPalavras([{ ...ok(), palavra: 'TÚNEL' }])[0].grade).toBe('TUNEL'));
test('aceita palavra válida', () => expect(validarPalavras([ok()], PL, ['CURVA'])).toEqual([]));
test.each([
  [{ grade: 'CURVA1' }, 'CURVA: grade "CURVA1" precisa ter de 3 a 12 letras A–Z'],
  [{ palavra: 'ABCDEFGHIJKLM', grade: 'ABCDEFGHIJKLM' }, 'de 3 a 12 letras'],
  [{ grade: 'CURVO' }, 'grade diferente da palavra normalizada'],
  [{ tema: 'outro' as never }, 'tema desconhecido'],
  [{ dica: ' ' }, 'dica vazia'],
  [{ dica: 'x'.repeat(81) }, 'dica com mais de 80 caracteres'],
  [{ significado: 'x'.repeat(201) }, 'significado com mais de 200 caracteres'],
  [{ base: '' }, 'base vazia'],
  [{ placa: 'A-99' }, 'placa A-99 inexistente'],
])('rejeita %o', (p, trecho) =>
  expect(validarPalavras([ok(p)], PL, null).join('\n')).toContain(trecho));
test('grade repetida', () =>
  expect(validarPalavras([ok(), ok()], PL, null).join('\n')).toContain('CURVA: grade repetida'));
test('compara com o §14 nos dois sentidos', () => {
  expect(validarPalavras([ok()], PL, ['CURVA', 'SINUOSA']).join('\n'))
    .toContain('SINUOSA: está no §14 da referência e falta em pesquisa/07');
  expect(validarPalavras([ok(), ok({ palavra: 'RETA', grade: 'RETA' })], PL, ['CURVA']).join('\n'))
    .toContain('RETA: não está no §14 da referência');
});

test('conteúdo: 131 palavras válidas e iguais ao §14', () => {
  const ref = lerPalavrasReferencia(readFileSync('pesquisa/00-REFERENCIA-COMPACTA.md', 'utf8'));
  expect(validarPalavras(PALAVRAS, new Set(PLACAS.map(p => p.codigo)), ref.map(r => r.palavra))).toEqual([]);
  expect(PALAVRAS).toHaveLength(131);
});
test('conteúdo: contagem por tema', () => {
  const n = (t: TemaPalavra) => PALAVRAS.filter(p => p.tema === t).length;
  expect(TEMAS_PALAVRA.map(n)).toEqual([16, 13, 20, 24, 22, 16, 20]);
});
test('conteúdo: vínculos de placa da tabela', () => {
  const placa = (w: string) => PALAVRAS_POR_GRADE.get(w)!.placa;
  expect(placa('DEPRESSAO')).toBe('A-19');
  expect(placa('CONFLUENCIA')).toBe('A-13a');
  expect(placa('ESTACIONAR')).toBe('R-6a');
  expect(placa('LOSANGO')).toBeNull();
  expect(PALAVRAS.filter(p => p.placa !== null)).toHaveLength(23);
});
test('conteúdo: nunca fala em "acidente" fora de SINISTRO', () => {
  for (const p of PALAVRAS) if (p.grade !== 'SINISTRO')
    expect(`${p.dica} ${p.significado}`.toLowerCase()).not.toContain('acidente');
});
test('conteúdo: torniquete traz a prova e a diretriz atual', () => {
  const s = PALAVRAS_POR_GRADE.get('TORNIQUETE')!.significado;
  expect(s).toMatch(/prova/i);
  expect(s).toMatch(/hemorragia grave/i);
});
