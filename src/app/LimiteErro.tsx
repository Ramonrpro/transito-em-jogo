import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Estado {
  erro: boolean
}

/** Última rede de segurança: erro de renderização ou promessa rejeitada sem tratamento. */
export default class LimiteErro extends Component<{ children: ReactNode }, Estado> {
  state: Estado = { erro: false }

  static getDerivedStateFromError(): Estado {
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

  aoRejeitar = () => {
    this.setState({ erro: true })
  }

  render() {
    if (!this.state.erro) return this.props.children
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
