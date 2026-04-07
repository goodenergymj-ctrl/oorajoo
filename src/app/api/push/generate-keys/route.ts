import { NextResponse } from 'next/server'
import webpush from 'web-push'

// ⚠️ 이 라우트는 VAPID 키 생성 후 삭제할 것
export async function GET() {
  const keys = webpush.generateVAPIDKeys()
  return NextResponse.json({
    message: '아래 키를 Vercel 환경변수에 추가하세요. 추가 후 이 라우트(/api/push/generate-keys/route.ts)를 삭제하세요.',
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: keys.publicKey,
    VAPID_PRIVATE_KEY: keys.privateKey,
    VAPID_EMAIL: 'mailto:oorajoo@naver.com',
  })
}
