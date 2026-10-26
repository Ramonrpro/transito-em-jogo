import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRepositorio } from '../app/contexto.tsx'
import Topo from '../app/Topo.tsx'
import { NIVEIS, nomeTema } from '../caca-palavras/regras.ts'
import type { Partida } from '../caca-palavras/tipos.ts'
import { NOMES_AREA } from '../conteudo/areas.ts'
import { duracaoGastaMs } from '../simulado/tentativa.ts'
import type { Tentativa } from '../simulado/tipos.ts'
import { formatarMinSeg, formatarQuando } from '../util/tempo.ts'

function rotulo(t: Tentativa): string {
  const placar = `${t.acertos ?? 0}/${t.itens.length}`
  switch (t.modo) {
    case 'prova':
      return `📝 Prova · ${placar} ${t.passou ? '✔' : '✘'}`
    case 'assunto':
      return `🎯 ${t.area ? NOMES_AREA[t.area] : 'Assunto'} · ${placar}`
    case 'erradas':
      return `❌ Erradas · ${placar}`
    default:
      return `📖 Treino · ${placar}`
  }
}

type Atividade =
  | { tipo: 'simulado'; t: Tentativa; em: number }
  | { tipo: 'partida'; p: Partida; em: number }

export default function TelaHistorico() {
  const repo = useRepositorio()
  const navegar = useNavigate()
  const [lista, setLista] = useState<Tentativa[] | null>(null)
  const [partidas, setPartidas] = useState<Partida[]>([])

  useEffect(() => {
    let vivo = true
    void Promise.all([repo.listarTentativas(), repo.listarPartidas()]).then(([l, ps]) => {
      if (!vivo) return
      setPartidas(ps)
      setLista(l)
    })
    return () => {
      vivo = false
    }
  }, [repo])

  if (!lista) return <Topo titulo="Histórico" />

  const provas = lista.filter((t) => t.modo === 'prova')
  const aprovados = provas.filter((t) => t.passou === true).length
  const agora = Date.now()
  const atividades: Atividade[] = [
    ...lista.map((t): Atividade => ({ tipo: 'simulado', t, em: t.entregueEm ?? t.iniciadaEm })),
    ...partidas.flatMap((p): Atividade[] => (p.terminadaEm === null ? [] : [{ tipo: 'partida', p, em: p.terminadaEm }])),
  ].sort((a, b) => b.em - a.em)

  return (
    <>
      <Topo titulo="Histórico" />
      <div className="resumo-caixas">
        <div className="resumo-caixa">
          <strong>{provas.length}</strong>
          <span>simulados</span>
        </div>
        <div className="resumo-caixa">
          <strong>{aprovados}</strong>
          <span>aprovados</span>
        </div>
      </div>
      {atividades.length === 0 ? (
        <div className="historico-vazio">
          <p>Nenhuma atividade ainda.</p>
          <button type="button" className="botao botao-principal" onClick={() => navegar('/simulado')}>
            Fazer a primeira prova
          </button>
        </div>
      ) : (
        <section>
          <h2 className="secao-titulo">Atividades recentes</h2>
          <ul className="atividades">
            {atividades.map((a) => {
              const quando = formatarQuando(a.em, agora)
              if (a.tipo === 'partida') {
                const { p } = a
                return (
                  <li key={p.id} data-testid="atividade">
                    <Link to={`/caca-palavras/${p.id}/fim`} className="atividade">
                      <span>{`🔤 Caça-palavras · ${nomeTema(p.tema)} · ${NIVEIS[p.nivel].nome}`}</span>
                      <span className="atividade-quando">{`${quando}, ${formatarMinSeg(p.tempoMs)}`}</span>
                    </Link>
                  </li>
                )
              }
              const { t } = a
              const ms = duracaoGastaMs(t)
              return (
                <li key={t.id} data-testid="atividade">
                  <Link to={`/simulado/${t.id}/resultado`} className="atividade">
                    <span>{rotulo(t)}</span>
                    <span className="atividade-quando">
                      {quando}
                      {ms === null ? '' : `, ${Math.max(1, Math.round(ms / 60_000))} min`}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
