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
      return NextResponse.json({ question: '오늘 나를 가장 빛나게 한 것은 무엇인가요?' })
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
          content: '자기성장에 관한 짧고 간결한 질문 하나만 만들어줘. 25자 이내로, 공손한 존댓말로, "~은 무엇인가요?" "~인가요?" 형식으로 물음표로 끝나게. 미래지향적이고 긍정적인 내용이어야 해. 후회·반성·부족함 같은 부정적 뉘앙스는 절대 쓰지 마. 예시: "오늘 나를 가장 빛나게 한 것은 무엇인가요?", "지금 가장 설레는 꿈은 무엇인가요?", "한 달 뒤 감사하게 될 오늘의 선택은 무엇인가요?", "미래의 내가 오늘에게 전하고 싶은 말은 무엇인가요?" 질문만 출력해.'
        }]
      })
    })
    const data = await res.json()
    const question = data.content?.[0]?.text?.trim() || '미래의 내가 오늘에게 전하고 싶은 말은 무엇인가요?'
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ question: '오늘 나를 가장 빛나게 한 것은 무엇인가요?' })
  }
}
