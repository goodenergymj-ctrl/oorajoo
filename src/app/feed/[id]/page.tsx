import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

async function getFeedItem(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('feed')
    .select('*, profiles(nickname, color)')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const item = await getFeedItem(id)
  if (!item || item.is_private) return { title: '우라주 챌린지' }
  const name = (item.profiles as any)?.nickname || ''
  return {
    title: `${name}의 우라주 챌린지`,
    description: `🙏 ${item.gratitude}  🎯 ${item.goal}`,
    openGraph: {
      title: `${name}의 우라주 챌린지`,
      description: `🙏 ${item.gratitude}  🎯 ${item.goal}`,
    },
  }
}

export default async function FeedSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getFeedItem(id)

  if (!item) return notFound()

  if (item.is_private) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1A1A1A', marginBottom: 8 }}>비공개 글입니다</div>
          <div style={{ fontSize: 14, color: '#999', marginBottom: 28 }}>작성자가 나만 보기로 설정한 기록이에요</div>
          <a href="/" style={{ display: 'inline-block', background: '#1A1A1A', color: 'white', borderRadius: 14, padding: '12px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>홈으로 돌아가기</a>
        </div>
      </div>
    )
  }

  const profile = item.profiles as any
  const name = profile?.nickname || '챌린저'
  const color = profile?.color || '#1A1A1A'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 390 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#999', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>우라주 챌린지</div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
            {name.charAt(0)}
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#1A1A1A' }}>{name}의 기록</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{new Date(item.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8E8E8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ height: 3, background: '#1A1A1A' }} />
          <div style={{ padding: '20px 20px' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>🙏</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.5px' }}>오늘의 감사</span>
              </div>
              <div style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.7, fontWeight: 500 }}>{item.gratitude}</div>
            </div>
            <div style={{ height: 1, background: '#F0F0F0', marginBottom: 16 }} />
            <div style={{ marginBottom: item.question ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>🎯</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.5px' }}>오늘의 목표</span>
              </div>
              <div style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.7, fontWeight: 500 }}>{item.goal}</div>
            </div>
            {item.question && (
              <>
                <div style={{ height: 1, background: '#F0F0F0', marginBottom: 16 }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>✦ AI DAILY QUESTION</div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>{item.question}</div>
                  <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.75, fontWeight: 500, background: '#F7F7F7', borderRadius: 10, padding: '12px 14px' }}>"{item.question_answer}"</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ display: 'inline-block', background: '#1A1A1A', color: 'white', borderRadius: 14, padding: '14px 32px', fontSize: 14, fontWeight: 900, textDecoration: 'none', letterSpacing: '-0.3px' }}>
            우라주 챌린지 시작하기 →
          </a>
          <div style={{ fontSize: 11, color: '#BBB', marginTop: 16 }}>#우라주챌린지</div>
        </div>
      </div>
    </div>
  )
}
