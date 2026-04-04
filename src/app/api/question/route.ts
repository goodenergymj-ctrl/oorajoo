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
        system: '당신은 한국어 자기성장 질문 생성기입니다. 반드시 정중한 존댓말(~까요?, ~나요?, ~인가요?, ~할까요?)로 끝나는 질문만 출력합니다. 반말(~니?, ~야?, ~지?, ~냐?)은 절대 사용하지 않습니다. 질문 텍스트 외에 다른 내용은 출력하지 않습니다.',
        messages: [{
          role: 'user',
          content: `오늘 날짜: ${today}. 자기성장 30일 챌린지 참여자를 위한 성찰 질문 하나를 생성해주세요. 조건: 25자 이내 / 존댓말(~까요? ~나요? ~인가요? ~할까요?) 중 하나로 반드시 끝낼 것 / 긍정적이고 미래지향적 / 관계·꿈·습관·감사·성장·용기·현재순간 중 오늘 날짜에 맞는 주제 선택 / 질문 텍스트만 출력.`
        }]
      })
    })
    const data = await res.json()
    const raw = data.content?.[0]?.text?.trim() || ''
    const honorifics = ['까요?', '나요?', '인가요?', '할까요?', '볼까요?', '줄까요?', '있나요?', '었나요?', '했나요?', '셨나요?']
    const isHonorific = honorifics.some(ending => raw.endsWith(ending))
    const question = (raw && isHonorific) ? raw : '오늘 가장 잘한 선택은 무엇이었나요?'
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ question: '오늘 나를 가장 빛나게 한 것은 무엇인가요?' })
  }
}
