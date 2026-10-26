import { NavLink } from 'react-router-dom'

export const ABAS: ReadonlyArray<{ rota: string; rotulo: string; icone: string }> = [
  { rota: '/caca-palavras', rotulo: 'Caça-palavras', icone: '🔤' },
  { rota: '/simulado', rotulo: 'Simulado', icone: '📝' },
  { rota: '/historico', rotulo: 'Histórico', icone: '📊' },
]

export default function BarraNavegacao() {
  return (
    <nav className="barra-navegacao" aria-label="Navegação principal">
      {ABAS.map((aba) => (
        <NavLink
          key={aba.rota}
          to={aba.rota}
          className={({ isActive }) => (isActive ? 'aba aba-ativa' : 'aba')}
        >
          <span className="aba-icone" aria-hidden="true">
            {aba.icone}
          </span>
          <span>{aba.rotulo}</span>
        </NavLink>
      ))}
    </nav>
  )
}
