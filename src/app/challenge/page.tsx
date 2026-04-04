'use client'

import { useState, useEffect } from 'react'
import { supabase, type Cohort } from '@/lib/supabase'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  textarea,input,button{font-family:inherit;}
  textarea:focus,input:focus{outline:none;}
  button{cursor:pointer;}
  body{background:#F7F7F7;font-family:'Noto Sans KR',system-ui,sans-serif;}
  .page{max-width:390px;margin:0 auto;min-height:100vh;background:#F7F7F7;}
  .hero{background:#0A0A0A;padding:56px 24px 52px;position:relative;overflow:hidden;}
  .hero-blob1{position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.03);}
  .hero-blob2{position:absolute;bottom:-60px;left:-30px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.02);}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:5px 12px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:0.5px;margin-bottom:20px;}
  .hero-dot{width:6px;height:6px;border-radius:50%;background:#4ADE80;box-shadow:0 0 0 3px rgba(74,222,128,0.25);}
  .hero-title{font-size:30px;font-weight:900;color:white;letter-spacing:-0.5px;line-height:1.2;margin-bottom:14px;}
  .hero-title em{font-style:normal;color:#4ADE80;}
  .hero-desc{font-size:14px;color:rgba(255,255,255,0.55);line-height:1.75;margin-bottom:24px;}
  .hero-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .hero-badge{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:5px 12px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);}
  .section{padding:28px 18px 0;}
  .section-title{font-size:10px;font-weight:700;color:#999;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;}
  .feature-grid{display:flex;flex-direction:column;gap:10px;}
  .feature-card{background:white;border:1px solid #E0E0E0;border-radius:16px;padding:18px 18px;display:flex;align-items:flex-start;gap:14px;}
  .feature-icon{font-size:24px;flex-shrink:0;margin-top:1px;}
  .feature-title{font-size:14px;font-weight:900;color:#0A0A0A;margin-bottom:4px;}
  .feature-desc{font-size:12.5px;color:#555;line-height:1.65;}
  .schedule-card{background:white;border:1px solid #E0E0E0;border-radius:16px;overflow:hidden;}
  .schedule-row{display:flex;align-items:center;padding:14px 18px;border-bottom:1px solid #F0F0F0;}
  .schedule-row:last-child{border-bottom:none;}
  .schedule-label{font-size:12px;font-weight:700;color:#999;flex:1;}
  .schedule-value{font-size:13px;font-weight:900;color:#0A0A0A;}
  .cohort-card{background:white;border:1px solid #E0E0E0;border-radius:18px;overflow:hidden;margin-top:0;}
  .cohort-header{background:#0A0A0A;padding:16px 18px;display:flex;align-items:center;gap:8px;}
  .cohort-dot{width:8px;height:8px;border-radius:50%;background:#4ADE80;box-shadow:0 0 0 3px rgba(74,222,128,0.25);flex-shrink:0;}
  .cohort-recruiting{font-size:10px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:1px;}
  .cohort-body{padding:18px;}
  .cohort-name{font-size:20px;font-weight:900;color:#0A0A0A;margin-bottom:6px;}
  .cohort-meta{font-size:12px;color:#999;line-height:1.65;margin-bottom:18px;}
  .apply-btn{width:100%;background:#0A0A0A;color:white;border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:900;cursor:pointer;}
  .empty-card{background:white;border:1px solid #E0E0E0;border-radius:18px;padding:32px 20px;text-align:center;}
  .empty-icon{font-size:36px;margin-bottom:12px;}
  .empty-title{font-size:15px;font-weight:900;color:#0A0A0A;margin-bottom:6px;}
  .empty-desc{font-size:13px;color:#999;line-height:1.65;margin-bottom:18px;}
  .notify-btn{display:inline-flex;align-items:center;gap:6px;background:#0A0A0A;color:white;border:none;border-radius:20px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;}
  .closing{background:#0A0A0A;margin:24px 18px;border-radius:18px;padding:28px 22px;text-align:center;}
  .closing-text{font-size:17px;font-weight:900;color:white;line-height:1.4;margin-bottom:6px;}
  .closing-sub{font-size:12px;color:rgba(255,255,255,0.4);}
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:flex-end;justify-content:center;z-index:100;backdrop-filter:blur(4px);}
  .modal{background:white;border-radius:24px 24px 0 0;padding:22px 20px 44px;width:100%;max-width:390px;max-height:90vh;overflow-y:auto;}
  .modal-handle{width:32px;height:3px;background:#C8C8C8;border-radius:4px;margin:0 auto 20px;}
  .modal-title{font-size:18px;font-weight:900;color:#0A0A0A;margin-bottom:4px;}
  .modal-sub{font-size:12px;color:#999;margin-bottom:22px;}
  .field-label{font-size:10px;font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px;}
  .field-input{width:100%;background:#F7F7F7;border:1.5px solid #E0E0E0;border-radius:12px;padding:12px 14px;font-size:14px;color:#0A0A0A;margin-bottom:14px;transition:border-color 0.2s;}
  .field-input:focus{border-color:#0A0A0A;}
  .field-ta{width:100%;background:#F7F7F7;border:1.5px solid #E0E0E0;border-radius:12px;padding:12px 14px;font-size:14px;color:#0A0A0A;resize:none;line-height:1.7;margin-bottom:20px;transition:border-color 0.2s;}
  .field-ta:focus{border-color:#0A0A0A;}
  .submit-btn{width:100%;background:#0A0A0A;color:white;border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:900;cursor:pointer;margin-bottom:10px;}
  .submit-btn:disabled{background:#E0E0E0;color:#999;cursor:default;}
  .cancel-btn{width:100%;background:none;border:none;font-size:13px;color:#999;padding:10px;cursor:pointer;}
  .done-wrap{text-align:center;padding:16px 0 8px;}
  .done-icon{font-size:52px;margin-bottom:14px;}
  .done-title{font-size:20px;font-weight:900;color:#0A0A0A;margin-bottom:8px;}
  .done-desc{font-size:13px;color:#555;line-height:1.75;margin-bottom:24px;}
  .back-btn{display:inline-flex;align-items:center;gap:6px;background:#0A0A0A;color:white;border:none;border-radius:20px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;text-decoration:none;}
  .no-login{background:#F7F7F7;border:1px solid #E0E0E0;border-radius:12px;padding:14px 16px;font-size:13px;color:#555;line-height:1.65;text-align:center;margin-bottom:18px;}
  .login-link{color:#0A0A0A;font-weight:700;text-decoration:underline;}
  .footer{padding:32px 18px 48px;text-align:center;font-size:11px;color:#bbb;}
`

export default function ChallengePage() {
  const [recruitingCohorts, setRecruitingCohorts] = useState<Cohort[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<{ nickname: string } | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null)
  const [name, setName] = useState('')
  const [pledge, setPledge] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user?.id) {
        supabase.from('profiles').select('nickname').eq('id', data.session.user.id).single()
          .then(({ data: p }) => { if (p) setUserProfile(p as any) })
      }
    })
    supabase.from('cohorts').select('*').eq('is_recruiting', true).then(({ data }) => {
      if (data) setRecruitingCohorts(data as Cohort[])
      setLoading(false)
    })
  }, [])

  const openApply = (cohort: Cohort) => {
    setSelectedCohort(cohort)
    setName('')
    setPledge('')
    setDone(false)
    setShowModal(true)
  }

  const handleApply = async () => {
    if (!name.trim() || !pledge.trim() || !selectedCohort || !session) return
    setSubmitting(true)
    await supabase.from('recruit_applications').insert({
      cohort_id: selectedCohort.id,
      name: name.trim(),
      nickname: userProfile?.nickname || '',
      email: session.user.email || '',
      pledge: pledge.trim(),
      status: 'pending',
    })
    setSubmitting(false)
    setDone(true)
  }

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* ① 히어로 */}
        <div className="hero">
          <div className="hero-blob1" />
          <div className="hero-blob2" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              모집 중
            </div>
            <div className="hero-title">30일 동안<br /><em>우상향 라이프</em>를<br />함께 만들어요</div>
            <div className="hero-desc">
              매일 감사와 목표를 기록하고<br />
              좋은 동료들과 함께 성장하는<br />
              소수 정예 30일 챌린지
            </div>
            <div className="hero-meta">
              <span className="hero-badge">소수 정예 12명</span>
              <span className="hero-badge">무료</span>
            </div>
          </div>
        </div>

        {/* ② WHAT YOU GET */}
        <div className="section">
          <div className="section-title">What You Get</div>
          <div className="feature-grid">
            {[
              { icon: '📝', title: '하루의 시작과 마무리', desc: '감사 한 줄, 목표 한 줄. 작지만 강력한 루틴을 만들어요.' },
              { icon: '✨', title: '미래지향적 AI 질문', desc: '매일 달라지는 우상향 질문으로 더 나은 나를 발견해요.' },
              { icon: '🤝', title: '소수 정예 동료들', desc: '12명의 진심 어린 멤버들과 서로 자극하고 응원해요.' },
              { icon: '🎯', title: '전문 코치의 코칭 타임', desc: '필요할 때 전문 코치이자 버크만 디브리퍼 우라주 코치와 함께해요.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <span className="feature-icon">{icon}</span>
                <div>
                  <div className="feature-title">{title}</div>
                  <div className="feature-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ③ 모집 중인 기수 */}
        <div className="section" style={{ paddingBottom: 12 }}>
          <div className="section-title">모집 현황</div>
          {loading ? (
            <div style={{ background: 'white', borderRadius: 18, padding: '28px 20px', border: '1px solid #E0E0E0', textAlign: 'center', color: '#bbb', fontSize: 13 }}>불러오는 중...</div>
          ) : recruitingCohorts.length > 0 ? (
            recruitingCohorts.map(cohort => (
              <div key={cohort.id} className="cohort-card" style={{ marginBottom: 12 }}>
                <div className="cohort-header">
                  <div className="cohort-dot" />
                  <span className="cohort-recruiting">지금 모집 중</span>
                </div>
                <div className="cohort-body">
                  <div className="cohort-name">{cohort.title || `${cohort.id}기`}</div>
                  <div className="cohort-meta">
                    {cohort.description && <>{cohort.description}<br /></>}
                    소수 정예 12명 · 무료
                    {cohort.start_date && <> · {new Date(cohort.start_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 시작</>}
                  </div>
                  <button className="apply-btn" onClick={() => openApply(cohort)}>
                    신청하기 🌿
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-card">
              <div className="empty-icon">🌱</div>
              <div className="empty-title">현재 모집 중인 기수가 없어요</div>
              <div className="empty-desc">다음 기수 오픈 시 알림을 받아보세요.<br />보통 기수 종료 1–2주 전에 공지해요.</div>
              <button className="notify-btn" onClick={() => window.open('https://instagram.com/oo.ra.joo', '_blank')}>
                🔔 알림 신청하기
              </button>
            </div>
          )}
        </div>

        {/* ④ 클로징 */}
        <div className="closing">
          <div className="closing-text">진정한 우상향 라이프,<br />함께 시작해요 🌿</div>
          <div className="closing-sub">우라주 챌린지와 함께라면 달라질 수 있어요</div>
        </div>

        <div className="footer">© 2025 우라주 · oorajoo.kr</div>
      </div>

      {/* ⑤ 신청 모달 */}
      {showModal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="modal">
            <div className="modal-handle" />
            {done ? (
              /* ⑥ 신청 완료 */
              <div className="done-wrap">
                <div className="done-icon">🌿</div>
                <div className="done-title">신청 완료!</div>
                <div className="done-desc">
                  보통 24시간 이내 승인돼요.<br />
                  그동안 앱에서 자유롭게 기록해봐요 🌿
                </div>
                <a href="/" className="back-btn">← 앱으로 돌아가기</a>
              </div>
            ) : (
              <>
                <div className="modal-title">기수 신청하기</div>
                <div className="modal-sub">{selectedCohort?.title || `${selectedCohort?.id}기`} · 소수 정예 30일 챌린지</div>

                {!session ? (
                  <>
                    <div className="no-login">
                      신청하려면 로그인이 필요해요.<br />
                      <a href="/login" className="login-link">로그인 후 신청해주세요 →</a>
                    </div>
                    <button className="cancel-btn" onClick={() => setShowModal(false)}>닫기</button>
                  </>
                ) : (
                  <>
                    <div className="field-label">이름 (실명) *</div>
                    <input
                      className="field-input"
                      placeholder="홍길동"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      maxLength={20}
                    />
                    <div className="field-label">30일 다짐 한 줄 *</div>
                    <textarea
                      className="field-ta"
                      rows={3}
                      placeholder="30일 동안 꼭 이루고 싶은 것, 또는 챌린지에 임하는 각오를 적어주세요."
                      value={pledge}
                      onChange={e => setPledge(e.target.value)}
                      maxLength={200}
                    />
                    <button
                      className="submit-btn"
                      onClick={handleApply}
                      disabled={!name.trim() || !pledge.trim() || submitting}
                    >
                      {submitting ? '신청 중...' : '신청하기 🌿'}
                    </button>
                    <button className="cancel-btn" onClick={() => setShowModal(false)}>취소</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
