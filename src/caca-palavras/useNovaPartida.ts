import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirmar } from '../app/Confirmar.tsx'
import { pedirPersistencia, useRepositorio } from '../app/contexto.tsx'
import { criarRng } from '../util/aleatorio.ts'
import { iniciarPartida } from './fluxo.ts'
import type { Nivel, Partida, TemaPartida } from './tipos.ts'

/** Pergunta e, se a pessoa aceitar, apaga a partida dada. Devolve se seguiu em frente. */
export function useDescartarPartida(): (p: Partida | undefined) => Promise<boolean> {
  const repo = useRepositorio()
  const confirmar = useConfirmar()
  return useCallback(
    async (p) => {
      if (!p) return true
      const ok = await confirmar({
        titulo: 'Descartar a partida em andamento?',
        texto: 'Ela não vai para o histórico.',
        confirmar: 'Descartar',
      })
      if (!ok) return false
      await repo.descartarPartida(p.id)
      return true
    },
    [repo, confirmar],
  )
}

export function useNovaPartida(): (tema: TemaPartida, nivel: Nivel) => Promise<void> {
  const repo = useRepositorio()
  const navegar = useNavigate()
  const descartar = useDescartarPartida()
  const ocupado = useRef(false)
  return useCallback(
    async (tema, nivel) => {
      if (ocupado.current) return
      ocupado.current = true
      try {
        if (!(await descartar(await repo.partidaEmAndamento()))) return
        pedirPersistencia()
        const agora = Date.now()
        const p = await iniciarPartida(repo, { tema, nivel, agora, rng: criarRng(agora >>> 0) })
        navegar(`/caca-palavras/${p.id}`)
      } finally {
        ocupado.current = false
      }
    },
    [repo, navegar, descartar],
  )
}
