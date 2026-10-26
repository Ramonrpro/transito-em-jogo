import { useMatch } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function AvisoAtualizacao() {
  const emProva = useMatch('/simulado/:id') !== null || useMatch('/caca-palavras/:id') !== null
  const {
    needRefresh: [precisaAtualizar],
    updateServiceWorker,
  } = useRegisterSW()

  // Atualizar recarrega a página: nunca oferecer no meio da prova ou da partida.
  if (!precisaAtualizar || emProva) return null
  return (
    <div className="aviso-atualizacao" role="status">
      <span>Nova versão disponível</span>
      <button type="button" className="botao botao-principal" onClick={() => updateServiceWorker(true)}>
        Atualizar
      </button>
    </div>
  )
}
