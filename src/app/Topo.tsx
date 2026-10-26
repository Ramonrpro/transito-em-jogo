import { Link } from 'react-router-dom'

export default function Topo({ titulo }: { titulo: string }) {
  return (
    <header className="topo">
      <h1>{titulo}</h1>
      <Link to="/ajustes" aria-label="Ajustes" className="topo-engrenagem">
        ⚙️
      </Link>
    </header>
  )
}
