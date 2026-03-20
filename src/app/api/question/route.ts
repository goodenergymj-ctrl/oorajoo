import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

let cachedQuestion = ''
let cacheDate = ''

export async function GET() {
  const today = new Date().toLocaleDateString('ko-KR')
  if (cachedQuestion && cacheDate === today) {
    return NextResponse.json({ question: cachedQuestion })
  }
  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 100,
      messages: [{ role: 'user', content: '자기성장과 삶의 방향에 대한 깊이 있는 질문 하나를 한국어로 만들어줘. 질문만 딱 한 문장으로.' }]
    })
    const question = (msg.content[0] as any).text?.trim() || '오늘 하루 가장 의미 있었던 순간은 무엇인가요?'
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ question: '10년 후의 나는 오늘의 어떤 선택에 가장 감사할까요?' })
  }
}
