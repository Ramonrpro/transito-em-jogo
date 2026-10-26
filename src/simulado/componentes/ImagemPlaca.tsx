import { urlPlaca } from '../../conteudo/placasParser.ts'

// O alt é genérico de propósito: nomear a placa entregaria a resposta.
export default function ImagemPlaca({ codigo }: { codigo: string }) {
  return (
    <div className="placa">
      <img src={urlPlaca(codigo)} alt="Imagem da placa" />
    </div>
  )
}
