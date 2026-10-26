import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'
import {
  deveMostrarConvite,
  detectarPlataforma,
  estaInstalado,
  gravarDispensado,
  lerDispensadoEm,
  type Plataforma,
} from './instalacao'

interface EventoInstalacao extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const ATRASO_MS = 1500

export default function ConviteInstalar() {
  // Os dois useMatch sempre rodam (regra dos hooks), sem curto-circuito.
  const naProva = useMatch('/simulado/:id') !== null
  const naPartida = useMatch('/caca-palavras/:id') !== null
  const emProva = naProva || naPartida
  const [prompt, setPrompt] = useState<EventoInstalacao | null>(null)
  const [plataforma] = useState<Plataforma>(() => detectarPlataforma(navigator.userAgent, navigator.maxTouchPoints))
  const [passouAtraso, setPassouAtraso] = useState(false)
  const [dispensado, setDispensado] = useState(false)

  useEffect(() => {
    const aoPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e as EventoInstalacao)
    }
    const aoInstalar = () => setDispensado(true)
    window.addEventListener('beforeinstallprompt', aoPrompt)
    window.addEventListener('appinstalled', aoInstalar)
    const t = setTimeout(() => setPassouAtraso(true), ATRASO_MS)
    return () => {
      window.removeEventListener('beforeinstallprompt', aoPrompt)
      window.removeEventListener('appinstalled', aoInstalar)
      clearTimeout(t)
    }
  }, [])

  const visivel =
    passouAtraso &&
    !dispensado &&
    !emProva &&
    deveMostrarConvite({
      instalado: estaInstalado(),
      dispensadoEm: lerDispensadoEm(),
      agora: Date.now(),
      temPromptNativo: prompt !== null,
      plataforma,
    })

  if (!visivel) return null

  const dispensar = () => {
    gravarDispensado(Date.now())
    setDispensado(true)
  }
  const instalar = async () => {
    if (!prompt) return
    await prompt.prompt()
    await prompt.userChoice.catch(() => undefined)
    setPrompt(null)
    dispensar()
  }

  const ios = plataforma === 'ios-safari'
  return (
    <div className="convite" role="dialog" aria-labelledby="convite-titulo">
      <h2 id="convite-titulo">Instale o app</h2>
      <p>Abre direto da tela inicial e funciona sem internet.</p>
      {ios && (
        <p className="convite-ios">
          No iPhone: toque em Compartilhar ⬆︎ e depois em “Adicionar à Tela de Início”.
        </p>
      )}
      <div className="convite-botoes">
        {ios ? (
          <button type="button" className="botao botao-principal" onClick={dispensar}>
            Entendi
          </button>
        ) : (
          <>
            <button type="button" className="botao botao-principal" onClick={instalar}>
              Instalar
            </button>
            <button type="button" className="botao" onClick={dispensar}>
              Agora não
            </button>
          </>
        )}
      </div>
    </div>
  )
}
