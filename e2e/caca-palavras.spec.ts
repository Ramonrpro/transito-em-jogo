import { expect, test, type Locator, type Page } from '@playwright/test'

type Colocacao = { palavra: string; celulas: number[] }

async function partidaEmAndamento(page: Page): Promise<{ id: string; colocacoes: Colocacao[] }> {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const req = indexedDB.open('transito-em-jogo')
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const all = req.result.transaction('partidas').objectStore('partidas').getAll()
          all.onerror = () => reject(all.error)
          all.onsuccess = () => {
            req.result.close()
            const p = (all.result as { terminadaEm: number | null }[]).find((x) => x.terminadaEm === null)
            p ? resolve(p as never) : reject(new Error('sem partida em andamento'))
          }
        }
      }),
  )
}

async function centro(celula: Locator) {
  await celula.scrollIntoViewIfNeeded()
  const b = await celula.boundingBox()
  if (!b) throw new Error('casa sem caixa')
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}

const casa = (page: Page, i: number) => page.locator(`[data-celula="${i}"]`)

async function arrastarMouse(page: Page, c: Colocacao) {
  const a = await centro(casa(page, c.celulas[0]))
  const z = await centro(casa(page, c.celulas.at(-1)!))
  await page.mouse.move(a.x, a.y)
  await page.mouse.down()
  await page.mouse.move(z.x, z.y, { steps: 8 })
  await page.mouse.up()
}

async function arrastarToque(page: Page, c: Colocacao) {
  const a = await centro(casa(page, c.celulas[0]))
  const z = await centro(casa(page, c.celulas.at(-1)!))
  const cdp = await page.context().newCDPSession(page)
  const ponto = (x: number, y: number) => [{ x, y, id: 1 }]
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: ponto(a.x, a.y) })
  for (let k = 1; k <= 3; k++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: ponto(a.x + ((z.x - a.x) * k) / 3, a.y + ((z.y - a.y) * k) / 3),
    })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
}

async function tocar(page: Page, c: Colocacao) {
  await casa(page, c.celulas[0]).tap()
  await casa(page, c.celulas.at(-1)!).tap()
}

async function comecar(page: Page) {
  await page.goto('./#/caca-palavras')
  await expect(page.getByRole('button', { name: /Placas/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: /Fácil/ })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Começar' }).click()
  await expect(page.locator('[data-celula="0"]')).toBeVisible()
  return partidaEmAndamento(page)
}

test('partida fácil inteira: arrastar, tocar e arrastar com o dedo', async ({ page }) => {
  const p = await comecar(page)
  expect(p.colocacoes).toHaveLength(5)
  const [c1, c2, c3, c4, c5] = p.colocacoes
  const continuar = page.getByRole('button', { name: 'Continuar' })
  const achou = page.getByRole('heading', { name: 'Achou!' })

  await arrastarMouse(page, c1)
  await expect(achou).toBeVisible()
  await continuar.click()

  await arrastarMouse(page, c2)
  await expect(achou).toBeVisible()
  await continuar.click()

  // Arrasto rápido com o dedo; o toque seguinte, logo em seguida, não pode ser engolido.
  await arrastarToque(page, c3)
  await expect(achou).toBeVisible()
  await continuar.tap()
  await expect(achou).toBeHidden()

  await tocar(page, c4)
  await expect(achou).toBeVisible()
  await continuar.click()

  await arrastarMouse(page, c5)
  await expect(achou).toBeVisible()
  await page.getByRole('button', { name: 'Ver resultado' }).click()

  await expect(page.getByRole('heading', { name: '🏁 Achou todas!' })).toBeVisible()
  await expect(page.getByText('Primeira partida neste tema e nível.')).toBeVisible()

  await page.getByRole('navigation').getByText('Histórico').click()
  await expect(page.getByText('🔤 Caça-palavras · Placas · Fácil')).toBeVisible()
})

test('recarregar no meio mantém o que foi achado', async ({ page }) => {
  const p = await comecar(page)
  await arrastarMouse(page, p.colocacoes[0])
  await expect(page.getByRole('heading', { name: 'Achou!' })).toBeVisible()
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.goto('./#/caca-palavras')
  await page.reload()
  await expect(page.getByText('Placas · Fácil · 1 de 5 palavras')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByText('1 de 5', { exact: true })).toBeVisible()
})

test('"Começar" fica visível acima da barra inferior em 360×640, com e sem partida em andamento', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto('./#/caca-palavras')
  const conferir = async () => {
    const botao = page.getByRole('button', { name: 'Começar' })
    await expect(botao).toBeVisible()
    const b = (await botao.boundingBox())!
    const barra = (await page.locator('nav').last().boundingBox())!
    expect(b.y).toBeGreaterThanOrEqual(0)
    expect(b.y + b.height).toBeLessThanOrEqual(barra.y)
    expect(b.y + b.height).toBeLessThanOrEqual(640)
  }
  await conferir()
  await page.getByRole('button', { name: 'Começar' }).click()
  await expect(page.locator('[data-celula="0"]')).toBeVisible()
  await page.goto('./#/caca-palavras')
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible()
  await conferir()
})
