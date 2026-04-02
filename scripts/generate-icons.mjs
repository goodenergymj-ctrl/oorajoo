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
  const inner = size - padding * 2
  const radius = size * 0.2
  const fontSize = Math.round(inner * 0.52)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#F7F7F7"/>
  <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${radius}" fill="#0A0A0A"/>
  <text
    x="50%"
    y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-size="${fontSize}"
    font-family="'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif"
    font-weight="900"
    fill="white"
  >우</text>
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
