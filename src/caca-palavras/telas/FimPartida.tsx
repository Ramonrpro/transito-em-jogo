import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useRepositorio } from '../../app/contexto.tsx'
import Topo from '../../app/Topo.tsx'
import { PALAVRAS_POR_GRADE, PLACAS_POR_CODIGO } from '../../conteudo/index.ts'
import ImagemPlaca from '../../simulado/componentes/ImagemPlaca.tsx'
import { formatarMinSeg } from '../../util/tempo.ts'
import { resumoRecorde } from '../partida.ts'
import { NIVEIS, nomeTema } from '../regras.ts'
import type { Partida } from '../tipos.ts'
import { useNovaPartida } from '../useNovaPartida.ts'

type Dados = { p: Partida; recorde: ReturnType<typeof resumoRecorde> }

export default function FimPartida() {
  const { id = '' } = useParams()
  const repo = useRepositorio()
  const navegar = useNavigate()
  const novaPartida = useNovaPartida()
  const [dados, setDados] = useState<Dados | null | undefined>(undefined)

  useEffect(() => {
    let vivo = true
    void (async () => {
      const p = await repo.obterPartida(id)
      if (!vivo) return
      if (!p) return setDados(null)
      const todas = await repo.listarPartidas()
      if (vivo) setDados({ p, recorde: resumoRecorde(p, todas) })
    })()
    return () => {
      vivo = false
    }
  }, [repo, id])

  if (dados === undefined) return null
  if (dados === null) {
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
  const { p, recorde } = dados
  if (p.terminadaEm === null) return <Navigate to={`/caca-palavras/${id}`} replace />

  const frase = recorde.primeira
    ? 'Primeira partida neste tema e nível.'
    : recorde.novoRecorde
      ? '🏆 Novo recorde neste tema e nível!'
      : `Seu melhor tempo neste tema e nível: ${formatarMinSeg(recorde.melhorMs)}`

  return (
    <div className="fim">
      <Topo titulo="Caça-palavras" />
      <h2 className="fim-titulo">🏁 Achou todas!</h2>
      <p className="fim-linha">{`${nomeTema(p.tema)} · ${NIVEIS[p.nivel].nome} · ${formatarMinSeg(p.tempoMs)}`}</p>
      <p className="fim-recorde">{frase}</p>

      <section>
        <h2 className="secao-titulo">O que você aprendeu</h2>
        <ul className="aprendeu">
          {p.achadas.map((grade) => {
            const info = PALAVRAS_POR_GRADE.get(grade)
            const placa = info?.placa ? PLACAS_POR_CODIGO.get(info.placa) : undefined
            return (
              <li key={grade} className="aprendeu-linha">
                {placa && <ImagemPlaca codigo={placa.codigo} alt={`Placa ${placa.codigo}: ${placa.nome}`} />}
                <div>
                  <div className="cartao-titulo">{info?.palavra ?? grade}</div>
                  {placa && <div className="cartao-texto">Placa {placa.codigo}</div>}
                  {info && <div className="cartao-texto">{info.dica}</div>}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="rodape-acoes rodape-resultado">
        <button type="button" className="botao botao-principal" onClick={() => void novaPartida(p.tema, p.nivel)}>
          Jogar de novo
        </button>
        <button type="button" className="botao" onClick={() => navegar('/caca-palavras')}>
          Escolher outro tema
        </button>
      </div>
    </div>
  )
}
