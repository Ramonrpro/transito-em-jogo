import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export interface PedidoConfirmacao {
  titulo: string
  texto?: string
  confirmar: string
  cancelar?: string
}

type Confirmador = (p: PedidoConfirmacao) => Promise<boolean>

const ContextoConfirmar = createContext<Confirmador | null>(null)

export function ProvedorConfirmar({ children }: { children: ReactNode }) {
  const [pedido, setPedido] = useState<PedidoConfirmacao | null>(null)
  const resolver = useRef<((v: boolean) => void) | null>(null)
  const dialogo = useRef<HTMLDialogElement>(null)

  const confirmar = useCallback<Confirmador>((p) => {
    resolver.current?.(false)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
      setPedido(p)
    })
  }, [])

  useEffect(() => {
    const d = dialogo.current
    if (!pedido || !d || d.open) return
    if (typeof d.showModal === 'function') d.showModal()
    else d.setAttribute('open', '')
  }, [pedido])

  const responder = (valor: boolean) => {
    resolver.current?.(valor)
    resolver.current = null
    dialogo.current?.close?.()
    setPedido(null)
  }

  return (
    <ContextoConfirmar.Provider value={confirmar}>
      {children}
      {pedido && (
        <dialog
          ref={dialogo}
          className="dialogo"
          aria-labelledby="dialogo-titulo"
          onCancel={(e) => {
            e.preventDefault()
            responder(false)
          }}
        >
          <h2 id="dialogo-titulo">{pedido.titulo}</h2>
          {pedido.texto && <p>{pedido.texto}</p>}
          <div className="dialogo-acoes">
            <button type="button" className="botao botao-secundario" onClick={() => responder(false)}>
              {pedido.cancelar ?? 'Cancelar'}
            </button>
            <button type="button" className="botao botao-principal" onClick={() => responder(true)}>
              {pedido.confirmar}
            </button>
          </div>
        </dialog>
      )}
    </ContextoConfirmar.Provider>
  )
}

export function useConfirmar(): Confirmador {
  const c = useContext(ContextoConfirmar)
  if (!c) throw new Error('useConfirmar fora do ProvedorConfirmar')
  return c
}
