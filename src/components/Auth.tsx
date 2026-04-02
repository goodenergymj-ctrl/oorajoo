'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SLIDES = [
  {
    bg: '#0A0A0A',
    accent: '#ffffff',
    icon: '📈',
    tag: 'DAILY LOG',
    title: '내 삶의\n우상향 로그',
    desc: '매일매일 꾸준한 기록으로\n성장하는 나를 만나요.',
    visual: (
      <svg viewBox="0 0 280 120" width="280" xmlns="http://www.w3.org/2000/svg">
        <polyline points="10,100 50,85 90,75 130,55 170,40 210,25 260,10"
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
        <polyline points="10,100 50,85 90,75 130,55 170,40 210,25 260,10"
          fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0"/>
        {[
          [50,85],[90,75],[130,55],[170,40],[210,25],[260,10]
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="white" opacity={0.6 + i * 0.07}/>
        ))}
        <text x="10" y="115" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="system-ui">Day 1</text>
        <text x="240" y="115" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="system-ui">Day 30</text>
      </svg>
    ),
  },
  {
    bg: '#0F1F3D',
    accent: '#7EB3FF',
    icon: '🔥',
    tag: '30-DAY CHALLENGE',
    title: '30일 챌린지로\n시작하는 변화',
    desc: '하루하루 쌓이는 기록이\n나를 단단하게 만들어요.',
    visual: (
      <svg viewBox="0 0 280 120" width="280" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 30 }, (_, i) => {
          const x = (i % 6) * 44 + 10
          const y = Math.floor(i / 6) * 22 + 10
          const done = i < 18
          return (
            <rect key={i} x={x} y={y} width="36" height="14" rx="4"
              fill={done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.1)'}/>
          )
        })}
        <text x="10" y="115" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="system-ui">18 / 30일 완료</text>
      </svg>
    ),
  },
  {
    bg: '#0D2B1A',
    accent: '#6FCF8E',
    icon: '🌿',
    tag: 'COMMUNITY',
    title: '함께라서\n더 오래 가요',
    desc: '감사·목표를 기록하고\n라운지에서 서로 응원해요.',
    visual: (
      <svg viewBox="0 0 280 120" width="280" xmlns="http://www.w3.org/2000/svg">
        {[
          { x: 10, y: 8, w: 180, text: '오늘 드디어 운동 시작했어요 💪', name: '민지' },
          { x: 50, y: 44, w: 200, text: '저도요! 같이 해봐요 🌿', name: '지우' },
          { x: 10, y: 80, w: 190, text: '30일 완주 응원합니다 🔥', name: '하은' },
        ].map(({ x, y, w, text, name }, i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height="28" rx="10" fill="rgba(255,255,255,0.1)"/>
            <text x={x + 10} y={y + 12} fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="system-ui" fontWeight="700">{name}</text>
            <text x={x + 10} y={y + 23} fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="system-ui">{text}</text>
          </g>
        ))}
      </svg>
    ),
  },
]

export default function Auth() {
  const [onboardingDone, setOnboardingDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('oorajoo_onboarding') === 'done'
    }
    return false
  })
  const [slide, setSlide] = useState(0)
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const finishOnboarding = () => {
    localStorage.setItem('oorajoo_onboarding', 'done')
    setOnboardingDone(true)
  }

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
      else setMessage('가입 완료! 이메일함에서 인증 링크를 확인해주세요 ✉️')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('이메일 또는 비밀번호를 확인해주세요')
    }
    setLoading(false)
  }

  // ─── 온보딩 슬라이드 ───────────────────────────────────────
  if (!onboardingDone) {
    const current = SLIDES[slide]
    return (
      <div style={{ minHeight: '100vh', background: current.bg, display: 'flex', flexDirection: 'column', fontFamily: 'system-ui', transition: 'background 0.5s ease', overflow: 'hidden' }}>

        {/* 상단 로고 */}
        <div style={{ padding: '52px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.5px' }}>우라주 챌린지</span>
          <button onClick={finishOnboarding} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>건너뛰기</button>
        </div>

        {/* 슬라이드 콘텐츠 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 28px 0' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '2.5px', marginBottom: 14 }}>{current.tag}</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: 'white', lineHeight: 1.25, letterSpacing: '-1px', marginBottom: 16, whiteSpace: 'pre-line' }}>{current.title}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40, whiteSpace: 'pre-line' }}>{current.desc}</div>

          {/* 비주얼 */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
            {current.visual}
          </div>
        </div>

        {/* 하단 */}
        <div style={{ padding: '0 28px 52px' }}>
          {/* 점 인디케이터 */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
            {SLIDES.map((_, i) => (
              <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 3, background: i === slide ? 'white' : 'rgba(255,255,255,0.25)', transition: 'all 0.3s', cursor: 'pointer' }} />
            ))}
          </div>

          {slide < SLIDES.length - 1 ? (
            <button
              onClick={() => setSlide(s => s + 1)}
              style={{ width: '100%', background: 'white', color: current.bg, border: 'none', borderRadius: 16, padding: '16px', fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              다음 →
            </button>
          ) : (
            <button
              onClick={finishOnboarding}
              style={{ width: '100%', background: 'white', color: current.bg, border: 'none', borderRadius: 16, padding: '16px', fontSize: 15, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              시작하기 🌿
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── 로그인 / 회원가입 ────────────────────────────────────
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
          {mode === 'login' ? '로그인' : mode === 'signup' ? '가입하기' : '비밀번호 재설정'}
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
        {mode !== 'forgot' && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>비밀번호</div>
            <input
              style={{ width: '100%', background: '#F7F7F7', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', marginBottom: 12, boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }}
              type="password"
              placeholder="8자 이상"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </>
        )}
        <button
          style={{ width: '100%', background: '#0A0A0A', color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: 4, fontFamily: 'inherit' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '처리 중...' : mode === 'login' ? '로그인' : mode === 'signup' ? '가입하기하기' : '재설정 링크 보내기'}
        </button>
        {message && (
          <div style={{ fontSize: 12, color: '#555', marginTop: 12, lineHeight: 1.6, textAlign: 'center' as const }}>{message}</div>
        )}
        <div style={{ textAlign: 'center' as const, marginTop: 16, fontSize: 13, color: '#999' }}>
          {mode === 'login' ? (
            <>
              <div style={{ marginBottom: 8 }}>
                <span>아직 계정이 없어요?{' '}
                  <button style={{ color: '#0A0A0A', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: 13, fontFamily: 'inherit' }} onClick={() => { setMode('signup'); setMessage('') }}>가입하기</button>
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
