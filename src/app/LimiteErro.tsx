import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Estado {
  erro: boolean
  aviso: boolean
}

/** Última rede de segurança: erro de renderização ou promessa rejeitada sem tratamento. */
export default class LimiteErro extends Component<{ children: ReactNode }, Estado> {
  state: Estado = { erro: false, aviso: false }

  static getDerivedStateFromError(): Partial<Estado> {
    return { erro: true }
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.aoRejeitar)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.aoRejeitar)
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error(erro, info.componentStack)
  }

  // Evento global (extensões, service worker...): não derruba o app, só avisa.
  aoRejeitar = (e: Event) => {
    console.error((e as PromiseRejectionEvent).reason)
    this.setState({ aviso: true })
  }

  render() {
    if (!this.state.erro) {
      return (
        <>
          {this.props.children}
          {this.state.aviso && (
            <div className="aviso-rejeicao" role="alert">
              <span>Algo não saiu como esperado. Se o app parar de responder, recarregue.</span>
              <button type="button" className="botao" onClick={() => location.reload()}>
                Recarregar
              </button>
              <button type="button" className="botao" onClick={() => this.setState({ aviso: false })}>
                Fechar
              </button>
            </div>
          )}
        </>
      )
    }
    return (
      <div className="limite-erro" role="alert">
        <p>Algo deu errado. Suas respostas já salvas não se perdem.</p>
        <button type="button" className="botao botao-principal" onClick={() => location.reload()}>
          Recarregar
        </button>
      </div>
    )
  }
}
