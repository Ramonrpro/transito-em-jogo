import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useRepositorio } from '../../app/contexto.tsx'
import Topo from '../../app/Topo.tsx'
import { QUESTOES_POR_ID } from '../../conteudo/index.ts'
import ImagemPlaca from '../componentes/ImagemPlaca.tsx'
import PorQue from '../componentes/PorQue.tsx'
import type { Tentativa } from '../tipos.ts'

const LETRAS = ['A', 'B', 'C', 'D']

function rotuloMarca(correta: boolean, marcada: boolean): string | null {
  if (correta) return marcada ? 'Sua resposta · Correta' : 'Correta'
  return marcada ? 'Sua resposta' : null
}

export default function Revisao() {
  const { id } = useParams()
  const repo = useRepositorio()
  const [t, setT] = useState<Tentativa | null | undefined>(undefined)

  useEffect(() => {
    let vivo = true
    void repo.obterTentativa(id ?? '').then((x) => vivo && setT(x ?? null))
    return () => {
      vivo = false
    }
  }, [repo, id])

  if (t === undefined) return <div className="revisao"><Topo titulo="Revisão" /></div>
  if (t === null) {
    return (
      <div className="revisao">
        <Topo titulo="Revisão" />
        <p className="subtitulo">Tentativa não encontrada.</p>
      </div>
    )
  }

  if (t.entregueEm === null) return <Navigate to={`/simulado/${t.id}`} replace />

  return (
    <div className="revisao">
      <Topo titulo="Revisão" />
      <Link className="botao botao-link" to={`/simulado/${t.id}/resultado`}>← Voltar ao resultado</Link>
      {t.itens.map((item, n) => {
        const q = QUESTOES_POR_ID.get(item.qid)
        return (
          <section key={`${item.qid}-${n}`} className="questao-revisao" data-testid="questao-revisao">
            <div className="questao-topo"><span>Questão {n + 1} de {t.itens.length}</span></div>
            {!q ? (
              <div className="cartao">Esta questão foi removida do banco depois da sua prova.</div>
            ) : (
              <>
                {item.versao !== undefined && item.versao !== q.versao && (
                  <p className="aviso-versao" role="note">Esta questão foi atualizada depois da sua prova.</p>
                )}
                {q.placa && <ImagemPlaca codigo={q.placa} />}
                <p className="enunciado">{q.enunciado}</p>
                {item.resposta === null && <div className="sem-resposta">Sem resposta</div>}
                <div className="alternativas">
                  {item.ordem.map((original, i) => {
                    const correta = original === q.correta
                    const marcada = item.resposta === original
                    return (
                      <div
                        key={original}
                        className="alternativa"
                        data-testid="alternativa"
                        data-estado={
                          correta ? (marcada ? 'correta-marcada' : 'correta') : marcada ? 'errada' : undefined
                        }
                      >
                        <b>{LETRAS[i]}</b>
                        <span>{q.alternativas[original]}</span>
                        {rotuloMarca(correta, marcada) && <em className="marca">{rotuloMarca(correta, marcada)}</em>}
                      </div>
                    )
                  })}
                </div>
                <PorQue questao={q} />
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}
