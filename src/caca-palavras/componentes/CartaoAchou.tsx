import { PALAVRAS_POR_GRADE, PLACAS_POR_CODIGO } from '../../conteudo/index.ts'
import ImagemPlaca from '../../simulado/componentes/ImagemPlaca.tsx'

export default function CartaoAchou({
  grade,
  ultima,
  onFechar,
}: {
  grade: string
  ultima: boolean
  onFechar(): void
}) {
  const palavra = PALAVRAS_POR_GRADE.get(grade)
  const placa = palavra?.placa ? PLACAS_POR_CODIGO.get(palavra.placa) : undefined
  return (
    <section className="cartao cartao-achou" aria-live="polite">
      <div className="cartao-achou-topo">
        {placa && <ImagemPlaca codigo={placa.codigo} alt={`Placa ${placa.codigo}: ${placa.nome}`} />}
        <div>
          <h2>Achou!</h2>
          <p className="cartao-achou-palavra">{palavra?.palavra ?? grade}</p>
          {placa && (
            <p className="cartao-achou-placa">
              Placa {placa.codigo} · {placa.nome}
            </p>
          )}
        </div>
      </div>
      {palavra && (
        <>
          <p className="cartao-texto">{palavra.significado}</p>
          <p className="cartao-achou-fonte">Fonte: {palavra.base}</p>
        </>
      )}
      <button type="button" className="botao botao-principal" onClick={onFechar}>
        {ultima ? 'Ver resultado' : 'Continuar'}
      </button>
    </section>
  )
}
