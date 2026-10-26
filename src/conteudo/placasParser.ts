import type { Credito, Placa } from './tipos.ts';

const CODIGO = /^[RA]-\d+[a-z]?$/;
const ARQUIVO = /`(File:[^`]+)`/g;
const R19_ARQUIVO = 'File:Brasil R-19 (60).svg';

export function lerTabelaPlacas(markdown: string): Placa[] {
  const placas: Placa[] = [];
  for (const linha of markdown.split('\n')) {
    if (!linha.startsWith('|')) continue;
    const c = linha.split(/(?<!\\)\|/).slice(1, -1).map((s) => s.trim());
    if (c.length < 5 || !CODIGO.test(c[0])) continue;
    const arquivos = [...c[3].matchAll(ARQUIVO)].map((m) => m[1]);
    if (arquivos.length === 0) continue;
    // R-44 só tem um candidato não oficial (Brasil R-36c.svg): fica de fora das 120 placas oficiais.
    if (c[3].includes('não oficial')) continue;

    // Uma licença por arquivo quando a célula traz o mesmo número de partes (separadas por <br>).
    const partes = c[4].split('<br>');
    const licencaDe = (i: number) => (partes.length === arquivos.length ? partes[i] : c[4]);
    const publico = (i: number) => licencaDe(i).includes('Domínio público');

    let i = 0;
    if (c[0] === 'R-19' && arquivos.includes(R19_ARQUIVO)) i = arquivos.indexOf(R19_ARQUIVO);
    else {
      const pd = arquivos.findIndex((_, k) => publico(k));
      if (pd >= 0) i = pd;
    }
    placas.push({
      codigo: c[0],
      nome: c[1],
      significado: c[2],
      tipo: c[0].startsWith('R') ? 'regulamentacao' : 'advertencia',
      arquivoCommons: arquivos[i],
      dominioPublico: publico(i),
    });
  }
  return placas;
}

export function validarPlacas(
  placas: Placa[],
  creditos: Credito[],
  arquivosSvg: ReadonlySet<string>,
): string[] {
  const erros: string[] = [];
  const porCodigo = new Map(creditos.map((c) => [c.codigo, c]));
  for (const p of placas) {
    if (!arquivosSvg.has(p.codigo)) erros.push(`${p.codigo}: sem SVG em public/placas`);
    if (!p.dominioPublico && !porCodigo.has(p.codigo)) erros.push(`${p.codigo}: sem crédito`);
  }
  for (const c of creditos) {
    if (!c.autor?.trim()) erros.push(`${c.codigo}: crédito sem autor`);
    if (!c.licenca?.trim()) erros.push(`${c.codigo}: crédito sem licença`);
  }
  return erros;
}

export function urlPlaca(codigo: string): string {
  return `${import.meta.env.BASE_URL}placas/${codigo}.svg`;
}
