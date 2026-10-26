import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const pasta = new URL('../public/icons/', import.meta.url)
const svg = await readFile(new URL('icone.svg', pasta))

// Versão "maskable": fundo amarelo sem borda e o semáforo dentro da zona segura (80% central).
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#FACC15"/>
  <g transform="translate(76.8 76.8) scale(0.7)">
    <rect x="176" y="96" width="160" height="320" rx="40" fill="#111111"/>
    <circle cx="256" cy="172" r="36" fill="#DC2626"/>
    <circle cx="256" cy="256" r="36" fill="#FACC15"/>
    <circle cx="256" cy="340" r="36" fill="#16A34A"/>
  </g>
</svg>`

const saidas: [string, Buffer, number][] = [
  ['icone-192.png', svg, 192],
  ['icone-512.png', svg, 512],
  ['icone-maskable-512.png', Buffer.from(svgMaskable), 512],
  ['apple-touch-icon.png', Buffer.from(svgMaskable), 180],
]

for (const [nome, origem, tamanho] of saidas) {
  await sharp(origem, { density: 384 }).resize(tamanho, tamanho).png().toFile(fileURLToPath(new URL(nome, pasta)))
  console.log('gerado', nome)
}
