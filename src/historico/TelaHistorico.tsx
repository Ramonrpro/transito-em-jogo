import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRepositorio } from '../app/contexto.tsx'
import Topo from '../app/Topo.tsx'
import { NOMES_AREA } from '../conteudo/areas.ts'
import { duracaoGastaMs } from '../simulado/tentativa.ts'
import type { Tentativa } from '../simulado/tipos.ts'
import { formatarQuando } from '../util/tempo.ts'

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

export default function TelaHistorico() {
  const repo = useRepositorio()
  const navegar = useNavigate()
  const [lista, setLista] = useState<Tentativa[] | null>(null)

  useEffect(() => {
    let vivo = true
    void repo.listarTentativas().then((l) => vivo && setLista(l))
    return () => {
      vivo = false
    }
  }, [repo])

  if (!lista) return <Topo titulo="Histórico" />

  const provas = lista.filter((t) => t.modo === 'prova')
  const aprovados = provas.filter((t) => t.passou === true).length
  const agora = Date.now()

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
      {lista.length === 0 ? (
        <div className="historico-vazio">
          <p>Nenhum simulado ainda.</p>
          <button type="button" className="botao botao-principal" onClick={() => navegar('/simulado')}>
            Fazer a primeira prova
          </button>
        </div>
      ) : (
        <section>
          <h2 className="secao-titulo">Atividades recentes</h2>
          <ul className="atividades">
            {lista.map((t) => {
              const ms = duracaoGastaMs(t)
              const quando = formatarQuando(t.entregueEm ?? t.iniciadaEm, agora)
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
