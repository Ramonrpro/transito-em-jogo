import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirmar } from '../../app/Confirmar.tsx'
import { pedirPersistencia, useRepositorio } from '../../app/contexto.tsx'
import Topo from '../../app/Topo.tsx'
import { NOMES_AREA } from '../../conteudo/areas.ts'
import { QUESTOES } from '../../conteudo/index.ts'
import type { Area } from '../../conteudo/tipos.ts'
import { criarRng } from '../../util/aleatorio.ts'
import { formatarMinSeg } from '../../util/tempo.ts'
import { useRestante } from '../componentes/Cronometro.tsx'
import { iniciar, retomarOuEncerrar } from '../fluxo.ts'
import type { Modo, Tentativa } from '../tipos.ts'

const AREAS: Area[] = [1, 2, 3, 4]

function CartaoAndamento({ t, onContinuar, onDescartar }: {
  t: Tentativa
  onContinuar: () => void
  onDescartar: () => void
}) {
  const restante = useRestante(t.terminaEm)
  return (
    <div className="cartao cartao-andamento">
      <div className="cartao-titulo">
        {t.modo === 'prova'
          ? `Você tem uma prova em andamento · faltam ${formatarMinSeg(restante ?? 0)}`
          : 'Você tem um treino em andamento'}
      </div>
      <div className="cartao-acoes">
        <button type="button" className="botao botao-principal" onClick={onContinuar}>Continuar</button>
        <button type="button" className="botao botao-secundario" onClick={onDescartar}>Descartar</button>
      </div>
    </div>
  )
}

export default function InicioSimulado() {
  const repo = useRepositorio()
  const confirmar = useConfirmar()
  const navegar = useNavigate()
  const [pronto, setPronto] = useState(false)
  const [emAndamento, setEmAndamento] = useState<Tentativa | undefined>()
  const [erradas, setErradas] = useState(0)
  const [vistas, setVistas] = useState(0)
  const [escolhendoArea, setEscolhendoArea] = useState(false)
  const ocupado = useRef(false)

  const carregar = useCallback(async () => {
    const r = await retomarOuEncerrar(repo, Date.now())
    if (r.encerrada) {
      navegar(`/simulado/${r.encerrada.id}/resultado`, { replace: true })
      return
    }
    setEmAndamento(r.emAndamento)
    setErradas((await repo.listarErradas()).length)
    setVistas((await repo.vistas()).size)
    setPronto(true)
  }, [repo, navegar])

  useEffect(() => {
    void carregar()
  }, [carregar])

  const restante = useRestante(emAndamento?.terminaEm ?? null)
  useEffect(() => {
    if (restante === 0) void carregar()
  }, [restante, carregar])

  const descartarAtual = async (): Promise<boolean> => {
    if (!emAndamento) return true
    const prova = emAndamento.modo === 'prova'
    const ok = await confirmar({
      titulo: prova ? 'Descartar a prova em andamento?' : 'Descartar o treino em andamento?',
      texto: prova ? 'Ela não vai para o histórico.' : 'Ele não vai para o histórico.',
      confirmar: 'Descartar',
    })
    if (!ok) return false
    await repo.descartarTentativa(emAndamento.id)
    setEmAndamento(undefined)
    return true
  }

  const comecar = async (modo: Modo, area: Area | null = null) => {
    if (ocupado.current) return
    ocupado.current = true
    try {
      if (!(await descartarAtual())) return
      pedirPersistencia()
      const t = await iniciar(repo, { modo, area, agora: Date.now(), rng: criarRng(Date.now() >>> 0) })
      navegar(`/simulado/${t.id}`)
    } finally {
      ocupado.current = false
    }
  }

  if (!pronto) return <Topo titulo="Simulado" />

  return (
    <div>
      <Topo titulo="Simulado" />
      <p className="subtitulo">Questões do banco oficial do Detran</p>

      {emAndamento && (
        <CartaoAndamento
          t={emAndamento}
          onContinuar={() => navegar(`/simulado/${emAndamento.id}`)}
          onDescartar={() => void descartarAtual()}
        />
      )}

      {escolhendoArea ? (
        <div className="modos">
          <div className="cartao-titulo">Escolha o assunto</div>
          {AREAS.map((a) => (
            <button key={a} type="button" className="cartao cartao-botao" onClick={() => comecar('assunto', a)}>
              <span className="cartao-titulo">{NOMES_AREA[a]}</span>
            </button>
          ))}
          <button type="button" className="botao botao-secundario" onClick={() => setEscolhendoArea(false)}>
            Voltar
          </button>
        </div>
      ) : (
        <div className="modos">
          <button type="button" className="cartao cartao-botao cartao-destaque" onClick={() => comecar('prova')}>
            <span className="cartao-titulo">🎓 Prova (igual ao Detran)</span>
            <span className="cartao-texto">30 questões · 1 hora · passa com 20 · resultado só no fim</span>
          </button>
          <button type="button" className="cartao cartao-botao" onClick={() => comecar('treino')}>
            <span className="cartao-titulo">📖 Treino</span>
            <span className="cartao-texto">Vê se acertou na hora, com explicação e artigo da lei</span>
          </button>
          <button type="button" className="cartao cartao-botao" onClick={() => setEscolhendoArea(true)}>
            <span className="cartao-titulo">🎯 Por assunto</span>
            <span className="cartao-texto">Só placas, só infrações, só primeiros socorros…</span>
          </button>
          <button
            type="button"
            className="cartao cartao-botao"
            disabled={erradas === 0}
            onClick={() => comecar('erradas')}
          >
            <span className="cartao-titulo">❌ Refazer erradas ({erradas})</span>
            <span className="cartao-texto">Questões do seu caderno de erros</span>
          </button>
        </div>
      )}

      <p className="rodape-banco">Banco: já viu {vistas} de {QUESTOES.length} questões</p>
    </div>
  )
}
