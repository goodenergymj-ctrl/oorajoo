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
          content: `자기성장 30일 챌린지 참여자를 위한 오늘의 성찰 질문 하나를 만들어주세요. 오늘 날짜: ${today}. 조건: 25자 이내, 반드시 정중한 존댓말(~까요? / ~나요? / ~인가요? / ~할까요?)로 끝내기, 물음표로 끝내기. 미래지향적이고 긍정적인 내용만. 매일 다른 주제(관계/꿈/습관/감사/성장/용기/현재순간 등)를 골고루 다뤄야 합니다. 부정적 뉘앙스 절대 금지. 진부한 표현 피하기. 질문 텍스트만 출력하세요.`
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
