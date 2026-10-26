import type { Direcao, Nivel, TemaPartida } from './tipos.ts';

export const TEMAS: ReadonlyArray<{ id: TemaPartida; nome: string; icone: string }> = [
  { id: 'placas', nome: 'Placas', icone: '🛑' },
  { id: 'curvas', nome: 'Curvas e relevo', icone: '〰️' },
  { id: 'vias', nome: 'Vias', icone: '🛣️' },
  { id: 'regras', nome: 'Regras', icone: '⚖️' },
  { id: 'defensiva', nome: 'Direção defensiva', icone: '🛡️' },
  { id: 'socorros', nome: 'Primeiros socorros', icone: '🚑' },
  { id: 'veiculo', nome: 'Veículo', icone: '🚗' },
  { id: 'misturado', nome: 'Misturado', icone: '🎲' },
];

const FACIL: readonly Direcao[] = [[0, 1], [1, 0]];
const MEDIO: readonly Direcao[] = [...FACIL, [1, 1], [-1, 1]];
const DIFICIL: readonly Direcao[] = [...MEDIO, [0, -1], [-1, 0], [-1, -1], [1, -1]];

export const NIVEIS: Record<
  Nivel,
  { nome: string; tamanho: number; palavras: number; direcoes: readonly Direcao[]; descricao: string }
> = {
  facil: { nome: 'Fácil', tamanho: 8, palavras: 5, direcoes: FACIL, descricao: '8×8 · → ↓' },
  medio: { nome: 'Médio', tamanho: 10, palavras: 7, direcoes: MEDIO, descricao: '10×10 · + diagonal' },
  dificil: {
    nome: 'Difícil',
    tamanho: 12,
    palavras: 9,
    direcoes: DIFICIL,
    descricao: '12×12 · + de trás para frente',
  },
};

export const ORDEM_NIVEIS: readonly Nivel[] = ['facil', 'medio', 'dificil'];

export function nomeTema(t: TemaPartida): string {
  return TEMAS.find((x) => x.id === t)?.nome ?? t;
}
