export const metadata = {
  title: '우라주 챌린지',
  description: '진정한 우상향 라이프 주인이 되는 날까지',
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
