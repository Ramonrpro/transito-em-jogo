import type { Tentativa } from '../tipos.ts'

interface Props {
  tentativa: Tentativa
  onIr: (indice: number) => void
  onEntregar: () => void
  onFechar: () => void
}

export default function MapaQuestoes({ tentativa, onIr, onEntregar, onFechar }: Props) {
  return (
    <section className="mapa" aria-label="Mapa das questões">
      <h2>Mapa das questões</h2>
      <div className="mapa-grade">
        {tentativa.itens.map((item, i) => {
          const estado =
            i === tentativa.atual ? 'atual' : item.revisar ? 'marcada' : item.resposta !== null ? 'respondida' : 'vazia'
          return (
            <button
              key={item.qid}
              type="button"
              className="mapa-numero"
              data-estado={estado}
              data-respondida={item.resposta !== null}
              aria-label={`Ir para a questão ${i + 1}${item.revisar ? ' (marcada para revisar)' : ''}`}
              onClick={() => onIr(i)}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <p className="mapa-legenda">Escuro: respondida · amarelo: marcada · contorno: atual</p>
      <div className="rodape-acoes">
        <button type="button" className="botao botao-secundario" onClick={onFechar}>
          Voltar à questão
        </button>
        <button type="button" className="botao botao-principal" onClick={onEntregar}>
          Entregar prova
        </button>
      </div>
    </section>
  )
}
