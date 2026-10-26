import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useConfirmar } from '../../app/Confirmar.tsx'
import { useRepositorio } from '../../app/contexto.tsx'
import { QUESTOES_POR_ID } from '../../conteudo/index.ts'
import Cronometro from '../componentes/Cronometro.tsx'
import ImagemPlaca from '../componentes/ImagemPlaca.tsx'
import MapaQuestoes from '../componentes/MapaQuestoes.tsx'
import PorQue from '../componentes/PorQue.tsx'
import {
  alternarRevisarEPersistir,
  entregarEPersistir,
  irParaEPersistir,
  responderEPersistir,
} from '../fluxo.ts'
import type { Tentativa } from '../tipos.ts'

const LETRAS = ['A', 'B', 'C', 'D']

export default function TelaQuestao() {
  const { id = '' } = useParams()
  const repo = useRepositorio()
  const confirmar = useConfirmar()
  const navegar = useNavigate()
  const [t, setT] = useState<Tentativa | null>(null)
  const [mapaAberto, setMapaAberto] = useState(false)
  const ocupado = useRef(false)
  const atual = useRef<Tentativa | null>(null)
  const encerrando = useRef(false)
  atual.current = t

  useEffect(() => {
    let cancelado = false
    repo.obterTentativa(id).then((r) => {
      if (cancelado) return
      if (r) setT(r)
      else navegar('/simulado', { replace: true })
    })
    return () => {
      cancelado = true
    }
  }, [repo, id, navegar])

  // Executa uma ação por vez: toques repetidos não duplicam registros.
  const exclusivo = useCallback(async (acao: () => Promise<void>) => {
    if (ocupado.current || encerrando.current) return
    ocupado.current = true
    try {
      await acao()
    } finally {
      ocupado.current = false
    }
  }, [])

  const entregarAgora = useCallback(
    async (auto: boolean) => {
      const base = atual.current
      if (!base || encerrando.current) return
      encerrando.current = true
      await entregarEPersistir(repo, base, Date.now(), auto)
      navegar(`/simulado/${base.id}/resultado`, { replace: true })
    },
    [repo, navegar],
  )

  if (!t) return null
  if (t.entregueEm !== null) return <Navigate to={`/simulado/${t.id}/resultado`} replace />

  const prova = t.modo === 'prova'
  const total = t.itens.length
  const item = t.itens[t.atual]
  const questao = QUESTOES_POR_ID.get(item.qid)
  if (!questao) return null
  const respondida = item.resposta !== null
  const revelar = !prova && respondida
  const ultima = t.atual === total - 1

  const pedirEntrega = async () => {
    const faltam = t.itens.filter((i) => i.resposta === null).length
    const ok = await confirmar({
      titulo: 'Entregar a prova?',
      texto:
        faltam > 0
          ? `Você deixou ${faltam} ${faltam === 1 ? 'questão' : 'questões'} sem resposta.`
          : undefined,
      confirmar: 'Entregar',
    })
    if (ok) await exclusivo(() => entregarAgora(false))
  }

  const aplicar = (acao: (base: Tentativa) => Promise<Tentativa>) =>
    exclusivo(async () => {
      const nova = await acao(atual.current ?? t)
      atual.current = nova
      setT(nova)
    })

  const ir = (indice: number) => aplicar((b) => irParaEPersistir(repo, b, indice, Date.now()))

  const marcar = (i: number) => aplicar((b) => responderEPersistir(repo, b, i, Date.now()))

  const estadoDe = (i: number) => {
    if (!revelar) return undefined
    const original = item.ordem[i]
    if (original === questao.correta) return 'correta'
    if (original === item.resposta) return 'errada'
    return undefined
  }

  return (
    <div className="questao">
      <header className="questao-topo">
        {prova ? (
          <button type="button" className="questao-numero" onClick={() => setMapaAberto(true)}>
            Questão {t.atual + 1} de {total}
          </button>
        ) : (
          <span className="questao-numero">Questão {t.atual + 1} de {total}</span>
        )}
        {prova && t.terminaEm !== null && (
          <Cronometro terminaEm={t.terminaEm} onZerou={() => void entregarAgora(true)} />
        )}
      </header>
      <div
        className="progresso"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={t.atual + 1}
      >
        <div style={{ width: `${((t.atual + 1) / total) * 100}%` }} />
      </div>

      {mapaAberto && prova ? (
        <MapaQuestoes
          tentativa={t}
          onIr={async (i) => {
            await ir(i)
            setMapaAberto(false)
          }}
          onEntregar={pedirEntrega}
          onFechar={() => setMapaAberto(false)}
        />
      ) : (
        <>
          {questao.placa && <ImagemPlaca codigo={questao.placa} />}
          <p className="enunciado">{questao.enunciado}</p>
          <div className="alternativas">
            {item.ordem.map((original, i) => (
              <button
                key={original}
                type="button"
                className="alternativa"
                aria-pressed={item.resposta === original}
                data-estado={estadoDe(i)}
                disabled={!prova && respondida}
                onClick={() => marcar(i)}
              >
                <b>{LETRAS[i]}</b>
                <span>{questao.alternativas[original]}</span>
              </button>
            ))}
          </div>
          {revelar && <PorQue questao={questao} />}

          <div className="rodape-acoes">
            {prova ? (
              <>
                <button
                  type="button"
                  className="botao botao-secundario"
                  aria-label="Questão anterior"
                  disabled={t.atual === 0}
                  onClick={() => ir(t.atual - 1)}
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="botao botao-secundario botao-largo"
                  onClick={() => aplicar((b) => alternarRevisarEPersistir(repo, b, Date.now()))}
                >
                  {item.revisar ? '★ Marcada para revisar' : '☆ Revisar depois'}
                </button>
                {ultima ? (
                  <button type="button" className="botao botao-principal" onClick={pedirEntrega}>
                    Entregar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="botao botao-principal"
                    aria-label="Próxima questão"
                    onClick={() => ir(t.atual + 1)}
                  >
                    ▶
                  </button>
                )}
              </>
            ) : (
              revelar && (
                <button
                  type="button"
                  className="botao botao-principal botao-largo"
                  onClick={() => (ultima ? exclusivo(() => entregarAgora(false)) : ir(t.atual + 1))}
                >
                  {ultima ? 'Ver resultado' : 'Próxima'}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
