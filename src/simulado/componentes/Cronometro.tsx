import { useEffect, useRef, useState } from 'react'
import { formatarMinSeg } from '../../util/tempo.ts'

const ALERTA_MS = 5 * 60_000

/** Tempo restante calculado sempre a partir de `terminaEm`; recalcula a cada 1 s e ao voltar à aba. */
export function useRestante(terminaEm: number | null): number | null {
  const calcular = () => (terminaEm === null ? null : Math.max(0, terminaEm - Date.now()))
  const [restante, setRestante] = useState(calcular)
  useEffect(() => {
    if (terminaEm === null) return
    const atualizar = () => setRestante(Math.max(0, terminaEm - Date.now()))
    atualizar()
    const id = setInterval(atualizar, 1000)
    document.addEventListener('visibilitychange', atualizar)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [terminaEm])
  return restante
}

export default function Cronometro({ terminaEm, onZerou }: { terminaEm: number; onZerou: () => void }) {
  const restante = useRestante(terminaEm) ?? 0
  const disparou = useRef(false)
  const aoZerar = useRef(onZerou)
  aoZerar.current = onZerou
  useEffect(() => {
    if (restante > 0 || disparou.current) return
    disparou.current = true
    aoZerar.current()
  }, [restante])
  return (
    <span className={restante < ALERTA_MS ? 'cronometro cronometro-alerta' : 'cronometro'}>
      ⏱ {formatarMinSeg(restante)}
    </span>
  )
}
