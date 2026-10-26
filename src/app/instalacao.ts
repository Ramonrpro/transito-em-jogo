export type Plataforma = 'android-chrome' | 'ios-safari' | 'outra'

export const DIAS_PARA_REMOSTRAR = 3
const DIA_MS = 86_400_000

export function detectarPlataforma(userAgent: string, maxTouchPoints: number): Plataforma {
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'ios-safari'
  // iPadOS se identifica como Mac; só o toque o diferencia de um Mac de verdade.
  if (/Macintosh/.test(userAgent) && maxTouchPoints > 1) return 'ios-safari'
  if (/Android/.test(userAgent) && /Chrome/.test(userAgent)) return 'android-chrome'
  return 'outra'
}

export function deveMostrarConvite(p: {
  instalado: boolean
  dispensadoEm: number | null
  agora: number
  temPromptNativo: boolean
  plataforma: Plataforma
}): boolean {
  if (p.instalado) return false
  if (p.dispensadoEm !== null && p.agora - p.dispensadoEm < DIAS_PARA_REMOSTRAR * DIA_MS) return false
  return p.temPromptNativo || p.plataforma === 'ios-safari'
}

export const CHAVE_DISPENSADO = 'tej:conviteDispensadoEm'

export function estaInstalado(): boolean {
  try {
    const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
    return iosStandalone || window.matchMedia?.('(display-mode: standalone)').matches === true
  } catch {
    return false
  }
}

export function lerDispensadoEm(): number | null {
  try {
    const v = Number(localStorage.getItem(CHAVE_DISPENSADO))
    return Number.isFinite(v) && v > 0 ? v : null
  } catch {
    return null
  }
}

export function gravarDispensado(agora: number): void {
  try {
    localStorage.setItem(CHAVE_DISPENSADO, String(agora))
  } catch {
    // sem armazenamento: o convite simplesmente volta na próxima visita
  }
}
