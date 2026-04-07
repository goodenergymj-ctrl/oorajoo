import { NextResponse } from 'next/server'

let cachedQuestion = ''
let cacheDate = ''

const THEMES = [
  { key: '미래비전', desc: '10년 후 꿈, 이루고 싶은 삶의 모습, 미래의 나에게 보내는 메시지' },
  { key: '자기수용', desc: '나의 약점을 인정하기, 나 자신을 있는 그대로 사랑하기' },
  { key: '용기와도전', desc: '두렵지만 해야 할 일, 처음 시도해보고 싶은 것, 실패를 두려워하지 않기' },
  { key: '관계와연결', desc: '소중한 사람에게 전하지 못한 말, 관계에서 배운 것, 나를 성장시킨 사람' },
  { key: '습관과루틴', desc: '버리고 싶은 습관, 만들고 싶은 루틴, 작은 변화가 가져오는 것' },
  { key: '감사와기쁨', desc: '오늘 감사한 것 3가지, 행복을 느끼는 순간, 당연하게 여겼던 것의 소중함' },
  { key: '현재순간', desc: '지금 이 순간에 집중하기, 오늘 하루의 의미, 지금 가장 중요한 것' },
  { key: '가치관', desc: '내가 절대 포기하지 않는 것, 삶에서 가장 중요하게 여기는 것, 나만의 원칙' },
  { key: '성장과배움', desc: '최근 배운 것, 실수에서 얻은 교훈, 어제보다 성장한 부분' },
  { key: '내면의목소리', desc: '오래 미뤄온 일, 진짜 원하는 것, 마음 속 깊이 숨겨둔 바람' },
  { key: '에너지와휴식', desc: '나를 지치게 하는 것과 채워주는 것, 진정한 쉼이란, 번아웃 신호' },
  { key: '꿈과열망', desc: '어릴 때 꿈, 아직 포기하지 않은 꿈, 죽기 전에 꼭 하고 싶은 것' },
]

const FALLBACKS = [
  '지금 내가 가장 두려워하는 것은 무엇인가요?',
  '10년 후의 나에게 어떤 말을 전하고 싶나요?',
  '오늘 나를 가장 기쁘게 한 것은 무엇인가요?',
  '지금 당장 버리고 싶은 습관이 있나요?',
  '내가 진정으로 원하는 삶은 어떤 모습인가요?',
]

export async function GET() {
  const todayDate = new Date()
  const today = todayDate.toLocaleDateString('ko-KR')
  if (cachedQuestion && cacheDate === today) {
    return NextResponse.json({ question: cachedQuestion })
  }
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ question: FALLBACKS[todayDate.getDate() % FALLBACKS.length] })
    }

    // 날짜 기반으로 테마 순환 (매일 다른 주제)
    const dayOfYear = Math.floor((todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / 86400000)
    const theme = THEMES[dayOfYear % THEMES.length]
    const weekNum = Math.floor(dayOfYear / 7)
    const subThemeIdx = weekNum % THEMES.length

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 80,
        system: `당신은 한국어 자기성장 질문 생성기입니다.
규칙:
1. 반드시 존댓말로 끝낼 것: ~까요? / ~나요? / ~인가요? / ~할까요? / ~있나요? / ~셨나요? / ~싶나요?
2. 반말 절대 금지
3. 질문 텍스트만 출력, 설명·번호·따옴표 없이
4. 30자 이내의 짧고 날카로운 질문
5. 뻔하거나 일반적인 질문 금지 (예: "오늘 감사한 게 뭔가요?" 같은 흔한 질문 금지)
6. 사람의 내면을 깊이 건드리는 질문, 미래를 향한 희망과 용기를 주는 질문`,
        messages: [{
          role: 'user',
          content: `오늘(${today}) 30일 챌린지 참여자를 위한 성찰 질문 1개.
주제: ${theme.key} — ${theme.desc}
부가힌트: ${THEMES[subThemeIdx].key}와 연결해도 좋음
조건: 30자 이내 / 존댓말 / 뻔하지 않고 깊이 있는 질문 / 미래를 꿈꾸며 나아갈 수 있는 질문 / 질문만 출력`
        }]
      })
    })
    const data = await res.json()
    const raw = data.content?.[0]?.text?.trim() || ''
    const honorifics = ['까요?', '나요?', '인가요?', '할까요?', '볼까요?', '줄까요?', '있나요?', '었나요?', '했나요?', '셨나요?', '싶나요?', '를까요?', '을까요?']
    const isHonorific = honorifics.some(ending => raw.endsWith(ending))
    const question = (raw && isHonorific) ? raw : FALLBACKS[dayOfYear % FALLBACKS.length]
    cachedQuestion = question
    cacheDate = today
    return NextResponse.json({ question })
  } catch {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    return NextResponse.json({ question: FALLBACKS[dayOfYear % FALLBACKS.length] })
  }
}
