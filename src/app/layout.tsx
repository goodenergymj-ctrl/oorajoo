import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: '우라주 챌린지',
  description: '진정한 우상향 라이프 주인이 되는 날까지',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '우라주 챌린지',
  },
  openGraph: {
    title: '우라주 챌린지',
    description: '나답게 성장하는 30일 챌린지',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, background: '#F7F7F7' }}>
        {children}
      </body>
    </html>
  )
}
