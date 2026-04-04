import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { targetUserId, title, body } = await req.json()
  if (!targetUserId) return NextResponse.json({ ok: false }, { status: 400 })

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  const vapidEmail = process.env.VAPID_EMAIL

  if (!vapidPublic || !vapidPrivate || !vapidEmail) {
    console.error('VAPID env vars missing', { vapidPublic: !!vapidPublic, vapidPrivate: !!vapidPrivate, vapidEmail: !!vapidEmail })
    return NextResponse.json({ ok: false, error: 'vapid_missing' }, { status: 500 })
  }

  try {
    webpush.setVapidDetails(`mailto:${vapidEmail}`, vapidPublic, vapidPrivate)
  } catch (e) {
    console.error('setVapidDetails error:', e)
    return NextResponse.json({ ok: false, error: 'vapid_invalid' }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', targetUserId)
    .maybeSingle()

  if (!data) return NextResponse.json({ ok: false, error: 'no_subscription' })

  try {
    await webpush.sendNotification(data.subscription, JSON.stringify({ title, body }))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('sendNotification error:', e?.statusCode, e?.body)
    if (e?.statusCode === 410 || e?.statusCode === 404) {
      await supabase.from('push_subscriptions').delete().eq('user_id', targetUserId)
    }
    return NextResponse.json({ ok: false, error: 'send_failed', detail: e?.statusCode }, { status: 500 })
  }
}
