/** Formata milissegundos como "MM:SS" (3_600_000 → "60:00"). Valores negativos viram "00:00". */
export function formatarMinSeg(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(total / 60);
  const seg = total % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}
