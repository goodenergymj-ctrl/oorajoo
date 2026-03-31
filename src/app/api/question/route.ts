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
        max_tokens: 60,
        messages: [{
          role: 'user',
          content: '자기성장에 관한 짧고 간결한 질문 하나만 만들어줘. 20자 이내로, 물음표로 끝나게. 예시: "오늘 한 선택 중 후회되는 건?", "지금 나에게 가장 필요한 건?", "10년 뒤 내가 오늘을 어떻게 볼까?" 질문만 출력해.'
        }]
      })
    })
    const data = await res.json()
    const question = data.content?.[0]?.text?.trim() || '10년 뒤 내가 오늘을 어떻게 볼까?'
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ question: '오늘 나에게 가장 솔직했나?' })
  }
}
