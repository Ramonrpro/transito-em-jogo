import type { Partida } from '../caca-palavras/tipos.ts';
import { NIVEIS, TEMAS } from '../caca-palavras/regras.ts';
import type { Tentativa } from '../simulado/tipos.ts';
import type { Banco, EntradaErrada } from './db.ts';

export const FORMATO_ATUAL = 2;

export interface CopiaDeSeguranca {
  app: 'transito-em-jogo';
  formato: 2;
  exportadaEm: number;
  tentativas: Tentativa[];
  erradas: EntradaErrada[];
  vistas: string[];
  partidas: Partida[];
}

export class CopiaInvalidaError extends Error {
  readonly motivo: 'formato' | 'versao-nova';
  constructor(motivo: 'formato' | 'versao-nova') {
    super(
      motivo === 'versao-nova'
        ? 'Esta cópia foi feita por uma versão mais nova do app.'
        : 'Arquivo de cópia inválido.',
    );
    this.name = 'CopiaInvalidaError';
    this.motivo = motivo;
  }
}

export async function exportarCopia(banco: Banco, agora: number): Promise<CopiaDeSeguranca> {
  const [tentativas, erradas, vistas, partidas] = await banco.serializar(() =>
    Promise.all([banco.getAll('tentativas'), banco.getAll('erradas'), banco.getAll('vistas'), banco.getAll('partidas')]),
  );
  return {
    app: 'transito-em-jogo',
    formato: FORMATO_ATUAL,
    exportadaEm: agora,
    tentativas,
    erradas,
    vistas: vistas.map((v) => v.qid),
    partidas,
  };
}

/** Nome com a data LOCAL: transito-em-jogo-copia-AAAA-MM-DD.json */
export function nomeArquivoCopia(agora: number): string {
  const d = new Date(agora);
  const dois = (n: number) => String(n).padStart(2, '0');
  return `transito-em-jogo-copia-${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}.json`;
}

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const ehTentativa = (v: unknown) =>
  ehObjeto(v) &&
  typeof v.id === 'string' &&
  typeof v.modo === 'string' &&
  typeof v.iniciadaEm === 'number' &&
  (v.entregueEm === null || typeof v.entregueEm === 'number') &&
  Array.isArray(v.itens);

const ehErrada = (v: unknown) =>
  ehObjeto(v) &&
  typeof v.qid === 'string' &&
  typeof v.acertosSeguidos === 'number' &&
  typeof v.erradaEm === 'number';

const ehPartida = (v: unknown) =>
  ehObjeto(v) &&
  typeof v.id === 'string' &&
  TEMAS.some((t) => t.id === v.tema) &&
  typeof v.nivel === 'string' &&
  Object.hasOwn(NIVEIS, v.nivel) &&
  typeof v.letras === 'string' &&
  typeof v.tamanho === 'number' &&
  typeof v.iniciadaEm === 'number' &&
  typeof v.tempoMs === 'number' &&
  (v.terminadaEm === null || typeof v.terminadaEm === 'number') &&
  Array.isArray(v.colocacoes) &&
  Array.isArray(v.achadas);

function validar(bruto: unknown): CopiaDeSeguranca {
  if (!ehObjeto(bruto) || bruto.app !== 'transito-em-jogo' || typeof bruto.formato !== 'number') {
    throw new CopiaInvalidaError('formato');
  }
  if (bruto.formato > FORMATO_ATUAL) throw new CopiaInvalidaError('versao-nova');
  const { tentativas, erradas, vistas } = bruto;
  if (
    (bruto.formato !== 1 && bruto.formato !== 2) ||
    typeof bruto.exportadaEm !== 'number' ||
    !Array.isArray(tentativas) || !tentativas.every(ehTentativa) ||
    !Array.isArray(erradas) || !erradas.every(ehErrada) ||
    !Array.isArray(vistas) || !vistas.every((q) => typeof q === 'string') ||
    (bruto.formato === 2 && (!Array.isArray(bruto.partidas) || !bruto.partidas.every(ehPartida)))
  ) {
    throw new CopiaInvalidaError('formato');
  }
  return { ...bruto, partidas: bruto.formato === 2 ? bruto.partidas : [] } as unknown as CopiaDeSeguranca;
}

/** Valida tudo antes de tocar nos dados; depois SUBSTITUI o histórico numa única transação. */
export async function importarCopia(banco: Banco, bruto: unknown): Promise<void> {
  const copia = validar(bruto);
  await banco.serializar(() =>
    banco.substituirTudo({
      tentativas: copia.tentativas,
      erradas: copia.erradas,
      vistas: copia.vistas.map((qid) => ({ qid })),
      partidas: copia.partidas,
    }),
  );
}
