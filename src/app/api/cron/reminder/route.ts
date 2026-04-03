import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export async function GET(req: NextRequest) {
  // Accept secret via Authorization header or query param
  const auth = req.headers.get('authorization') || ''
  const querySecret = new URL(req.url).searchParams.get('secret') || ''
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: 'VAPID keys missing' }, { status: 500 })
  }
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:oorajoo@naver.com',
    vapidPublic,
    vapidPrivate
  )

  // Current KST time rounded to nearest 5 minutes
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const hh = now.getUTCHours().toString().padStart(2, '0')
  const rawMm = now.getUTCMinutes()
  const roundedMm = Math.round(rawMm / 5) * 5 % 60
  const matchTime = `${hh}:${roundedMm.toString().padStart(2, '0')}`
  const todayKST = now.toISOString().split('T')[0]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find users whose notification_time matches now and haven't been notified today
  const { data: users } = await supabase
    .from('profiles')
    .select('id, nickname, notification_time')
    .eq('notification_time', matchTime)
    .not('notification_time', 'is', null)

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, time: matchTime })
  }

  // Exclude users who already submitted today's record
  const { data: todayFeed } = await supabase
    .from('feed')
    .select('user_id')
    .gte('created_at', `${todayKST}T00:00:00+09:00`)
    .in('user_id', users.map((u: any) => u.id))

  const submittedIds = new Set((todayFeed || []).map((f: any) => f.user_id))
  const toNotify = users.filter((u: any) => !submittedIds.has(u.id))

  let sent = 0
  for (const user of toNotify) {
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user.id)

    for (const row of subs || []) {
      try {
        await webpush.sendNotification(
          row.subscription,
          JSON.stringify({
            title: '우라주 챌린지 📈',
            body: `${user.nickname}님, 오늘의 기록을 남겨보세요!`,
            tag: 'daily-reminder',
          })
        )
        sent++
      } catch {}
    }

    await supabase.from('profiles').update({ notif_last_date: todayKST }).eq('id', user.id)
  }

  return NextResponse.json({ sent, time: matchTime, checked: users.length })
}
