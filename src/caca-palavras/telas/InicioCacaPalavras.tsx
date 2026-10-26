import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRepositorio } from '../../app/contexto.tsx'
import Topo from '../../app/Topo.tsx'
import { NIVEIS, ORDEM_NIVEIS, TEMAS, nomeTema } from '../regras.ts'
import type { Nivel, Partida, TemaPartida } from '../tipos.ts'
import { useDescartarPartida, useNovaPartida } from '../useNovaPartida.ts'

function CartaoAndamento({ p, onContinuar, onDescartar }: {
  p: Partida
  onContinuar: () => void
  onDescartar: () => void
}) {
  return (
    <div className="cartao cartao-andamento">
      <div className="cartao-titulo">Você tem uma partida em andamento</div>
      <div className="cartao-texto">
        {`${nomeTema(p.tema)} · ${NIVEIS[p.nivel].nome} · ${p.achadas.length} de ${p.colocacoes.length} palavras`}
      </div>
      <div className="cartao-acoes">
        <button type="button" className="botao botao-principal" onClick={onContinuar}>Continuar</button>
        <button type="button" className="botao botao-secundario" onClick={onDescartar}>Descartar</button>
      </div>
    </div>
  )
}

export default function InicioCacaPalavras() {
  const repo = useRepositorio()
  const navegar = useNavigate()
  const novaPartida = useNovaPartida()
  const descartar = useDescartarPartida()
  const [pronto, setPronto] = useState(false)
  const [emAndamento, setEmAndamento] = useState<Partida | undefined>()
  const [tema, setTema] = useState<TemaPartida>('placas')
  const [nivel, setNivel] = useState<Nivel>('facil')

  useEffect(() => {
    let vivo = true
    void repo.partidaEmAndamento().then((p) => {
      if (!vivo) return
      setEmAndamento(p)
      setPronto(true)
    })
    return () => {
      vivo = false
    }
  }, [repo])

  if (!pronto) return <Topo titulo="Caça-palavras" />

  return (
    <div>
      <Topo titulo="Caça-palavras" />
      <p className="subtitulo">Ache as palavras de trânsito escondidas na grade.</p>

      {emAndamento && (
        <CartaoAndamento
          p={emAndamento}
          onContinuar={() => navegar(`/caca-palavras/${emAndamento.id}`)}
          onDescartar={() => void descartar(emAndamento).then((ok) => ok && setEmAndamento(undefined))}
        />
      )}

      <section>
        <h2 className="secao-titulo">Escolha um tema</h2>
        <div className="temas">
          {TEMAS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="opcao"
              aria-pressed={tema === t.id}
              onClick={() => setTema(t.id)}
            >
              <span aria-hidden="true">{t.icone}</span> {t.nome}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="secao-titulo">Nível</h2>
        <div className="niveis">
          {ORDEM_NIVEIS.map((n) => (
            <button
              key={n}
              type="button"
              className="opcao opcao-nivel"
              aria-pressed={nivel === n}
              onClick={() => setNivel(n)}
            >
              <span className="cartao-titulo">{NIVEIS[n].nome}</span>
              <span className="cartao-texto">{NIVEIS[n].descricao}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="rodape-acoes">
        <button type="button" className="botao botao-principal" onClick={() => void novaPartida(tema, nivel)}>
          Começar
        </button>
      </div>
    </div>
  )
}
