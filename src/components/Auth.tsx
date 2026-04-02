'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    if (mode === 'forgot') {
      if (!email) { setMessage('이메일을 입력해주세요'); setLoading(false); return }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      })
      if (error) setMessage(error.message)
      else setMessage('비밀번호 재설정 링크를 이메일로 보냈어요 ✉️')
      setLoading(false)
      return
    }
    if (!email || !password) { setLoading(false); return }
    if (mode === 'signup') {
      if (!nickname.trim()) {
        setMessage('닉네임을 입력해주세요')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname: nickname.trim() } }
      })
      if (error) setMessage(error.message)
      else setMessage('가입 신청 완료! 관리자 승인 후 이용할 수 있어요 🌿')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('이메일 또는 비밀번호를 확인해주세요')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'system-ui' }}>

      <div style={{ marginBottom: 8 }}>
        <svg viewBox="0 0 280 72" width="220" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
          <defs>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="1.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <line x1="10" y1="66" x2="200" y2="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,5"/>
          <text x="10" y="66" fontSize="22" fontWeight="900" fill="rgba(255,255,255,0.25)">O</text>
          <text x="30" y="59" fontSize="25" fontWeight="900" fill="rgba(255,255,255,0.4)">o</text>
          <text x="50" y="51" fontSize="28" fontWeight="900" fill="rgba(255,255,255,0.55)">r</text>
          <text x="66" y="43" fontSize="31" fontWeight="900" fill="rgba(255,255,255,0.7)">a</text>
          <text x="88" y="34" fontSize="34" fontWeight="900" fill="rgba(255,255,255,0.82)">j</text>
          <text x="101" y="25" fontSize="37" fontWeight="900" fill="rgba(255,255,255,0.92)">o</text>
          <text x="128" y="14" fontSize="42" fontWeight="900" fill="white" filter="url(#glow2)">O</text>
          <text x="168" y="52" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.4)" letterSpacing="2">CHALLENGE</text>
        </svg>
      </div>

      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 44, textAlign: 'center', lineHeight: 1.7 }}>
        우상향 라이프 주인이 되는 날까지<br />함께 우라주 챌린지 킵고잉! 🌿
      </div>

      <div style={{ background: 'white', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 360 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#0A0A0A', marginBottom: 20 }}>
          {mode === 'login' ? '로그인' : mode === 'signup' ? '가입 신청' : '비밀번호 재설정'}
        </div>
        {mode === 'signup' && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>닉네임</div>
            <input
              style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }}
              placeholder="그룹에서 불릴 이름"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={10}
            />
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>이메일</div>
        <input
          style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }}
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>비밀번호</div>
        <input
          style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }}
          type="password"
          placeholder="8자 이상"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button
          style={{ width: '100%', background: '#0A0A0A', color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: 4, fontFamily: 'inherit' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '처리 중...' : mode === 'login' ? '로그인' : mode === 'signup' ? '가입 신청하기' : '재설정 링크 보내기'}
        </button>
        {message && (
          <div style={{ fontSize: 12, color: '#555', marginTop: 12, lineHeight: 1.6, textAlign: 'center' as const }}>{message}</div>
        )}
        <div style={{ textAlign: 'center' as const, marginTop: 16, fontSize: 13, color: '#999' }}>
          {mode === 'login' ? (
            <>
              <div style={{ marginBottom: 8 }}>
                <span>아직 계정이 없어요?{' '}
                  <button style={{ color: '#0A0A0A', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, fontFamily: 'inherit' }} onClick={() => { setMode('signup'); setMessage('') }}>가입 신청</button>
                </span>
              </div>
              <div>
                <button style={{ color: '#999', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontSize: 12, fontFamily: 'inherit' }} onClick={() => { setMode('forgot'); setMessage('') }}>비밀번호를 잊으셨나요?</button>
              </div>
            </>
          ) : mode === 'signup' ? (
            <span>이미 계정이 있어요?{' '}
              <button style={{ color: '#0A0A0A', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, fontFamily: 'inherit' }} onClick={() => { setMode('login'); setMessage('') }}>로그인</button>
            </span>
          ) : (
            <span>
              <button style={{ color: '#0A0A0A', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, fontFamily: 'inherit' }} onClick={() => { setMode('login'); setMessage('') }}>← 로그인으로 돌아가기</button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
