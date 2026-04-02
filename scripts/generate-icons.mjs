/**
 * 아이콘 생성 스크립트 — node scripts/generate-icons.mjs
 * 의존성: sharp (npm install sharp --save-dev)
 */
import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, '../public/icons')
await mkdir(outputDir, { recursive: true })

function makeSvg(size, padding = 0) {
  const p = padding
  const s = size
  const sc = (s - p * 2) / 100
  const x = (v) => p + v * sc
  const y = (v) => p + v * sc
  const radius = (s - p * 2) * 0.22

  // 우상향 도트 (왼쪽 아래 → 오른쪽 위), 텍스트 공간 위해 y 상단 편중
  const dots = [
    [18, 72],
    [34, 58],
    [50, 44],
    [66, 30],
    [82, 16],
  ]
  const dotR = sc * 7.5

  const circles = dots.map(([dx, dy]) =>
    `<circle cx="${x(dx)}" cy="${y(dy)}" r="${dotR}" fill="white"/>`
  ).join('\n  ')

  const fontSize = Math.max(8, sc * 7)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="#0A0A0A"/>
  <rect x="${p}" y="${p}" width="${s - p*2}" height="${s - p*2}" rx="${radius}" fill="#0A0A0A"/>

  ${circles}

  <text
    x="${x(50)}" y="${y(92)}"
    text-anchor="middle"
    font-size="${fontSize}"
    font-family="'Arial', sans-serif"
    font-weight="600"
    letter-spacing="${sc * 0.3}"
    fill="rgba(255,255,255,0.45)"
  >oorajoo challenge</text>
</svg>`
}

const configs = [
  { name: 'icon-192x192.png',         size: 192, padding: 0  },
  { name: 'icon-512x512.png',         size: 512, padding: 0  },
  { name: 'icon-maskable-192x192.png', size: 192, padding: 22 },
  { name: 'icon-maskable-512x512.png', size: 512, padding: 58 },
  { name: 'apple-touch-icon.png',      size: 180, padding: 0  },
]

for (const { name, size, padding } of configs) {
  const svg = Buffer.from(makeSvg(size, padding))
  const outPath = path.join(outputDir, name)
  await sharp(svg).png().toFile(outPath)
  console.log(`✓ ${name}`)
}

console.log('\n아이콘 생성 완료! public/icons/ 폴더를 확인하세요.')
