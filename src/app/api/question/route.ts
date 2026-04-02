import { NextResponse } from 'next/server'

let cachedQuestion = ''
let cacheDate = ''

export async function GET() {
  const today = new Date().toLocaleDateString('ko-KR')
  if (cachedQuestion && cacheDate === today) {
    return NextResponse.json({ question: cachedQuestion })
  }
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ question: '오늘 나를 가장 빛나게 한 건 뭔가요?' })
    }
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 60,
        messages: [{
          role: 'user',
          content: '자기성장에 관한 짧고 간결한 질문 하나만 만들어줘. 20자 이내로, 존댓말로, 물음표로 끝나게. 미래지향적이고 긍정적인 내용이어야 해. 후회·반성·부족함 같은 부정적 뉘앙스는 절대 쓰지 마. 예시: "오늘 나를 가장 빛나게 한 건 뭔가요?", "한 달 뒤 내가 감사할 오늘의 선택은요?", "지금 이 순간 가장 설레는 게 뭔가요?", "미래의 내가 오늘에게 뭐라 할 것 같나요?" 질문만 출력해.'
        }]
      })
    })
    const data = await res.json()
    const question = data.content?.[0]?.text?.trim() || '미래의 내가 오늘에게 뭐라 할 것 같나요?'
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ question: '오늘 나를 가장 빛나게 한 건 뭔가요?' })
  }
}
