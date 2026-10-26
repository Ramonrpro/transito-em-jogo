import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import AvisoAtualizacao from './app/AvisoAtualizacao'
import BarraNavegacao from './app/BarraNavegacao'
import ConviteInstalar from './app/ConviteInstalar'
import { ProvedorConfirmar } from './app/Confirmar'
import { ProvedorDados } from './app/contexto'
import TelaAjustes from './ajustes/TelaAjustes'
import TelaCreditos from './ajustes/TelaCreditos'
import TelaHistorico from './historico/TelaHistorico'
import InicioSimulado from './simulado/telas/InicioSimulado'
import Resultado from './simulado/telas/Resultado'
import Revisao from './simulado/telas/Revisao'
import TelaQuestao from './simulado/telas/TelaQuestao'
import './estilos.css'

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
          <Route path="/historico" element={<TelaHistorico />} />
          <Route path="/ajustes" element={<TelaAjustes />} />
          <Route path="/ajustes/creditos" element={<TelaCreditos />} />
        </Routes>
      </main>
      <BarraNavegacao />
      <ConviteInstalar />
    </>
  )
}

export default function App() {
  return (
    <ProvedorDados>
      <ProvedorConfirmar>
        <HashRouter>
          <Rotas />
          <AvisoAtualizacao />
        </HashRouter>
      </ProvedorConfirmar>
    </ProvedorDados>
  )
}
