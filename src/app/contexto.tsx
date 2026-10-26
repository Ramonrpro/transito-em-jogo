import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { abrirBanco, BancoDesatualizadoError, type Banco } from '../dados/db.ts'
import { criarRepositorio, type Repositorio } from '../dados/repositorio.ts'

const ContextoRepositorio = createContext<Repositorio | null>(null)
const ContextoBanco = createContext<Banco | null>(null)

export function ProvedorDados({ children, fabrica }: { children: ReactNode; fabrica?: IDBFactory }) {
  const [repo, setRepo] = useState<Repositorio | null>(null)
  const [banco, setBanco] = useState<Banco | null>(null)
  const [desatualizado, setDesatualizado] = useState(false)

  useEffect(() => {
    let cancelado = false
    abrirBanco(fabrica, { aoDesatualizar: () => !cancelado && setDesatualizado(true) })
      .then((banco) => {
        if (cancelado) return
        setBanco(banco)
        setRepo(criarRepositorio(banco))
      })
      .catch((e) => {
        if (!cancelado && e instanceof BancoDesatualizadoError) setDesatualizado(true)
      })
    return () => {
      cancelado = true
    }
  }, [fabrica])

  if (desatualizado) {
    return (
      <main className="tela-atualize">
        <h1>Atualize o app</h1>
        <p>
          Uma versão mais nova do app já está guardando os seus dados neste celular. Recarregue
          para continuar.
        </p>
        <button type="button" className="botao" onClick={() => location.reload()}>
          Recarregar
        </button>
      </main>
    )
  }
  if (!repo || !banco) return null
  return (
    <ContextoRepositorio.Provider value={repo}>
      <ContextoBanco.Provider value={banco}>
      {!repo.persistente && (
        <div role="status" className="aviso-memoria">
          Seu navegador não está salvando dados (modo anônimo?). O histórico desta sessão vai se
          perder ao fechar.
        </div>
      )}
      {children}
      </ContextoBanco.Provider>
    </ContextoRepositorio.Provider>
  )
}

export function useRepositorio(): Repositorio {
  const repo = useContext(ContextoRepositorio)
  if (!repo) throw new Error('useRepositorio fora do ProvedorDados')
  return repo
}

/** Conexão única do app; necessária só para cópia de segurança. */
export function useBanco(): Banco {
  const banco = useContext(ContextoBanco)
  if (!banco) throw new Error('useBanco fora do ProvedorDados')
  return banco
}

let persistenciaPedida = false

/** Só deve ser chamada depois de uma ação da pessoa (nunca ao abrir o app). */
export function pedirPersistencia(): void {
  if (persistenciaPedida) return
  persistenciaPedida = true
  void navigator.storage?.persist?.()
}
