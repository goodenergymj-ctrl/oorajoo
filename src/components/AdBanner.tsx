'use client'

import { useEffect, useRef } from 'react'

// 카카오 AdFit 배너 컴포넌트
// 사용 전 https://adfit.kakao.com 에서 광고 단위 등록 후 adUnitId를 교체하세요.
export default function AdBanner({ adUnitId, width = 320, height = 50 }: { adUnitId: string; width?: number; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    // 이미 ins 태그가 삽입되었으면 중복 삽입 방지
    if (containerRef.current.querySelector('ins')) return

    const ins = document.createElement('ins')
    ins.className = 'kakao_ad_area'
    ins.setAttribute('data-ad-unit', adUnitId)
    ins.setAttribute('data-ad-width', String(width))
    ins.setAttribute('data-ad-height', String(height))
    containerRef.current.appendChild(ins)

    const script = document.createElement('script')
    script.async = true
    script.charset = 'utf-8'
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js'
    containerRef.current.appendChild(script)
  }, [adUnitId, width, height])

  return (
    <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 16px', minHeight: height, background: 'var(--surface)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }} />
  )
}
