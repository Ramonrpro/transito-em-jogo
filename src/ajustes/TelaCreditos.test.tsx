import { screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { renderizarRota } from '../testes/renderizar.tsx'

test('créditos lista as 120 imagens com autor e licença', async () => {
  renderizarRota('/ajustes/creditos')
  const linhas = await screen.findAllByTestId('credito')
  expect(linhas).toHaveLength(120)
  expect(linhas[0]).toHaveTextContent(/CC BY-SA|Domínio público|Public domain/i)
  expect(screen.getByText('Resolução Contran nº 1.020/2025')).toBeInTheDocument()
})
