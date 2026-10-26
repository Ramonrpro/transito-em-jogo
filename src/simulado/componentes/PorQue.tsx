import type { Questao } from '../../conteudo/tipos.ts'

export default function PorQue({ questao }: { questao: Questao }) {
  return (
    <div className="porque">
      <b>Por quê?</b> {questao.explicacao}
      <div className="porque-lei">📘 {questao.baseLegal}</div>
      {questao.respostaBancoOficial && (
        <div className="porque-aviso">
          ⚠️ Atenção: no banco oficial esta questão aparece com a resposta “
          {questao.respostaBancoOficial}”. Pela lei atual, o correto é a alternativa marcada em verde.
        </div>
      )}
    </div>
  )
}
