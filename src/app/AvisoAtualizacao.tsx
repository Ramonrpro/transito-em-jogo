import { useRegisterSW } from 'virtual:pwa-register/react'

export default function AvisoAtualizacao() {
  const {
    needRefresh: [precisaAtualizar],
    updateServiceWorker,
  } = useRegisterSW()

  if (!precisaAtualizar) return null
  return (
    <div className="aviso-atualizacao" role="status">
      <span>Nova versão disponível</span>
      <button type="button" className="botao botao-principal" onClick={() => updateServiceWorker(true)}>
        Atualizar
      </button>
    </div>
  )
}
