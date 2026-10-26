import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import BarraNavegacao from './app/BarraNavegacao'
import Topo from './app/Topo'
import './estilos.css'

const tela = (titulo: string) => <Topo titulo={titulo} />

export default function App() {
  return (
    <HashRouter>
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/simulado" replace />} />
          <Route path="/simulado" element={tela('Simulado')} />
          <Route path="/simulado/:id" element={tela('Simulado')} />
          <Route path="/simulado/:id/resultado" element={tela('Resultado')} />
          <Route path="/simulado/:id/revisao" element={tela('Revisão')} />
          <Route path="/historico" element={tela('Histórico')} />
          <Route path="/ajustes" element={tela('Ajustes')} />
          <Route path="/ajustes/creditos" element={tela('Créditos')} />
        </Routes>
      </main>
      <BarraNavegacao />
    </HashRouter>
  )
}
