import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { abrirBanco } from '../dados/db.ts'
import { criarRepositorio, type Repositorio } from '../dados/repositorio.ts'

const ContextoRepositorio = createContext<Repositorio | null>(null)

export function ProvedorDados({ children, fabrica }: { children: ReactNode; fabrica?: IDBFactory }) {
  const [repo, setRepo] = useState<Repositorio | null>(null)

  useEffect(() => {
    let cancelado = false
    abrirBanco(fabrica).then((banco) => {
      if (!cancelado) setRepo(criarRepositorio(banco))
    })
    return () => {
      cancelado = true
    }
  }, [fabrica])

  if (!repo) return null
  return (
    <ContextoRepositorio.Provider value={repo}>
      {!repo.persistente && (
        <div role="status" className="aviso-memoria">
          Seu navegador não está salvando dados (modo anônimo?). O histórico desta sessão vai se
          perder ao fechar.
        </div>
      )}
      {children}
    </ContextoRepositorio.Provider>
  )
}

export function useRepositorio(): Repositorio {
  const repo = useContext(ContextoRepositorio)
  if (!repo) throw new Error('useRepositorio fora do ProvedorDados')
  return repo
}

let persistenciaPedida = false

/** Só deve ser chamada depois de uma ação da pessoa (nunca ao abrir o app). */
export function pedirPersistencia(): void {
  if (persistenciaPedida) return
  persistenciaPedida = true
  void navigator.storage?.persist?.()
}
