import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import BarraNavegacao from './app/BarraNavegacao'
import { ProvedorConfirmar } from './app/Confirmar'
import { ProvedorDados } from './app/contexto'
import Topo from './app/Topo'
import InicioSimulado from './simulado/telas/InicioSimulado'
import Resultado from './simulado/telas/Resultado'
import Revisao from './simulado/telas/Revisao'
import TelaQuestao from './simulado/telas/TelaQuestao'
import './estilos.css'

const tela = (titulo: string) => <Topo titulo={titulo} />

export function Rotas() {
  return (
    <>
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/simulado" replace />} />
          <Route path="/simulado" element={<InicioSimulado />} />
          <Route path="/simulado/:id" element={<TelaQuestao />} />
          <Route path="/simulado/:id/resultado" element={<Resultado />} />
          <Route path="/simulado/:id/revisao" element={<Revisao />} />
          <Route path="/historico" element={tela('Histórico')} />
          <Route path="/ajustes" element={tela('Ajustes')} />
          <Route path="/ajustes/creditos" element={tela('Créditos')} />
        </Routes>
      </main>
      <BarraNavegacao />
    </>
  )
}

export default function App() {
  return (
    <ProvedorDados>
      <ProvedorConfirmar>
        <HashRouter>
          <Rotas />
        </HashRouter>
      </ProvedorConfirmar>
    </ProvedorDados>
  )
}
