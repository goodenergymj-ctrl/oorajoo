import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0A',
}

export const metadata: Metadata = {
  title: '우라주 챌린지',
  description: '진정한 우상향 라이프 주인이 되는 날까지',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '우라주 챌린지',
    startupImage: [
      {
        url: '/icons/apple-touch-icon.png',
      },
    ],
  },
  openGraph: {
    title: '우라주 챌린지',
    description: '나답게 성장하는 30일 챌린지',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
