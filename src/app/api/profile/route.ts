import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, nickname, intro, threads_id, insta_id, naver_blog } = body

  const { error } = await supabase.from('profiles').upsert({
    id, nickname, intro: intro || '안녕하세요!',
    threads_id: threads_id || null,
    insta_id: insta_id || null,
    naver_blog: naver_blog || null,
    is_admin: false, is_approved: false,
    color: '#1A1A1A', tags: [], streak: 0
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
