import Topo from '../app/Topo'
import { CREDITOS, PLACAS_POR_CODIGO } from '../conteudo/index.ts'

const FONTES = [
  'Código de Trânsito Brasileiro (Lei 9.503/1997, texto consolidado)',
  'Resolução Contran nº 1.020/2025',
  'Banco Nacional de Questões v1.0 (Senatran, dez/2025)',
  'Manual Brasileiro de Sinalização de Trânsito (Resolução Contran nº 973/2022)',
]

export default function TelaCreditos() {
  return (
    <>
      <Topo titulo="Créditos" />
      <section>
        <h2 className="secao-titulo">Fontes do conteúdo</h2>
        <ul className="creditos">
          {FONTES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="secao-titulo">Imagens das placas — Wikimedia Commons</h2>
        <ul className="creditos">
          {CREDITOS.map((c) => (
            <li key={c.codigo} data-testid="credito">
              <strong>
                {c.codigo} {PLACAS_POR_CODIGO.get(c.codigo)?.nome ?? ''}
              </strong>
              <span>
                {c.autor} ·{' '}
                {c.urlLicenca ? (
                  <a href={c.urlLicenca} target="_blank" rel="noreferrer">
                    {c.licenca}
                  </a>
                ) : (
                  c.licenca
                )}{' '}
                ·{' '}
                <a href={c.urlPagina} target="_blank" rel="noreferrer">
                  ver no Commons
                </a>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
