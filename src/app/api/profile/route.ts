import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, nickname, intro, threads_id, insta_id, naver_blog } = body

    if (!id || !nickname) {
      return NextResponse.json({ error: 'id and nickname required' }, { status: 400 })
    }

    const { data, error } = await supabase.from('profiles').upsert({
      id,
      nickname,
      intro: intro || '안녕하세요!',
      threads_id: threads_id || null,
      insta_id: insta_id || null,
      naver_blog: naver_blog || null,
      is_admin: false,
      is_approved: false,
      color: '#1A1A1A',
      tags: [],
      streak: 0
    }, { onConflict: 'id' })

    if (error) {
      console.error('Supabase error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    console.error('Catch error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
