import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useConfirmar } from '../../app/Confirmar.tsx'
import { useRepositorio } from '../../app/contexto.tsx'
import Topo from '../../app/Topo.tsx'
import { NOMES_AREA } from '../../conteudo/areas.ts'
import { QUESTOES_POR_ID } from '../../conteudo/index.ts'
import type { Area } from '../../conteudo/tipos.ts'
import { criarRng } from '../../util/aleatorio.ts'
import { formatarMinSeg } from '../../util/tempo.ts'
import { iniciar, TentativaEmAndamentoError } from '../fluxo.ts'
import { PROVA } from '../regras.ts'
import { acertou, duracaoGastaMs } from '../tentativa.ts'
import type { Modo, Tentativa } from '../tipos.ts'

const AREAS: Area[] = [1, 2, 3, 4]

function rotuloModo(t: Tentativa): string {
  switch (t.modo) {
    case 'assunto':
      return `Por assunto: ${t.area ? NOMES_AREA[t.area] : ''}`
    case 'erradas':
      return 'Refazer erradas'
    default:
      return 'Treino'
  }
}

/** Área com a menor proporção de acertos abaixo de 1; empate: a menor área. */
function pontoFraco(t: Tentativa): Area | undefined {
  let pior: Area | undefined
  let piorProporcao = 1
  for (const a of AREAS) {
    const r = t.porArea?.[a]
    if (!r || r.total === 0) continue
    const proporcao = r.acertos / r.total
    if (proporcao < piorProporcao) {
      pior = a
      piorProporcao = proporcao
    }
  }
  return pior
}

export default function Resultado() {
  const { id } = useParams()
  const repo = useRepositorio()
  const confirmar = useConfirmar()
  const navegar = useNavigate()
  const [t, setT] = useState<Tentativa | null | undefined>(undefined)
  const ocupado = useRef(false)

  useEffect(() => {
    let vivo = true
    void repo.obterTentativa(id ?? '').then((x) => vivo && setT(x ?? null))
    return () => {
      vivo = false
    }
  }, [repo, id])

  if (t === undefined) return <div className="resultado"><Topo titulo="Resultado" /></div>
  if (t === null) {
    return (
      <div className="resultado">
        <Topo titulo="Resultado" />
        <p className="subtitulo">Tentativa não encontrada.</p>
        <Link className="botao botao-principal" to="/simulado">Voltar ao Simulado</Link>
      </div>
    )
  }
  if (t.entregueEm === null) {
    return <Navigate to={`/simulado/${t.id}`} replace />
  }

  const prova = t.modo === 'prova'
  const total = t.itens.length
  const acertos = t.acertos ?? 0
  const gasto = formatarMinSeg(duracaoGastaMs(t) ?? 0)
  const fraco = pontoFraco(t)
  const qidsErradas = t.itens
    .filter((it) => QUESTOES_POR_ID.has(it.qid) && !acertou(it, QUESTOES_POR_ID.get(it.qid)))
    .map((it) => it.qid)

  const comecar = async (modo: Modo, area: Area | null, qids?: string[]) => {
    if (ocupado.current) return
    ocupado.current = true
    try {
      const opcoes = { modo, area, qids, agora: Date.now(), rng: criarRng(Date.now() >>> 0) }
      let nova: Tentativa
      try {
        nova = await iniciar(repo, opcoes)
      } catch (e) {
        if (!(e instanceof TentativaEmAndamentoError)) throw e
        const atual = await repo.tentativaEmAndamento()
        if (!atual) return
        const ehProva = atual.modo === 'prova'
        const ok = await confirmar({
          titulo: ehProva ? 'Descartar a prova em andamento?' : 'Descartar o treino em andamento?',
          texto: ehProva ? 'Ela não vai para o histórico.' : 'Ele não vai para o histórico.',
          confirmar: 'Descartar',
        })
        if (!ok) return
        await repo.descartarTentativa(atual.id)
        nova = await iniciar(repo, { ...opcoes, agora: Date.now() })
      }
      navegar(`/simulado/${nova.id}`)
    } finally {
      ocupado.current = false
    }
  }

  return (
    <div className="resultado">
      <Topo titulo="Resultado" />
      <div className="nota" data-testid="nota">{acertos}/{total}</div>
      {prova ? (
        <>
          <div className={`selo ${t.passou ? 'selo-passou' : 'selo-reprovou'}`}>
            {t.passou ? 'PASSOU ✔' : 'NÃO PASSOU'}
          </div>
          <p className="subtitulo">
            {`mínimo ${PROVA.minimoAprovacao} · tempo ${gasto} de ${formatarMinSeg(PROVA.duracaoMs)}${
              t.autoEntregue ? ' · entregue automaticamente' : ''
            }`}
          </p>
        </>
      ) : (
        <p className="subtitulo">{`${rotuloModo(t)} · tempo ${gasto}`}</p>
      )}

      {(
        <div className="barras-area">
          {AREAS.map((a) => {
            const r = t.porArea?.[a]
            if (!r || r.total === 0) return null
            const bom = r.acertos / r.total >= 2 / 3
            return (
              <div key={a} className="barra-area">
                <span className="barra-area-nome">{NOMES_AREA[a]}</span>
                <div className="barra-area-trilho" aria-hidden="true">
                  <div
                    className={bom ? 'barra-bom' : 'barra-ruim'}
                    style={{ width: `${(r.acertos / r.total) * 100}%` }}
                  />
                </div>
                <span className="barra-area-valor">{r.acertos}/{r.total}</span>
              </div>
            )
          })}
        </div>
      )}

      {fraco && (
        <div className="cartao ponto-fraco">
          <div className="cartao-texto">
            {`💡 Ponto fraco: ${NOMES_AREA[fraco]}. Que tal um treino só disso?`}
          </div>
          <button type="button" className="botao botao-principal" onClick={() => comecar('assunto', fraco)}>
            {`Treinar ${NOMES_AREA[fraco]}`}
          </button>
        </div>
      )}

      <div className="rodape-acoes rodape-resultado">
        <Link className="botao botao-principal botao-link" to={`/simulado/${t.id}/revisao`}>
          Revisar as {total} questões
        </Link>
        {qidsErradas.length > 0 && (
          <button type="button" className="botao" onClick={() => comecar('erradas', null, qidsErradas)}>
            Refazer só as {qidsErradas.length} erradas
          </button>
        )}
      </div>
    </div>
  )
}
