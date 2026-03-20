import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await req.json()
    const { action, userId, nickname, intro, threads_id, insta_id, naver_blog, cohort_id } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // 프로필 저장
    if (action === 'save_profile') {
      // 이미 있는지 확인
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      let error
      if (existing) {
        // 업데이트
        const result = await supabase
          .from('profiles')
          .update({
            nickname: nickname || '',
            intro: intro || '',
            threads_id: threads_id || null,
            insta_id: insta_id || null,
            naver_blog: naver_blog || null,
          })
          .eq('id', userId)
        error = result.error
      } else {
        // 새로 삽입
        const result = await supabase
          .from('profiles')
          .insert({
            id: userId,
            nickname: nickname || '',
            intro: intro || '',
            threads_id: threads_id || null,
            insta_id: insta_id || null,
            naver_blog: naver_blog || null,
            is_admin: false,
            is_approved: false,
            color: '#1A1A1A',
            tags: [],
            streak: 0,
          })
        error = result.error
      }

      if (error) {
        console.error('save_profile error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    // 기수 신청
    if (action === 'apply_cohort') {
      if (!cohort_id) {
        return NextResponse.json({ error: 'cohort_id required' }, { status: 400 })
      }

      // pending_members에 추가
      const { data: existing } = await supabase
        .from('pending_members')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!existing) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', userId)
          .single()

        await supabase.from('pending_members').insert({
          user_id: userId,
          nickname: profile?.nickname || '',
          cohort_id,
        })
      } else {
        // 이미 있으면 기수만 업데이트
        await supabase
          .from('pending_members')
          .update({ cohort_id })
          .eq('user_id', userId)
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (e: any) {
    console.error('API error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
