import { describe, expect, test } from 'vitest'
import { detectarPlataforma, deveMostrarConvite } from './instalacao'

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'

describe('instalacao', () => {
  test('detecta plataformas', () => {
    expect(detectarPlataforma(IPHONE, 5)).toBe('ios-safari')
    expect(detectarPlataforma(IPAD, 5)).toBe('ios-safari')
    expect(detectarPlataforma(IPAD, 0)).toBe('outra')
    expect(detectarPlataforma(ANDROID, 5)).toBe('android-chrome')
  })

  const DIA = 86_400_000
  test.each([
    [{ instalado: true, dispensadoEm: null, temPromptNativo: true, plataforma: 'android-chrome' }, false],
    [{ instalado: false, dispensadoEm: -2 * DIA, temPromptNativo: true, plataforma: 'android-chrome' }, false],
    [{ instalado: false, dispensadoEm: -3 * DIA - 1, temPromptNativo: true, plataforma: 'android-chrome' }, true],
    [{ instalado: false, dispensadoEm: null, temPromptNativo: false, plataforma: 'ios-safari' }, true],
    [{ instalado: false, dispensadoEm: null, temPromptNativo: false, plataforma: 'outra' }, false],
  ] as const)('deveMostrarConvite %#', (p, esperado) =>
    expect(deveMostrarConvite({ ...p, agora: 0 })).toBe(esperado))
})
