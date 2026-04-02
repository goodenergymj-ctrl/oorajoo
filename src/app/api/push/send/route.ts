import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: NextRequest) {
  const { targetUserId, title, body } = await req.json()
  if (!targetUserId) return NextResponse.json({ ok: false }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', targetUserId)
    .single()

  if (!data) return NextResponse.json({ ok: false })

  try {
    await webpush.sendNotification(data.subscription, JSON.stringify({ title, body }))
  } catch {
    // 구독 만료 시 삭제
    await supabase.from('push_subscriptions').delete().eq('user_id', targetUserId)
  }

  return NextResponse.json({ ok: true })
}
