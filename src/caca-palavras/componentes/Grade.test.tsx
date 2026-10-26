import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Grade from './Grade'

function montar() {
  const aoSelecionar = vi.fn()
  render(
    <Grade
      tamanho={8}
      letras={'A'.repeat(64)}
      marcadas={new Map()}
      desabilitada={false}
      onInicioSelecao={() => {}}
      onSelecao={aoSelecionar}
    />,
  )
  const grade = screen.getByRole('group', { name: 'Grade de letras' })
  // 8×8 casas de 10 px, canto em (0, 0).
  grade.getBoundingClientRect = () => new DOMRect(0, 0, 80, 80)
  return { grade, aoSelecionar }
}

const evento = (tipo: string, x: number, y: number, buttons: number) =>
  new PointerEvent(tipo, { pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons, clientX: x, clientY: y, bubbles: true })

test('mouse solto fora da janela: ao voltar sem botão, o arrasto termina como soltura', () => {
  const { grade, aoSelecionar } = montar()
  fireEvent(grade, evento('pointerdown', 5, 5, 1))
  fireEvent(window, evento('pointermove', 45, 5, 1))
  expect(aoSelecionar).not.toHaveBeenCalled()
  // Voltou com o botão já solto: encerra, sem esperar o pointerup que se perdeu.
  fireEvent(window, evento('pointermove', 45, 5, 0))
  expect(aoSelecionar).toHaveBeenCalledExactlyOnceWith([0, 1, 2, 3, 4])
  // E a seleção não segue mais o mouse.
  fireEvent(window, evento('pointermove', 75, 5, 0))
  expect(aoSelecionar).toHaveBeenCalledTimes(1)
})
