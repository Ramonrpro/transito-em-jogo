import { urlPlaca } from '../../conteudo/placasParser.ts'

// No simulado o alt é genérico de propósito: nomear a placa entregaria a resposta.
// Só quem já mostrou a resposta (ex.: o "Achou!" do caça-palavras) passa outro alt.
export default function ImagemPlaca({ codigo, alt = 'Imagem da placa' }: { codigo: string; alt?: string }) {
  return (
    <div className="placa">
      <img src={urlPlaca(codigo)} alt={alt} />
    </div>
  )
}
