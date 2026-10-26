/** Formata milissegundos como "MM:SS" (3_600_000 → "60:00"). Valores negativos viram "00:00". */
export function formatarMinSeg(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(total / 60);
  const seg = total % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

function inicioDoDia(ms: number): number {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** "hoje", "ontem" ou "dd/mm", no fuso local. */
export function formatarQuando(ms: number, agora: number): string {
  const dias = Math.round((inicioDoDia(agora) - inicioDoDia(ms)) / 86_400_000)
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  const d = new Date(ms)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}
