import { NextResponse } from 'next/server'

let cachedQuestion = ''
let cacheDate = ''

export async function GET() {
  const today = new Date().toLocaleDateString('ko-KR')
  if (cachedQuestion && cacheDate === today) {
    return NextResponse.json({ question: cachedQuestion })
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: '자기성장과 삶의 방향에 대한 깊이 있는 질문 하나를 한국어로 만들어줘. 질문만 딱 한 문장으로.' }]
      })
    })
    const data = await res.json()
    const question = data.content?.[0]?.text?.trim() || '오늘 하루 가장 의미 있었던 순간은 무엇인가요?'
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ question: '10년 후의 나는 오늘의 어떤 선택에 가장 감사할까요?' })
  }
}
