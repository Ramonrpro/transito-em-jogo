import { expect, test } from 'vitest'
import { formatarQuando } from './tempo.ts'

test('formatarQuando', () => {
  const agora = new Date(2026, 9, 26, 15).getTime()
  expect(formatarQuando(new Date(2026, 9, 26, 8).getTime(), agora)).toBe('hoje')
  expect(formatarQuando(new Date(2026, 9, 25, 23).getTime(), agora)).toBe('ontem')
  expect(formatarQuando(new Date(2026, 9, 3).getTime(), agora)).toBe('03/10')
})
