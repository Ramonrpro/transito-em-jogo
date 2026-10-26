import { areaDe } from './areas.ts';
import type { Questao, QuestaoBruta } from './tipos.ts';

const REMOVIDAS = new Set(['sin-033']);

const RESPOSTAS_BANCO_OFICIAL: Record<string, string> = {
  'leg-074': 'Sim, desde que tenham condições de cuidar de sua própria segurança',
  'leg-113': 'Sempre, mesmo de dia, em rodovias',
  'leg-118': 'De 4 a 10 anos ou até 1,45 m',
  'sin-026': 'Infração grave',
  'ps-009': 'Posicionar-se contra o vento',
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function transformarQuestoes(brutas: QuestaoBruta[]): Questao[] {
  const vistos = new Set<string>();
  const resultado: Questao[] = [];
  for (const b of brutas) {
    if (REMOVIDAS.has(b.id)) continue;
    if (b.placa === null) {
      const chave = normalizar(b.enunciado);
      if (vistos.has(chave)) continue;
      vistos.add(chave);
    }
    resultado.push({
      id: b.id,
      area: areaDe(b.tema, b.subtema),
      tema: b.tema,
      subtema: b.subtema,
      enunciado: b.enunciado,
      alternativas: b.alternativas as Questao['alternativas'],
      correta: b.correta as Questao['correta'],
      explicacao: b.explicacao,
      baseLegal: b.base_legal,
      placa: b.placa,
      fonte: b.fonte,
      respostaBancoOficial: RESPOSTAS_BANCO_OFICIAL[b.id] ?? null,
    });
  }
  return resultado;
}
