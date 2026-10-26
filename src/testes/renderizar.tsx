import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProvedorConfirmar } from '../app/Confirmar.tsx'
import { ProvedorDados } from '../app/contexto.tsx'
import { Rotas } from '../App.tsx'

/** Renderiza o app inteiro numa rota, com um IndexedDB novo (ou a fábrica dada). */
export function renderizarRota(rota: string, opcoes: { fabrica?: IDBFactory } = {}) {
  return render(
    <ProvedorDados fabrica={opcoes.fabrica}>
      <ProvedorConfirmar>
        <MemoryRouter initialEntries={[rota]}>
          <Rotas />
        </MemoryRouter>
      </ProvedorConfirmar>
    </ProvedorDados>,
  )
}
