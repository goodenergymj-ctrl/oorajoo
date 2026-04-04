import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { gratitude, goal, answer } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ cheer: '오늘도 기록했어요. 그것만으로 충분해요.' })

  const parts = [
    gratitude && `오늘의 감사: "${gratitude}"`,
    goal && `오늘의 목표: "${goal}"`,
    answer && `질문 답변: "${answer}"`,
  ].filter(Boolean).join('\n')

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `아래는 한 사람이 오늘 기록한 내용이야:\n${parts}\n\n이 내용을 읽고 진심 어린 응원·격려 문구를 2문장으로 써줘. 기록 내용을 구체적으로 언급하면서 따뜻하게 공감하고 응원해줘. 존댓말, 자연스러운 한국어로. 이모지 없이 텍스트만. 문구만 출력해.`
        }]
      })
    })
    const data = await res.json()
    const cheer = data.content?.[0]?.text?.trim() || '오늘도 기록했어요. 그것만으로 충분해요.'
    return NextResponse.json({ cheer })
  } catch {
    return NextResponse.json({ cheer: '오늘도 기록했어요. 그것만으로 충분해요.' })
  }
}
