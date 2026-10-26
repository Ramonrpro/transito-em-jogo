import type { Palavra, PalavraBruta, TemaPalavra } from './tipos.ts';

export const TEMAS_PALAVRA: readonly TemaPalavra[] = [
  'placas', 'curvas', 'vias', 'regras', 'defensiva', 'socorros', 'veiculo',
];

export function normalizarPalavra(palavra: string): string {
  return palavra
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[-\s]/g, '')
    .toUpperCase();
}

export interface PalavraReferencia { palavra: string; grupo: string; dica: string }

export function lerPalavrasReferencia(markdown: string): PalavraReferencia[] {
  const linhas = markdown.split('\n');
  const ini = linhas.findIndex(l => l.startsWith('## 14.'));
  if (ini < 0) return [];
  const itens: PalavraReferencia[] = [];
  for (const linha of linhas.slice(ini + 1)) {
    if (linha.startsWith('## ')) break;
    const m = linha.match(/^\*\*(.+?):\*\* (.+)$/);
    if (!m) continue;
    const grupo = m[1];
    const corpo = m[2].trim().replace(/\.$/, '');
    for (const item of corpo.split('; ')) {
      const i = item.indexOf(': ');
      if (i < 0) continue;
      itens.push({ palavra: item.slice(0, i), grupo, dica: item.slice(i + 2) });
    }
  }
  return itens;
}

export function transformarPalavras(brutas: PalavraBruta[]): Palavra[] {
  return brutas.map(b => ({ ...b, grade: normalizarPalavra(b.palavra) }));
}

export function validarPalavras(
  ps: Palavra[],
  codigosPlacas: ReadonlySet<string> | null,
  referencia: readonly string[] | null,
): string[] {
  const erros: string[] = [];
  const grades = new Set<string>();
  for (const p of ps) {
    const e = (msg: string) => erros.push(`${p.palavra}: ${msg}`);
    if (!/^[A-Z]{3,12}$/.test(p.grade)) e(`grade "${p.grade}" precisa ter de 3 a 12 letras A–Z`);
    if (p.grade !== normalizarPalavra(p.palavra)) e('grade diferente da palavra normalizada');
    if (grades.has(p.grade)) e('grade repetida');
    grades.add(p.grade);
    if (!TEMAS_PALAVRA.includes(p.tema)) e('tema desconhecido');
    if (!p.dica.trim()) e('dica vazia');
    else if (p.dica.length > 80) e('dica com mais de 80 caracteres');
    if (!p.significado.trim()) e('significado vazio');
    else if (p.significado.length > 200) e('significado com mais de 200 caracteres');
    if (!p.base.trim()) e('base vazia');
    if (p.placa !== null && codigosPlacas && !codigosPlacas.has(p.placa)) e(`placa ${p.placa} inexistente`);
  }
  if (referencia) {
    const nossas = new Set(ps.map(p => p.palavra));
    const dela = new Set(referencia);
    for (const r of referencia) {
      if (!nossas.has(r)) erros.push(`${r}: está no §14 da referência e falta em pesquisa/07`);
    }
    for (const p of ps) {
      if (!dela.has(p.palavra)) erros.push(`${p.palavra}: não está no §14 da referência`);
    }
  }
  return erros;
}
