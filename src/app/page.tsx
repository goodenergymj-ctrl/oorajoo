'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import App from '@/components/App'
import Auth from '@/components/Auth'

function ResetPasswordScreen() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleReset = async () => {
    if (!password || password.length < 8) { setMessage('비밀번호는 8자 이상이어야 해요'); return }
    if (password !== confirm) { setMessage('비밀번호가 일치하지 않아요'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage('오류: ' + error.message)
    else setMessage('비밀번호가 변경됐어요! 잠시 후 이동합니다...')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'system-ui' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 6 }}>우라주 챌린지</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 36 }}>새 비밀번호를 설정해주세요</div>
      <div style={{ background: 'white', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 360 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#0A0A0A', marginBottom: 20 }}>비밀번호 재설정</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>새 비밀번호</div>
        <input
          type="password"
          style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }}
          placeholder="8자 이상"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>비밀번호 확인</div>
        <input
          type="password"
          style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 16, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }}
          placeholder="한 번 더 입력해주세요"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleReset()}
        />
        <button
          style={{ width: '100%', background: '#0A0A0A', color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit' }}
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? '변경 중...' : '비밀번호 변경하기'}
        </button>
        {message && <div style={{ fontSize: 12, color: '#555', marginTop: 12, lineHeight: 1.6, textAlign: 'center' as const }}>{message}</div>}
      </div>
    </div>
  )
}

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isReset, setIsReset] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        if (event === 'PASSWORD_RECOVERY') setIsReset(true)
        if (event === 'USER_UPDATED') setIsReset(false)
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

  if (isReset) return <ResetPasswordScreen />
  if (!session) return <Auth />
  return <App session={session} />
}
