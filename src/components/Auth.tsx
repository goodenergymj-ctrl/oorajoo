'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      if (!nickname.trim()) { setMessage('닉네임을 입력해주세요'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { nickname: nickname.trim() } }
      })
      if (error) setMessage(error.message)
      else setMessage('가입 신청이 완료됐어요! 관리자 승인 후 이용할 수 있어요 🌿')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('이메일 또는 비밀번호를 확인해주세요')
    }
    setLoading(false)
  }

  const s: Record<string, any> = {
    wrap: { minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Noto Sans KR', system-ui" },
    logo: { fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: 6 },
    sub: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 44, letterSpacing: '0.3px' },
    card: { background: 'white', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 360 },
    title: { fontSize: 18, fontWeight: 900, color: '#0A0A0A', marginBottom: 20, letterSpacing: '-0.4px' },
    label: { fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6, display: 'block' },
    input: { width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none' },
    btn: { width: '100%', background: '#0A0A0A', color: 'white', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 900, cursor: 'pointer', marginTop: 4 },
    toggle: { textAlign: 'center' as const, marginTop: 16, fontSize: 13, color: '#999' },
    toggleBtn: { color: '#0A0A0A', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: 13 },
    msg: { fontSize: 12, color: '#555', marginTop: 12, lineHeight: 1.6, textAlign: 'center' as const },
  }

  return (
    <div style={s.wrap}>
      <div style={s.logo}>OorajoO</div>
      <div style={s.sub}>우상향 라이프 주인이 되는 날까지</div>
