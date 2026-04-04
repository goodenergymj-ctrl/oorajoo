import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

async function getLoungePost(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('lounge')
    .select('*, profiles(nickname, color)')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await getLoungePost(id)
  if (!post) return { title: '우라주 챌린지' }
  const name = (post.profiles as any)?.nickname || ''
  return {
    title: `${name}의 우라주 챌린지 라운지`,
    description: post.content?.slice(0, 100),
    openGraph: {
      title: `${name}의 우라주 챌린지 라운지`,
      description: post.content?.slice(0, 100),
    },
  }
}

export default async function LoungeSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getLoungePost(id)
  if (!post) return notFound()

  const profile = post.profiles as any
  const name = profile?.nickname || '챌린저'
  const color = profile?.color || '#1A1A1A'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 390 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#999', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>우라주 챌린지 라운지</div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 16, marginBottom: 8 }}>
            {name.charAt(0)}
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#1A1A1A' }}>{name}</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E8E8E8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ padding: '20px 20px' }}>
            {post.tag && (
              <div style={{ display: 'inline-block', background: '#F0F0F0', color: '#555', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>{post.tag}</div>
            )}
            <div style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.8, fontWeight: 500, whiteSpace: 'pre-wrap' }}>{post.content}</div>
            {post.image_url && (
              <img src={post.image_url} alt="" style={{ width: '100%', borderRadius: 10, marginTop: 14, display: 'block' }} />
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
