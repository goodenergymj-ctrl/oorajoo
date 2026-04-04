'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RecruitPage() {
  const [step, setStep] = useState<'landing' | 'form' | 'done'>('landing')
  const [form, setForm] = useState({ name: '', nickname: '', email: '', pledge: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.nickname.trim() || !form.email.trim() || !form.pledge.trim()) {
      setError('모든 항목을 입력해주세요')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('올바른 이메일 주소를 입력해주세요')
      return
    }
    setSubmitting(true)
    setError('')

    const { data: cohort } = await supabase
      .from('cohorts')
      .select('id')
      .eq('is_recruiting', true)
      .limit(1)
      .maybeSingle()

    const { error: insertError } = await supabase
      .from('recruit_applications')
      .insert({
        cohort_id: cohort?.id || null,
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        email: form.email.trim(),
        pledge: form.pledge.trim(),
      })

    setSubmitting(false)
    if (insertError) {
      setError('신청 중 오류가 발생했어요. 다시 시도해주세요.')
      return
    }
    setStep('done')
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    body{background:#0A0A0A;font-family:'Noto Sans KR',system-ui,sans-serif;}
    input,textarea,button{font-family:inherit;}
    input:focus,textarea:focus{outline:none;}
    button{cursor:pointer;}
    ::placeholder{color:rgba(255,255,255,0.25);}
  `

  // ── 완료 화면 ──
  if (step === 'done') return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>🌿</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 12, letterSpacing: '-0.5px', lineHeight: 1.3 }}>
          신청이 완료됐어요!
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 32 }}>
          검토 후 이메일로 안내드릴게요.<br />
          5월 7일을 기대해주세요 🙌
        </div>
        <a href="https://blog.naver.com/oorajoo" target="_blank" rel="noreferrer"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: '10px 22px', fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
          우라주 블로그 구경하기 →
        </a>
      </div>
    </>
  )

  // ── 신청 폼 ──
  if (step === 'form') return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setStep('landing')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, lineHeight: 1, padding: 0 }}>←</button>
          <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>1기 신청하기</span>
        </div>

        <div style={{ padding: '28px 22px', maxWidth: 480, margin: '0 auto' }}>
          {[
            { key: 'name',     label: '이름',                          placeholder: '실명을 입력해주세요',             type: 'input' },
            { key: 'nickname', label: '앱에서 사용할 닉네임',          placeholder: '그룹에서 불릴 이름 (최대 10자)', type: 'input' },
            { key: 'email',    label: '이메일',                        placeholder: '안내 메일 받을 주소',             type: 'input' },
            { key: 'pledge',   label: '30일 챌린지를 신청하는 이유 한 줄', placeholder: '짧아도 좋아요. 솔직하게 써주세요!', type: 'textarea' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 8 }}>{label}</div>
              {type === 'textarea'
                ? <textarea
                    rows={3}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '13px 16px', fontSize: 14, color: 'white', resize: 'none', lineHeight: 1.7 }}
                  />
                : <input
                    type={key === 'email' ? 'email' : 'text'}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    maxLength={key === 'nickname' ? 10 : undefined}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '13px 16px', fontSize: 14, color: 'white' }}
                  />
              }
            </div>
          ))}

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#FCA5A5', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: '100%', background: submitting ? 'rgba(255,255,255,0.1)' : 'white', color: submitting ? 'rgba(255,255,255,0.3)' : '#0A0A0A', border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 900, marginTop: 4 }}
          >
            {submitting ? '신청 중...' : '신청 완료하기 🌿'}
          </button>

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 14, lineHeight: 1.7 }}>
            신청 후 검토를 거쳐 개별 안내드려요.<br />
            무료 챌린지예요 · 5월 5일 마감
          </div>
        </div>
      </div>
    </>
  )

  // ── 랜딩 페이지 ──
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Noto Sans KR', system-ui" }}>

        {/* 히어로 */}
        <div style={{ padding: '60px 24px 48px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>2025 · 1기 모집 중</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: 'white', lineHeight: 1.25, letterSpacing: '-1px', marginBottom: 16 }}>
            30일 동안<br />우상향 라이프를<br />함께 만들어요
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 36 }}>
            매일 감사와 목표를 기록하고<br />
            좋은 동료들과 함께 성장하는<br />
            소수 정예 30일 챌린지
          </div>
          <button
            onClick={() => setStep('form')}
            style={{ background: 'white', color: '#0A0A0A', border: 'none', borderRadius: 18, padding: '16px 40px', fontSize: 16, fontWeight: 900, boxShadow: '0 8px 32px rgba(255,255,255,0.15)', letterSpacing: '-0.3px' }}
          >
            1기 신청하기 →
          </button>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>
            소수 정예 12명 · 무료 · 5월 7일 시작
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />

        {/* 특징 */}
        <div style={{ padding: '44px 24px', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: 24, textAlign: 'center' }}>WHAT YOU GET</div>
          {[
            { emoji: '🙏', title: '하루의 시작과 마무리',       desc: '감사 한 줄, 목표 한 줄.\n작지만 강력한 루틴을 만들어요.' },
            { emoji: '✦',  title: '미래지향적 AI 질문',         desc: '매일 달라지는 우상향 질문으로\n더 나은 나를 발견해요.' },
            { emoji: '👥', title: '소수 정예 동료들',            desc: '12명의 진심 어린 멤버들과\n서로 자극하고 응원해요.' },
            { emoji: '🧭', title: '전문 코치의 코칭 타임',       desc: '필요할 때 전문 코치이자\n버크만 디브리퍼 우라주와 함께해요.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}>
                {emoji}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'white', marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, whiteSpace: 'pre-line' as const }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />

        {/* 일정 */}
        <div style={{ padding: '44px 24px', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: 24, textAlign: 'center' }}>SCHEDULE</div>
          {[
            { date: '~5월 5일',  label: '신청 마감',       active: true },
            { date: '5월 7일',   label: '1기 챌린지 시작', active: false },
            { date: '6월 5일',   label: '30일 완주 🎉',    active: false },
          ].map(({ date, label, active }) => (
            <div key={date} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#4ADE80' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: active ? 'white' : 'rgba(255,255,255,0.4)' }}>{label}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div style={{ padding: '0 24px 64px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '32px 24px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' }}>
              진정한 우상향 라이프,<br />함께 시작해요 🌿
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 24, lineHeight: 1.7 }}>
              소수 정예 12명 · 선착순 마감
            </div>
            <button
              onClick={() => setStep('form')}
              style={{ width: '100%', background: 'white', color: '#0A0A0A', border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 900 }}
            >
              지금 신청하기 →
            </button>
          </div>
          <div style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>
            © 2025 우라주 · oorajoo.kr
          </div>
        </div>

      </div>
    </>
  )
}
