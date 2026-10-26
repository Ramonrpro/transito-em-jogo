import { PALAVRAS } from '../conteudo/index.ts';
import type { Palavra } from '../conteudo/tipos.ts';
import { escolherPalavras, gerarGrade } from './grade.ts';
import { NIVEIS } from './regras.ts';
import type { Nivel, Partida, TemaPartida } from './tipos.ts';

const TENTATIVAS_PARTIDA = 50;

export function palavrasDoTema(tema: TemaPartida, todas: readonly Palavra[] = PALAVRAS): Palavra[] {
  return tema === 'misturado' ? [...todas] : todas.filter((p) => p.tema === tema);
}

export function criarPartida(p: {
  tema: TemaPartida;
  nivel: Nivel;
  jaAchadas: ReadonlySet<string>;
  agora: number;
  rng: () => number;
  id?: string;
  palavras?: readonly Palavra[];
}): Partida {
  const cfg = NIVEIS[p.nivel];
  const candidatas = palavrasDoTema(p.tema, p.palavras);
  for (let t = 0; t < TENTATIVAS_PARTIDA; t++) {
    const escolhidas = escolherPalavras(candidatas, cfg.palavras, cfg.tamanho, p.jaAchadas, p.rng);
    if (escolhidas.length < cfg.palavras) break;
    const grade = gerarGrade(
      escolhidas.map((e) => e.grade),
      cfg.tamanho,
      cfg.direcoes,
      p.rng,
    );
    if (!grade) continue;
    return {
      id: p.id ?? crypto.randomUUID(),
      tema: p.tema,
      nivel: p.nivel,
      tamanho: cfg.tamanho,
      letras: grade.letras,
      colocacoes: grade.colocacoes,
      achadas: [],
      iniciadaEm: p.agora,
      terminadaEm: null,
      tempoMs: 0,
    };
  }
  throw new Error('Não foi possível montar a grade');
}

export function registrarAchada(p: Partida, palavra: string, agora: number, tempoMs: number): Partida {
  if (p.terminadaEm !== null) return p;
  if (!p.colocacoes.some((c) => c.palavra === palavra)) return p;
  if (p.achadas.includes(palavra)) return p;
  const achadas = [...p.achadas, palavra];
  const terminou = achadas.length === p.colocacoes.length;
  return { ...p, achadas, tempoMs, terminadaEm: terminou ? agora : null };
}

export function palavrasJaAchadas(partidas: readonly Partida[]): Set<string> {
  return new Set(partidas.flatMap((p) => p.achadas));
}

export function resumoRecorde(
  p: Partida,
  todas: readonly Partida[],
): { melhorMs: number; novoRecorde: boolean; primeira: boolean } {
  const fim = p.terminadaEm ?? Infinity;
  const anteriores = todas.filter(
    (o) =>
      o.id !== p.id &&
      o.tema === p.tema &&
      o.nivel === p.nivel &&
      o.terminadaEm !== null &&
      o.terminadaEm < fim,
  );
  if (anteriores.length === 0) return { melhorMs: p.tempoMs, novoRecorde: false, primeira: true };
  const melhorAnterior = Math.min(...anteriores.map((o) => o.tempoMs));
  return {
    melhorMs: Math.min(p.tempoMs, melhorAnterior),
    novoRecorde: p.tempoMs < melhorAnterior,
    primeira: false,
  };
}
