'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import App from '@/components/App'
import Auth from '@/components/Auth'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 14,
      fontFamily: 'system-ui'
    }}>
      로딩 중...
    </div>
  )

  if (!session) return <Auth />

  return <App session={session} />
}
