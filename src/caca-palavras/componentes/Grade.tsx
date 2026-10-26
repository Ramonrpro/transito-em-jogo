import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import { celulaNoPonto, linhaEntre } from '../selecao.ts'

/** Distância mínima, em px, para o dedo que tremeu num toque não virar arrasto. */
const LIMIAR_ARRASTO_PX = 8

interface Props {
  tamanho: number
  letras: string
  /** Casa → índice da cor da palavra achada. */
  marcadas: ReadonlyMap<number, number>
  desabilitada: boolean
  /** Início de um arrasto ou primeiro toque. */
  onInicioSelecao(): void
  /** Fim de um arrasto ou segundo toque. */
  onSelecao(celulas: number[]): void
}

/**
 * Duas formas de marcar uma palavra, que nunca se misturam:
 * - toque: o onClick de cada casa (serve para toque, mouse e teclado) faz o modo de dois toques;
 * - arrasto: eventos de ponteiro no contêiner, com a casa calculada pela posição (no toque, o alvo
 *   do evento fica preso à casa inicial). Depois de um arrasto, o clique que o navegador possa
 *   mandar é ignorado. Sem setPointerCapture: com ele o clique de um toque simples pode ir para o
 *   contêiner em vez da casa.
 */
export default function Grade(props: Props) {
  const { tamanho, letras, marcadas, desabilitada } = props
  const caixa = useRef<HTMLDivElement>(null)
  const [ancora, setAncora] = useState<number | null>(null)
  const [selecao, setSelecao] = useState<ReadonlySet<number>>(() => new Set())
  // Ligado ao fim de um arrasto: o clique que o navegador mandar em seguida é ignorado.
  // Desliga no próximo pointerdown, para não engolir um toque se esse clique nunca vier.
  const ignorarClique = useRef(false)
  const encerrarArrasto = useRef<(() => void) | null>(null)
  const ultimas = useRef(props)
  useEffect(() => {
    ultimas.current = props
  })
  useEffect(() => () => encerrarArrasto.current?.(), [])

  // No Chrome do Android, um arrasto solto ainda em movimento inicia um "fling" (mesmo sem rolar,
  // por causa do touch-action: none), e o toque seguinte, na grade ou em "Continuar", só para o
  // fling e não gera clique. Cancelar o touchmove evita o fling; o toque com tremida segue clicando.
  // Precisa ser nativo: o React registra touchmove como passivo.
  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const segurar = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault()
    }
    el.addEventListener('touchmove', segurar, { passive: false })
    return () => el.removeEventListener('touchmove', segurar)
  }, [])

  const casaNoPonto = (x: number, y: number) => {
    const el = caixa.current
    return el ? celulaNoPonto(el.getBoundingClientRect(), ultimas.current.tamanho, x, y) : -1
  }

  const aoApertar = (e: PointerEvent<HTMLDivElement>) => {
    // Um segundo dedo não interrompe o arrasto do primeiro.
    if (!e.isPrimary || e.button !== 0) return
    // Arrasto cujo pointerup se perdeu; depois dele, nenhum clique antigo deve ser ignorado.
    encerrarArrasto.current?.()
    ignorarClique.current = false
    if (desabilitada) return
    const inicio = casaNoPonto(e.clientX, e.clientY)
    if (inicio < 0) return
    const x0 = e.clientX
    const y0 = e.clientY
    const id = e.pointerId
    let atual = inicio
    let arrastando = false

    const limpar = () => {
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', soltar)
      window.removeEventListener('pointercancel', cancelar)
      encerrarArrasto.current = null
      if (arrastando) {
        ignorarClique.current = true
        setSelecao(new Set())
      }
    }
    const mover = (ev: globalThis.PointerEvent) => {
      if (ev.pointerId !== id) return
      const c = casaNoPonto(ev.clientX, ev.clientY)
      if (c < 0 || c === atual) return
      if (!arrastando) {
        if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < LIMIAR_ARRASTO_PX) return
        arrastando = true
        setAncora(null)
        ultimas.current.onInicioSelecao()
      }
      atual = c
      setSelecao(new Set(linhaEntre(inicio, c, ultimas.current.tamanho)))
    }
    const soltar = (ev: globalThis.PointerEvent) => {
      if (ev.pointerId !== id) return
      const eraArrasto = arrastando
      limpar()
      if (eraArrasto) ultimas.current.onSelecao(linhaEntre(inicio, atual, ultimas.current.tamanho))
    }
    const cancelar = (ev: globalThis.PointerEvent) => {
      if (ev.pointerId === id) limpar()
    }

    // Na janela: o mouse pode ser solto fora da grade.
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', soltar)
    window.addEventListener('pointercancel', cancelar)
    encerrarArrasto.current = limpar
  }

  const tocar = (casa: number, e: MouseEvent) => {
    // detail 0 = clique do teclado, que nunca vem de um arrasto.
    if (ignorarClique.current && e.detail !== 0) {
      ignorarClique.current = false
      return
    }
    if (desabilitada) return
    if (ancora === null) {
      setAncora(casa)
      props.onInicioSelecao()
    } else if (ancora === casa) {
      setAncora(null)
    } else {
      setAncora(null)
      props.onSelecao(linhaEntre(ancora, casa, tamanho))
    }
  }

  return (
    <div
      ref={caixa}
      className="grade"
      role="group"
      aria-label="Grade de letras"
      style={{ '--tamanho': tamanho } as CSSProperties}
      onPointerDown={aoApertar}
      onContextMenu={(e) => e.preventDefault()}
    >
      {Array.from(letras, (letra, i) => {
        const cor = marcadas.get(i)
        return (
          <button
            key={i}
            type="button"
            className="casa"
            data-celula={i}
            data-cor={cor !== undefined ? (cor % 6) + 1 : undefined}
            data-selecionada={selecao.has(i) || ancora === i ? '' : undefined}
            aria-label={`Linha ${Math.floor(i / tamanho) + 1}, coluna ${(i % tamanho) + 1}: ${letra}`}
            disabled={desabilitada}
            onClick={(e) => tocar(i, e)}
          >
            {letra}
          </button>
        )
      })}
    </div>
  )
}
