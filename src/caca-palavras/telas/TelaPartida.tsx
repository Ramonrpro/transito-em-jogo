import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useRepositorio } from '../../app/contexto.tsx'
import Topo from '../../app/Topo.tsx'
import { PALAVRAS_POR_GRADE } from '../../conteudo/index.ts'
import { formatarMinSeg } from '../../util/tempo.ts'
import CartaoAchou from '../componentes/CartaoAchou.tsx'
import Etiquetas from '../componentes/Etiquetas.tsx'
import Grade from '../componentes/Grade.tsx'
import { registrarAchada } from '../partida.ts'
import { nomeTema } from '../regras.ts'
import { conferirSelecao } from '../selecao.ts'
import type { Partida } from '../tipos.ts'

export default function TelaPartida() {
  const { id = '' } = useParams()
  // Uma montagem por partida: trocar de id nunca mistura o tempo de duas partidas.
  return <Jogo key={id} id={id} />
}

const visivel = () => document.visibilityState !== 'hidden'

/** Atualiza a cada segundo, sem aria-live: anunciar o tempo sem parar atrapalharia. */
function Relogio({ obterMs, finalMs }: { obterMs: () => number; finalMs: number | null }) {
  const [ms, setMs] = useState(obterMs)
  useEffect(() => {
    if (finalMs !== null) return
    const id = setInterval(() => setMs(obterMs()), 1000)
    return () => clearInterval(id)
  }, [obterMs, finalMs])
  return <span className="cronometro">⏱ {formatarMinSeg(finalMs ?? ms)}</span>
}

function Jogo({ id }: { id: string }) {
  const repo = useRepositorio()
  const navegar = useNavigate()
  const [situacao, setSituacao] = useState<'carregando' | 'inexistente' | 'concluida' | 'jogando'>(
    'carregando',
  )
  const [p, setP] = useState<Partida | null>(null)
  const [achou, setAchou] = useState<string | null>(null)
  const [dica, setDica] = useState<string | null>(null)
  // Estado mais recente; todas as gravações partem daqui. Pausar muda só o tempo, sem re-render.
  const atual = useRef<Partida | null>(null)
  // Date.now() de quando a contagem foi retomada; null com o tempo parado.
  const retomadaEm = useRef<number | null>(null)

  const tempoAtivo = useCallback((agora: number) => {
    const base = atual.current
    if (!base) return 0
    // Relógio de parede pode andar para trás: nunca soma tempo negativo.
    return base.tempoMs + (retomadaEm.current === null ? 0 : Math.max(0, agora - retomadaEm.current))
  }, [])
  const obterMs = useCallback(() => tempoAtivo(Date.now()), [tempoAtivo])

  useEffect(() => {
    let cancelado = false
    repo.obterPartida(id).then((r) => {
      if (cancelado) return
      if (!r) return setSituacao('inexistente')
      if (r.terminadaEm !== null) return setSituacao('concluida')
      atual.current = r
      if (visivel()) retomadaEm.current = Date.now()
      setP(r)
      setSituacao('jogando')
    })
    return () => {
      cancelado = true
    }
  }, [repo, id])

  // O tempo em segundo plano não conta: o iPhone fecha o app ao trocar para outro.
  useEffect(() => {
    const pausar = () => {
      const base = atual.current
      if (!base || base.terminadaEm !== null || retomadaEm.current === null) return
      const nova = { ...base, tempoMs: tempoAtivo(Date.now()) }
      retomadaEm.current = null
      atual.current = nova
      // Sem aviso de erro: ao pausar ou sair, o banco pode já estar fechado (versionchange) e o
      // aviso global esconderia o "Atualize o app".
      repo.salvarPartida(nova).catch(() => {})
    }
    const retomar = () => {
      const base = atual.current
      if (!base || base.terminadaEm !== null || retomadaEm.current !== null || !visivel()) return
      retomadaEm.current = Date.now()
    }
    const aoMudarVisibilidade = () => (visivel() ? retomar() : pausar())
    document.addEventListener('visibilitychange', aoMudarVisibilidade)
    window.addEventListener('pagehide', pausar)
    window.addEventListener('pageshow', retomar)
    return () => {
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
      window.removeEventListener('pagehide', pausar)
      window.removeEventListener('pageshow', retomar)
      pausar()
    }
  }, [repo, tempoAtivo])

  const marcadas = useMemo(() => {
    const m = new Map<number, number>()
    p?.achadas.forEach((grade, k) => {
      p.colocacoes.find((c) => c.palavra === grade)?.celulas.forEach((casa) => m.set(casa, k))
    })
    return m
  }, [p])
  const achadas = useMemo(() => new Set(p?.achadas), [p])
  const palavras = useMemo(() => p?.colocacoes.map((c) => c.palavra) ?? [], [p])

  const aoSelecionar = (celulas: number[]) => {
    const base = atual.current
    if (!base || base.terminadaEm !== null) return
    const grade = conferirSelecao(base, celulas)
    if (!grade) return
    const agora = Date.now()
    const nova = registrarAchada(base, grade, agora, tempoAtivo(agora))
    if (nova === base) return
    // tempoMs já inclui o trecho até agora; o próximo trecho começa aqui (ou para, no fim).
    retomadaEm.current = nova.terminadaEm === null && retomadaEm.current !== null ? agora : null
    atual.current = nova
    setP(nova)
    setAchou(grade)
    void repo.salvarPartida(nova)
  }

  if (situacao === 'carregando') return null
  if (situacao === 'inexistente') {
    return (
      <>
        <Topo titulo="Caça-palavras" />
        <div className="partida-inexistente">
          <p>Partida não encontrada.</p>
          <Link to="/caca-palavras" className="botao botao-link">
            Voltar ao caça-palavras
          </Link>
        </div>
      </>
    )
  }
  if (situacao === 'concluida') return <Navigate to={`/caca-palavras/${id}/fim`} replace />
  if (!p) return null

  const concluida = p.terminadaEm !== null
  const info = dica === null ? undefined : PALAVRAS_POR_GRADE.get(dica)
  const textoDica =
    dica === null ? 'Toque numa etiqueta para ver a dica.' : info ? `${dica}: ${info.dica}` : dica

  return (
    <div className="partida">
      <Topo titulo={nomeTema(p.tema)} />
      <div className="partida-status">
        <Relogio obterMs={obterMs} finalMs={concluida ? p.tempoMs : null} />
        <span>{`${p.achadas.length} de ${p.colocacoes.length}`}</span>
      </div>
      <Grade
        tamanho={p.tamanho}
        letras={p.letras}
        marcadas={marcadas}
        desabilitada={concluida}
        onInicioSelecao={() => setAchou(null)}
        onSelecao={aoSelecionar}
      />
      <Etiquetas palavras={palavras} achadas={achadas} onDica={setDica} />
      <p className="partida-dica" aria-live="polite">
        {textoDica}
      </p>
      {achou && (
        <CartaoAchou
          grade={achou}
          ultima={concluida}
          onFechar={() =>
            concluida ? navegar(`/caca-palavras/${p.id}/fim`, { replace: true }) : setAchou(null)
          }
        />
      )}
    </div>
  )
}
