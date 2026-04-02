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
  // 내부 영역 기준으로 좌표 계산 (0~100 단위로 정규화 후 스케일)
  const sc = (s - p * 2) / 100  // 스케일 팩터
  const x = (v) => p + v * sc
  const y = (v) => p + v * sc
  const radius = (s - p * 2) * 0.22

  // 우상향 그래프 좌표 (0~100 그리드)
  // 바닥 그리드선
  const gridY = 72
  // 꺾은선 포인트: 왼쪽 아래 → 오른쪽 위
  const linePoints = [
    [14, 74], [28, 62], [42, 55], [56, 38], [70, 24],
  ]
  // 화살표 끝점
  const arrowTip  = [82, 14]
  const arrowLeft = [72, 16]
  const arrowRight= [80, 26]

  const pts = linePoints.map(([lx, ly]) => `${x(lx)},${y(ly)}`).join(' ')
  const arrowPath = `M${x(linePoints[linePoints.length-1][0])},${y(linePoints[linePoints.length-1][1])} L${x(arrowTip[0])},${y(arrowTip[1])} L${x(arrowLeft[0])},${y(arrowLeft[1])} M${x(arrowTip[0])},${y(arrowTip[1])} L${x(arrowRight[0])},${y(arrowRight[1])}`

  // 도트 원
  const dots = linePoints.map(([lx, ly]) =>
    `<circle cx="${x(lx)}" cy="${y(ly)}" r="${sc * 3.2}" fill="white"/>`
  ).join('')

  const strokeW = Math.max(2, sc * 4.5)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="#0A0A0A"/>
  <rect x="${p}" y="${p}" width="${s - p*2}" height="${s - p*2}" rx="${radius}" fill="#0A0A0A"/>

  <!-- 바닥 기준선 -->
  <line x1="${x(12)}" y1="${y(gridY)}" x2="${x(84)}" y2="${y(gridY)}"
    stroke="rgba(255,255,255,0.12)" stroke-width="${sc * 1.5}" stroke-linecap="round"/>

  <!-- 우상향 꺾은선 -->
  <polyline points="${pts} ${x(arrowTip[0])},${y(arrowTip[1])}"
    fill="none" stroke="white" stroke-width="${strokeW}"
    stroke-linecap="round" stroke-linejoin="round"/>

  <!-- 화살표 날개 -->
  <path d="${arrowPath}"
    fill="none" stroke="white" stroke-width="${strokeW}"
    stroke-linecap="round" stroke-linejoin="round"/>

  <!-- 데이터 도트 -->
  ${dots}
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
