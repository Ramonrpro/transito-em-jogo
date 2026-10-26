import type { Area, Questao } from '../conteudo/tipos.ts';
import { embaralhar } from '../util/aleatorio.ts';
import { PROVA } from './regras.ts';
import type { ItemTentativa, Modo, ResultadoArea, Tentativa } from './tipos.ts';

export function criarTentativa(p: {
  modo: Modo;
  area?: Area | null;
  qids: string[];
  agora: number;
  rng: () => number;
  id?: string;
  versaoDe?: (qid: string) => string | undefined;
}): Tentativa {
  return {
    id: p.id ?? crypto.randomUUID(),
    modo: p.modo,
    area: p.area ?? null,
    iniciadaEm: p.agora,
    terminaEm: p.modo === 'prova' ? p.agora + PROVA.duracaoMs : null,
    entregueEm: null,
    autoEntregue: false,
    itens: p.qids.map((qid) => {
      const versao = p.versaoDe?.(qid);
      return {
        qid,
        ordem: embaralhar([0, 1, 2, 3], p.rng),
        resposta: null,
        revisar: false,
        ...(versao !== undefined && { versao }),
      };
    }),
    atual: 0,
    acertos: null,
    porArea: null,
    passou: null,
  };
}

/** Índice original da alternativa exibida na posição `indiceExibido`. */
export function alternativaOriginal(item: ItemTentativa, indiceExibido: number): number {
  return item.ordem[indiceExibido];
}

function trocarItem(t: Tentativa, indice: number, mudanca: Partial<ItemTentativa>): Tentativa {
  return {
    ...t,
    itens: t.itens.map((it, i) => (i === indice ? { ...it, ...mudanca } : it)),
  };
}

export function responder(t: Tentativa, indice: number, alternativaOriginal: number): Tentativa {
  if (t.entregueEm !== null) throw new Error('Tentativa já entregue.');
  if (t.modo !== 'prova' && t.itens[indice].resposta !== null) return t;
  return trocarItem(t, indice, { resposta: alternativaOriginal });
}

export function alternarRevisar(t: Tentativa, indice: number): Tentativa {
  return trocarItem(t, indice, { revisar: !t.itens[indice].revisar });
}

export function irPara(t: Tentativa, indice: number): Tentativa {
  return { ...t, atual: indice };
}

export function acertou(item: ItemTentativa, q: Questao | undefined): boolean {
  return q !== undefined && item.resposta !== null && item.resposta === q.correta;
}

export function entregar(
  t: Tentativa,
  porId: ReadonlyMap<string, Questao>,
  agora: number,
  auto = false,
): Tentativa {
  if (t.entregueEm !== null) return t;
  const porArea: Partial<Record<Area, ResultadoArea>> = {};
  let acertos = 0;
  for (const item of t.itens) {
    const q = porId.get(item.qid);
    const certo = acertou(item, q);
    if (certo) acertos++;
    if (q) {
      const r = porArea[q.area] ?? { acertos: 0, total: 0 };
      porArea[q.area] = { acertos: r.acertos + (certo ? 1 : 0), total: r.total + 1 };
    }
  }
  return {
    ...t,
    entregueEm: t.terminaEm !== null && (auto || agora > t.terminaEm) ? t.terminaEm : agora,
    autoEntregue: auto,
    acertos,
    porArea,
    passou: t.modo === 'prova' ? acertos >= PROVA.minimoAprovacao : null,
  };
}

/** Tempo restante (nunca negativo); `null` fora da prova. */
export function restanteMs(t: Tentativa, agora: number): number | null {
  return t.terminaEm === null ? null : Math.max(0, t.terminaEm - agora);
}

export function expirou(t: Tentativa, agora: number): boolean {
  return t.terminaEm !== null && agora >= t.terminaEm;
}

export function duracaoGastaMs(t: Tentativa): number | null {
  return t.entregueEm === null ? null : t.entregueEm - t.iniciadaEm;
}
