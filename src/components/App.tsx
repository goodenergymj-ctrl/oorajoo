'use client'

import { useState, useEffect } from 'react'
import { supabase, type Profile, type Cohort, type FeedItem, type LoungePost, type Notice } from '@/lib/supabase'

// ─── 아이콘 ────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor' }: { name: string; size?: number; color?: string }) => {
  const icons: Record<string, JSX.Element> = {
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    share: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    flame: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/></svg>,
    sprout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-2-3.7.7-.1 3.3-.2 4.5.3z"/><path d="M14.1 6a7 7 0 0 1 2 7.4c-1.8.2-3.2.1-4.5-.5"/></svg>,
  }
  return icons[name] || null
}

const CHEERS = [
  "어차피 오늘도 지나가요. 잘 버티면 그게 이기는 거예요.",
  "아무것도 안 한 것 같아도, 살아낸 거 맞아요.",
  "완벽한 하루보다 솔직한 하루가 더 오래 기억돼요.",
  "많이 안 해도 돼요. 조금씩 꾸준히가 결국 이겨요.",
  "그냥 버티는 것도 전략이에요. 꽤 좋은 전략이에요.",
  "잘 버틴 날이 쌓이면 단단해져요. 오늘도 그 하루예요.",
  "지금 이 감정도 지나가요. 항상 그랬잖아요.",
  "내가 포기하지 않으면, 언젠가는 꼭 돼요.",
  "오늘 하루 충분히 살았어요.",
  "지금 느리다고 틀린 게 아니에요. 각자의 속도가 있어요.",
]

const TAGS = ['#새벽기상', '#공부중', '#오늘의책', '#소확행', '#힘들다', '#운동', '#감사']
const REACT_CONFIG = [
  { key: '❤️', emoji: '❤️' },
  { key: '👍', emoji: '👍' },
  { key: '😭', emoji: '😭' },
  { key: '🔥', emoji: '🔥' },
]

// ─── 메인 앱 ────────────────────────────────────────────────────
export default function App({ session }: { session: any }) {

  // ─── State (모두 최상단) ────────────────────────────────────
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [lounge, setLounge] = useState<LoungePost[]>([])
  const [notice, setNotice] = useState<Notice | null>(null)
  const [question, setQuestion] = useState('')
  const [qLoading, setQLoading] = useState(true)
  const [viewingCohortId, setViewingCohortId] = useState<number | null>(null)
  const [pendingMembers, setPendingMembers] = useState<any[]>([])
  const [cohortMembers, setCohortMembers] = useState<Profile[]>([])
  const [tab, setTab] = useState('today')

  // 온보딩
  const [obNickname, setObNickname] = useState('')
  const [obIntro, setObIntro] = useState('')
  const [obThreads, setObThreads] = useState('')
  const [obInsta, setObInsta] = useState('')
  const [obNaver, setObNaver] = useState('')
  const [obSaving, setObSaving] = useState(false)

  // 기수 선택
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null)
  const [applyingCohort, setApplyingCohort] = useState(false)

  // 기록
  const [myRecord, setMyRecord] = useState({ gratitude: '', goal: '', question_answer: '', is_private: false })
  const [submitted, setSubmitted] = useState(false)
  const [cheerMsg] = useState(() => CHEERS[Math.floor(Math.random() * CHEERS.length)])

  // 라운지
  const [newPost, setNewPost] = useState('')
  const [postTags, setPostTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')
  const [showCustomTag, setShowCustomTag] = useState(false)
  const [postImage, setPostImage] = useState<File | null>(null)
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null)
  const [showPostInput, setShowPostInput] = useState(false)

  // UI
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
  const [commentInput, setCommentInput] = useState<Record<number, string>>({})
  const [reactions, setReactions] = useState<Record<string, boolean>>({})
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({})
  const [shareModal, setShareModal] = useState<{ text: string; url: string } | null>(null)
  const [copiedShare, setCopiedShare] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminTab, setAdminTab] = useState('notice')
  const [adminForm, setAdminForm] = useState({ title: '', body: '', link: '', hasPoll: false, pollQ: '', pollOptions: ['', ''] })
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editingPostText, setEditingPostText] = useState('')
  const [editingPostType, setEditingPostType] = useState<'feed' | 'lounge' | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // ─── 파생값 ────────────────────────────────────────────────
  const myCohortId = viewingCohortId || profile?.cohort_id || cohorts.find(c => c.status === 'active')?.id || 0
  const myCohort = cohorts.find(c => c.id === myCohortId)
  const isEnded = myCohort?.status === 'ended'
  const isAdmin = profile?.is_admin || false
  const myFeed = feed.filter(f => f.cohort_id === myCohortId)

  // ─── 데이터 로드 ────────────────────────────────────────────
  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    setProfile(data)
    setProfileLoaded(true)
  }

  const loadCohorts = async () => {
    const { data } = await supabase.from('cohorts').select('*').order('id')
    if (data) setCohorts(data)
  }

  const checkTodaySubmitted = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('feed')
      .select('id')
      .eq('user_id', session.user.id)
      .gte('created_at', today + 'T00:00:00')
      .limit(1)
    if (data && data.length > 0) setSubmitted(true)
  }
  const loadFeed = async () => {
    if (!myCohortId) return
    const { data } = await supabase
      .from('feed')
      .select('*, profiles(*), comments(*, profiles(nickname))')
      .eq('cohort_id', myCohortId)
      .order('created_at', { ascending: false })
    if (data) setFeed(data as FeedItem[])
  }

  const loadLounge = async () => {
    if (!myCohortId) return
    const { data } = await supabase
      .from('lounge')
      .select('*, profiles(*)')
      .eq('cohort_id', myCohortId)
      .order('created_at', { ascending: false })
    if (data) setLounge(data as LoungePost[])
  }

  const loadNotice = async () => {
    const { data } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data) setNotice(data)
  }

  const loadReactions = async () => {
    const { data } = await supabase.from('reactions').select('*')
    if (data) {
      const counts: Record<string, number> = {}
      const myR: Record<string, boolean> = {}
      data.forEach((r: any) => {
        const k = `${r.target_type}-${r.target_id}-${r.emoji}`
        counts[k] = (counts[k] || 0) + 1
        if (r.user_id === session.user.id) myR[k] = true
      })
      setReactionCounts(counts)
      setReactions(myR)
    }
  }
  const loadCohortMembers = async () => {
    if (!myCohortId) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('cohort_id', myCohortId)
      .eq('is_approved', true)
    if (data) setCohortMembers(data as Profile[])
  }
  const loadPending = async () => {
    const { data } = await supabase
      .from('pending_members')
      .select('*, profiles(*)')
      .order('created_at')
    if (data) setPendingMembers(data)
  }

  const fetchQuestion = async () => {
    setQLoading(true)
    try {
      const res = await fetch('/api/question')
      const data = await res.json()
      setQuestion(data.question)
    } catch {
      setQuestion('10년 후의 나는 오늘의 어떤 선택에 가장 감사할까요?')
    }
    setQLoading(false)
  }

  useEffect(() => {
    loadProfile()
    loadCohorts()
    fetchQuestion()
    window.addEventListener('online', () => setIsOnline(true))
    window.addEventListener('offline', () => setIsOnline(false))
  }, [])

  useEffect(() => {
    if (myCohortId) {
      loadFeed()
      loadLounge()
      loadNotice()
      checkTodaySubmitted()
      loadReactions()
      loadCohortMembers()
    }
  }, [myCohortId])

  useEffect(() => {
    if (isAdmin) loadPending()
  }, [isAdmin])

  useEffect(() => {
    const channel = supabase.channel('realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feed' }, loadFeed)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lounge' }, loadLounge)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [myCohortId])

  // ─── 핸들러 ────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!obNickname.trim()) return
    setObSaving(true)
    // 기존 프로필 있는지 확인
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()
    
    let error
    if (existing) {
      const result = await supabase.from('profiles').update({
        nickname: obNickname.trim(),
        intro: obIntro.trim() || '안녕하세요!',
        threads_id: obThreads.trim() || null,
        insta_id: obInsta.trim() || null,
        naver_blog: obNaver.trim() || null,
      }).eq('id', session.user.id)
      error = result.error
    } else {
      const result = await supabase.from('profiles').insert({
        id: session.user.id,
        nickname: obNickname.trim(),
        intro: obIntro.trim() || '안녕하세요!',
        threads_id: obThreads.trim() || null,
        insta_id: obInsta.trim() || null,
        naver_blog: obNaver.trim() || null,
        is_admin: false,
        is_approved: false,
        color: ['#1A1A1A', '#2D4A7A', '#5C3D7A', '#7A3D3D', '#2D6B4A', '#6B4A2D', '#3D5C7A', '#7A5C2D'][Math.floor(Math.random() * 8)],
        tags: [],
        streak: 0,
      })
      error = result.error
    }
    
    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      await loadProfile()
    }
    setObSaving(false)
  }

  const applyCohort = async () => {
    if (!selectedCohortId) return
    setApplyingCohort(true)
    
    // pending_members에 추가
    const { data: existing } = await supabase
      .from('pending_members')
      .select('id')
      .eq('user_id', session.user.id)
      .single()
    
    if (existing) {
      await supabase.from('pending_members').update({ cohort_id: selectedCohortId }).eq('user_id', session.user.id)
    } else {
      await supabase.from('pending_members').insert({
        user_id: session.user.id,
        nickname: profile?.nickname || '',
        cohort_id: selectedCohortId,
      })
    }
    
    // 프로필에 cohort_id 임시 저장 (승인 전 상태 표시용)
    await supabase.from('profiles').update({ cohort_id: selectedCohortId }).eq('id', session.user.id)
    await loadProfile()
    setApplyingCohort(false)
  }

  const submitRecord = async () => {
    if (!myRecord.gratitude.trim() || !myRecord.goal.trim() || !myRecord.question_answer.trim()) return
    const { error } = await supabase.from('feed').insert({
      user_id: session.user.id,
      cohort_id: myCohortId,
      gratitude: myRecord.gratitude,
      goal: myRecord.goal,
      question_answer: myRecord.question_answer,
      is_private: myRecord.is_private,
    })
    if (!error) { setSubmitted(true); loadFeed() }
  }

  const handleReact = async (type: 'feed' | 'lounge', targetId: number, emoji: string) => {
    const key = `${type}-${targetId}-${emoji}`, on = reactions[key]
    if (on) {
      await supabase.from('reactions').delete()
        .eq('user_id', session.user.id).eq('target_type', type).eq('target_id', targetId).eq('emoji', emoji)
    } else {
      await supabase.from('reactions').insert({ user_id: session.user.id, target_type: type, target_id: targetId, emoji })
    }
   setReactions(p => ({ ...p, [key]: !on }))
    loadReactions()
  }

  const submitComment = async (feedId: number) => {
    const text = (commentInput[feedId] || '').trim()
    if (!text) return
    await supabase.from('comments').insert({ user_id: session.user.id, feed_id: feedId, content: text })
    setCommentInput(p => ({ ...p, [feedId]: '' }))
    loadFeed()
  }

  const submitPost = async () => {
    if (!newPost.trim()) return
    let imageUrl = null
    if (postImage) {
      const fd = new FormData(); fd.append('file', postImage)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await res.json(); imageUrl = d.url
    }
    await supabase.from('lounge').insert({
      user_id: session.user.id, cohort_id: myCohortId,
      content: newPost, tag: postTags.join(' ') || null, image_url: imageUrl,
    })
    setNewPost(''); setPostTags([]); setPostImage(null); setPostImagePreview(null); setShowPostInput(false)
    loadLounge()
  }

  const openShare = (item: any, type: 'feed' | 'lounge') => {
    const name = (item.profiles as Profile)?.nickname || ''
    const url = `${window.location.origin}/${type}/${item.id}`
    const text = type === 'feed'
      ? `${name}의 우라주 챌린지\n\n🙏 ${item.gratitude}\n🎯 ${item.goal}\n\n"${item.question_answer}"\n\n#우라주챌린지\n${url}`
      : `${name}의 우라주 챌린지 라운지\n\n${item.tag || ''} ${item.content}\n\n#우라주챌린지\n${url}`
    setShareModal({ text, url })
  }

  const doShare = async () => {
    if (!shareModal) return
    if (navigator.share) {
      try { await navigator.share({ title: '우라주 챌린지', text: shareModal.text, url: shareModal.url }); setShareModal(null); return } catch {}
    }
    try { await navigator.clipboard.writeText(shareModal.text) } catch {}
    setCopiedShare(true)
    setTimeout(() => { setCopiedShare(false); setShareModal(null) }, 2000)
  }

  const submitNotice = async () => {
    if (!adminForm.title.trim() || !adminForm.body.trim()) return
    const poll = adminForm.hasPoll && adminForm.pollQ.trim()
      ? { question: adminForm.pollQ, options: adminForm.pollOptions.filter(o => o.trim()), votes: Object.fromEntries(adminForm.pollOptions.filter(o => o.trim()).map(o => [o, 0])), myVotes: [] }
      : null
    await supabase.from('notices').insert({ title: adminForm.title, body: adminForm.body, link: adminForm.link || null, poll, cohort_id: myCohortId })
    setAdminForm({ title: '', body: '', link: '', hasPoll: false, pollQ: '', pollOptions: ['', ''] })
    setShowAdmin(false); loadNotice()
  }

  const approveMember = async (pendingId: number, userId: string, targetCohortId: number) => {
    await supabase.from('profiles').update({ cohort_id: targetCohortId, is_approved: true }).eq('id', userId)
     await supabase.from('pending_members').delete().eq('id', pendingId)
    loadPending()
    loadCohortMembers()
    loadPending()
  }

  const saveCohort = async () => {
    if (!editingCohort) return
    await supabase.from('cohorts').update({ start_date: editingCohort.start_date, end_date: editingCohort.end_date, status: editingCohort.status }).eq('id', editingCohort.id)
    setEditingCohort(null); loadCohorts()
  }

  const saveProfileEdit = async () => {
    const tags = typeof editData.tags === 'string'
      ? editData.tags.split(' ').filter((t: string) => t.startsWith('#'))
      : editData.tags
    await supabase.from('profiles').update({ nickname: editData.nickname, intro: editData.intro, tags, threads_id: editData.threads_id || null, insta_id: editData.insta_id || null, naver_blog: editData.naver_blog || null }).eq('id', session.user.id)
    loadProfile(); setEditingProfile(false); setSelectedProfile(null)
  }

    const deletePost = async (id: number, type: 'feed' | 'lounge') => {
    if (!confirm('정말 삭제할까요?')) return
    await supabase.from(type).delete().eq('id', id)
    type === 'feed' ? loadFeed() : loadLounge()
  }

  const startEditPost = (id: number, text: string, type: 'feed' | 'lounge') => {
    setEditingPostId(id)
    setEditingPostText(text)
    setEditingPostType(type)
  }

  const saveEditPost = async () => {
    if (!editingPostId || !editingPostType) return
    if (editingPostType === 'lounge') {
      await supabase.from('lounge').update({ content: editingPostText }).eq('id', editingPostId)
      loadLounge()
    }
    setEditingPostId(null); setEditingPostText(''); setEditingPostType(null)
  }
  const formatTime = (ts: string) => {
    const d = new Date(ts), now = new Date(), diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  // ─── CSS ───────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    textarea,input,button,select{font-family:inherit;}
    textarea:focus,input:focus{outline:none;}
    button{cursor:pointer;}
    :root{
      --bg:#F7F7F7;--white:#FFF;--surface:#F0F0F0;
      --black:#0A0A0A;--ink:#1A1A1A;--ink2:#555;--ink3:#999;
      --border:#E0E0E0;--border2:#C8C8C8;
      --r:12px;--r2:18px;
      --sh:0 1px 3px rgba(0,0,0,0.06);--sh2:0 4px 16px rgba(0,0,0,0.10);
    }
    .app{max-width:390px;margin:0 auto;min-height:100vh;background:var(--bg);font-family:'Noto Sans KR',system-ui,sans-serif;color:var(--ink);padding-bottom:100px;}
    .offline{background:#333;color:white;text-align:center;padding:8px;font-size:11px;font-weight:700;}
    .hdr{padding:14px 18px 12px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;background:rgba(247,247,247,0.92);backdrop-filter:blur(18px);border-bottom:1px solid var(--border);}
    .hdr-wm{font-size:17px;font-weight:900;letter-spacing:-0.8px;color:var(--black);}
    .hdr-sub{font-size:10px;color:var(--ink3);margin-top:2px;}
    .hdr-r{display:flex;align-items:center;gap:8px;}
    .hdr-chip{background:var(--black);color:white;font-size:10px;font-weight:700;padding:5px 12px;border-radius:40px;}
    .tab-bar{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:358px;background:var(--white);border:1px solid var(--border2);border-radius:32px;display:flex;z-index:20;padding:5px;gap:2px;box-shadow:0 4px 20px rgba(0,0,0,0.08);}
    .tab-btn{flex:1;padding:9px 0 8px;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;font-size:9px;font-weight:700;letter-spacing:0.3px;border-radius:26px;transition:all 0.2s;color:var(--ink3);}
    .tab-btn.on{background:var(--black);color:white;}
    .write-section{padding:16px 16px 0;}
    .write-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);overflow:hidden;box-shadow:var(--sh);}
    .wc-bar{height:3px;background:var(--black);}
    .wc-inner{padding:16px 18px;}
    .wc-ta{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font-size:14px;color:var(--ink);resize:none;line-height:1.7;transition:border-color 0.2s;}
    .wc-ta:focus{border-color:var(--black);}
    .wc-ta::placeholder{color:var(--ink3);font-size:13px;}
    .wc-q-box{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 13px;margin-bottom:10px;}
    .wc-shimmer{height:13px;background:var(--border);border-radius:6px;margin-bottom:5px;animation:pulse 1.5s infinite;}
    .wc-shimmer.s{width:55%;}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.9}}
    .wc-submit{width:100%;background:var(--black);color:white;border:none;border-radius:12px;padding:14px;font-size:14px;font-weight:900;}
    .wc-submit:disabled{background:var(--border);color:var(--ink3);}
    .wc-done{text-align:center;padding:26px 18px 20px;}
    .wc-done-icon{width:50px;height:50px;background:var(--surface);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:1.5px solid var(--border2);}
    .wc-done-cheer{font-size:13px;color:var(--ink2);line-height:1.75;background:var(--surface);border-radius:12px;padding:12px 16px;border:1px solid var(--border);text-align:left;}
    .sec-label{padding:18px 16px 10px;font-size:13px;font-weight:900;color:var(--black);letter-spacing:-0.3px;display:flex;align-items:center;justify-content:space-between;}
    .sec-sub{font-size:11px;font-weight:600;color:var(--ink3);}
    .notice-card{margin:14px 16px 0;border-radius:var(--r2);overflow:hidden;box-shadow:var(--sh);}
    .notice-bar{background:var(--black);padding:8px 14px;display:flex;align-items:center;gap:7px;}
    .notice-bar-txt{font-size:10px;font-weight:800;color:white;letter-spacing:1px;text-transform:uppercase;}
    .notice-bar-date{font-size:10px;color:rgba(255,255,255,0.45);margin-left:auto;}
    .notice-body{background:var(--white);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--r2) var(--r2);padding:14px 16px;}
    .fc{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:16px;margin:0 16px 10px;box-shadow:var(--sh);}
    .fc-top{display:flex;align-items:center;gap:10px;margin-bottom:13px;}
    .av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0;cursor:pointer;font-size:12px;color:white;}
    .fc-badge{flex-shrink:0;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;margin-top:2px;white-space:nowrap;background:var(--surface);color:var(--ink2);}
    .fc-text{font-size:13px;color:var(--ink2);line-height:1.65;}
    .fc-q{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px;margin-top:2px;}
    .fc-q-lbl{font-size:9px;font-weight:700;color:var(--ink3);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;}
    .fc-q-txt{font-size:12px;color:var(--ink2);line-height:1.65;font-style:italic;}
    .react-bar{display:flex;gap:5px;padding-top:11px;border-top:1px solid var(--border);align-items:center;margin-top:12px;}
    .r-btn{display:flex;align-items:center;gap:4px;border:1px solid var(--border);border-radius:20px;padding:5px 10px;background:var(--bg);cursor:pointer;}
    .r-btn.on{background:var(--black);border-color:var(--black);}
    .r-cnt{font-size:11px;font-weight:700;color:var(--ink3);}
    .r-btn.on .r-cnt{color:white;}
    .cmt-btn{display:flex;align-items:center;gap:4px;background:none;border:none;font-size:11px;color:var(--ink3);font-weight:600;padding:5px 7px;border-radius:20px;cursor:pointer;}
    .cmt-area{margin-top:10px;padding-top:10px;border-top:1px solid var(--border);}
    .cmt-item{display:flex;gap:7px;margin-bottom:6px;}
    .cmt-author{font-size:12px;font-weight:700;color:var(--black);flex-shrink:0;}
    .cmt-text{font-size:12px;color:var(--ink2);line-height:1.5;}
    .cmt-row{display:flex;gap:6px;margin-top:8px;}
    .cmt-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:9px 12px;font-size:12px;color:var(--ink);}
    .cmt-input:focus{border-color:var(--black);}
    .cmt-send{background:var(--black);color:white;border:none;border-radius:10px;padding:0 13px;display:flex;align-items:center;cursor:pointer;}
    .lounge-hd{padding:16px 16px 0;display:flex;align-items:center;justify-content:space-between;}
    .lounge-t{font-size:20px;font-weight:900;letter-spacing:-0.5px;}
    .fab{display:flex;align-items:center;gap:6px;background:var(--black);color:white;border:none;border-radius:20px;padding:8px 16px;font-size:12px;font-weight:700;box-shadow:var(--sh2);cursor:pointer;}
    .post-box{margin:10px 16px 0;background:var(--white);border:1.5px solid var(--border2);border-radius:var(--r2);padding:14px;}
    .post-ta{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 13px;font-size:13px;color:var(--ink);resize:none;line-height:1.65;margin-bottom:10px;}
    .post-ta:focus{border-color:var(--black);}
    .tag-row{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;}
    .tag-chip{font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px;border:1px solid;background:none;cursor:pointer;}
    .tag-chip.sel{background:var(--black);color:white;border-color:var(--black);}
    .tag-chip.unsel{color:var(--ink3);border-color:var(--border);}
    .lc{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);margin:10px 16px 0;overflow:hidden;box-shadow:var(--sh);}
    .lc-body{padding:13px;}
    .lc-top{display:flex;align-items:center;gap:8px;margin-bottom:9px;}
    .lc-tag{display:inline-flex;font-size:10px;font-weight:700;color:var(--black);background:var(--surface);padding:3px 9px;border-radius:20px;margin-bottom:7px;border:1px solid var(--border);}
    .lc-text{font-size:13px;color:var(--ink2);line-height:1.7;margin-bottom:10px;}
    .streak-hero{margin:16px 16px 12px;background:var(--black);border-radius:var(--r2);padding:20px;position:relative;overflow:hidden;}
    .sh-blob{position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.04);}
    .sh-bar-bg{height:3px;background:rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;margin-bottom:14px;}
    .sh-bar-fill{height:100%;background:white;border-radius:3px;}
    .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 16px 14px;}
    .stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:13px;}
    .hist-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:15px;margin:0 16px 9px;}
    .hist-date{font-size:9px;font-weight:700;color:var(--ink3);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:11px;}
    .group-hero{margin:16px 16px 12px;background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:18px;box-shadow:var(--sh);}
    .mc{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:15px;margin:0 16px 9px;cursor:pointer;transition:all 0.18s;box-shadow:var(--sh);}
    .mc-top{display:flex;align-items:center;gap:11px;margin-bottom:9px;}
    .mc-av{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:white;flex-shrink:0;}
    .settings-section{margin:16px 16px 0;}
    .settings-title{font-size:11px;font-weight:700;color:var(--ink3);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
    .settings-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);overflow:hidden;}
    .settings-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer;}
    .settings-row:last-child{border-bottom:none;}
    .settings-row-label{font-size:13px;font-weight:600;color:var(--black);flex:1;}
    .settings-row-sub{font-size:11px;color:var(--ink3);margin-top:1px;}
    .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:flex-end;justify-content:center;z-index:100;backdrop-filter:blur(4px);}
    .modal{background:var(--white);border-radius:24px 24px 0 0;padding:22px 20px 44px;width:100%;max-width:390px;max-height:90vh;overflow-y:auto;}
    .modal-handle{width:32px;height:3px;background:var(--border2);border-radius:4px;margin:0 auto 20px;}
    .share-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:flex-end;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
    .share-modal{background:var(--white);border-radius:24px 24px 0 0;padding:22px 20px 44px;width:100%;max-width:390px;}
    .admin-fab{position:fixed;bottom:96px;right:20px;width:44px;height:44px;border-radius:50%;background:var(--black);border:none;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.25);z-index:15;cursor:pointer;}
    .admin-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center;}
    .admin-bg{position:absolute;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(3px);}
    .admin-panel{position:relative;background:var(--white);border-radius:24px 24px 0 0;padding:22px 20px 48px;width:100%;max-width:390px;max-height:90vh;overflow-y:auto;}
    .admin-handle{width:32px;height:3px;background:var(--border2);border-radius:4px;margin:0 auto 18px;}
    .admin-tabs{display:flex;gap:5px;margin-bottom:16px;}
    .admin-tab{flex:1;padding:8px 0;font-size:11px;font-weight:700;border-radius:10px;border:1.5px solid var(--border);background:none;color:var(--ink3);cursor:pointer;}
    .admin-tab.on{background:var(--black);color:white;border-color:var(--black);}
    .admin-input{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:10px 13px;font-size:13px;color:var(--ink);margin-bottom:10px;}
    .admin-ta{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:10px 13px;font-size:13px;color:var(--ink);resize:none;line-height:1.65;margin-bottom:10px;}
    .admin-toggle{display:flex;align-items:center;gap:10px;padding:11px 0;margin-bottom:7px;border-top:1px solid var(--border);}
    .toggle-btn{width:42px;height:24px;border-radius:12px;border:none;position:relative;cursor:pointer;flex-shrink:0;}
    .toggle-btn.on{background:var(--black);}
    .toggle-btn.off{background:var(--border2);}
    .toggle-dot{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:white;transition:left 0.2s;}
    .toggle-btn.on .toggle-dot{left:21px;}
    .toggle-btn.off .toggle-dot{left:3px;}
    .confirm-bg{position:fixed;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
    .policy-page{min-height:100vh;background:var(--bg);}
    .policy-hdr{background:var(--black);padding:18px;display:flex;align-items:center;gap:12px;}
    .ob-input{width:100%;background:white;border:1.5px solid #E0E0E0;border-radius:13px;padding:14px 17px;font-size:15px;font-weight:600;color:#0A0A0A;outline:none;font-family:inherit;box-sizing:border-box;}
    .ob-input:focus{border-color:#0A0A0A;}
    .ob-ta{width:100%;background:white;border:1.5px solid #E0E0E0;border-radius:13px;padding:14px 17px;font-size:14px;color:#1A1A1A;resize:none;line-height:1.7;outline:none;font-family:inherit;box-sizing:border-box;}
    .ob-ta:focus{border-color:#0A0A0A;}
    .ob-btn{width:100%;background:#0A0A0A;color:white;border:none;border-radius:14px;padding:15px;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;}
    .ob-btn:disabled{background:#E0E0E0;color:#999;cursor:default;}
    .cohort-card{border:2px solid var(--border);border-radius:16px;padding:16px;margin-bottom:10px;cursor:pointer;transition:all 0.2s;background:var(--white);}
    .cohort-card.selected{border-color:var(--black);background:var(--black);color:white;}
    .cohort-card.selected .cc-sub{color:rgba(255,255,255,0.6);}
    .cc-name{font-size:16px;font-weight:900;margin-bottom:4px;}
    .cc-sub{font-size:12px;color:var(--ink3);}
    .cc-badge{display:inline-flex;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;margin-bottom:8px;}
    .cohort-card.selected .cc-badge{background:rgba(255,255,255,0.2);color:white;}
    .cohort-card:not(.selected) .cc-badge{background:var(--surface);color:var(--ink2);}
  `

  // ─── 화면 분기 ──────────────────────────────────────────────

  // 로딩 중
  if (!profileLoaded) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>OorajoO</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>불러오는 중...</div>
      </div>
    </div>
  )

  // 온보딩 — 프로필 없거나 닉네임 없는 경우 (관리자 제외)
  if (!profile?.nickname && !profile?.is_admin) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', fontFamily: "'Noto Sans KR', system-ui" }}>
        <div style={{ padding: '50px 28px 32px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: 12 }}>STEP 1 / 2</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1.3, letterSpacing: '-0.5px' }}>나는 이런<br />사람이에요!</div>
        </div>
        <div style={{ flex: 1, background: '#F7F7F7', borderRadius: '24px 24px 0 0', padding: '28px 22px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>닉네임 *</div>
          <input className="ob-input" style={{ marginBottom: 16 }} placeholder="그룹에서 불릴 이름" value={obNickname} onChange={e => setObNickname(e.target.value)} maxLength={10} autoFocus />

          <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>자기소개</div>
          <textarea className="ob-ta" style={{ marginBottom: 20 }} rows={3} placeholder="어떤 삶을 살고 싶은지, 요즘 관심사는..." value={obIntro} onChange={e => setObIntro(e.target.value)} />

          <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 4 }}>소셜 아이디</div>
          <div style={{ fontSize: 11, color: '#bbb', marginBottom: 10 }}>선택사항이에요 · 나중에 설정에서도 추가할 수 있어요</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 900, color: 'white' }}>T</div>
            <input className="ob-input" style={{ fontSize: 13, padding: '10px 13px' }} placeholder="스레드 아이디 (@제외)" value={obThreads} onChange={e => setObThreads(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 900, color: 'white' }}>I</div>
            <input className="ob-input" style={{ fontSize: 13, padding: '10px 13px' }} placeholder="인스타그램 아이디 (@제외)" value={obInsta} onChange={e => setObInsta(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 900, color: 'white' }}>N</div>
            <input className="ob-input" style={{ fontSize: 13, padding: '10px 13px' }} placeholder="네이버 블로그 ID" value={obNaver} onChange={e => setObNaver(e.target.value)} />
          </div>

          <button className="ob-btn" onClick={saveProfile} disabled={!obNickname.trim() || obSaving}>
            {obSaving ? '저장 중...' : '다음 → 기수 선택하기'}
          </button>
        </div>
      </div>
    </>
  )

  // 기수 선택 — 프로필은 있지만 기수 신청 안 한 경우 (관리자 제외)
  if (profile && !profile.cohort_id && !profile.is_admin) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', fontFamily: "'Noto Sans KR', system-ui" }}>
        <div style={{ padding: '50px 28px 32px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: 12 }}>STEP 2 / 2</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1.3, letterSpacing: '-0.5px' }}>어느 기수에<br />참여할까요?</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>기수를 선택하면 관리자 승인 후 입장돼요</div>
        </div>
        <div style={{ flex: 1, background: '#F7F7F7', borderRadius: '24px 24px 0 0', padding: '28px 22px', overflowY: 'auto' }}>
          {cohorts.filter(c => c.status !== 'ended').map(c => (
            <div
              key={c.id}
              className={`cohort-card${selectedCohortId === c.id ? ' selected' : ''}`}
              onClick={() => setSelectedCohortId(c.id)}
            >
              <div className="cc-badge">{c.status === 'active' ? '🟢 진행중' : '⏳ 모집중'}</div>
              <div className="cc-name">{c.name}</div>
              <div className="cc-sub">
                {c.start_date || '날짜 미정'} ~ {c.end_date || '날짜 미정'}
              </div>
              {c.price > 0 && <div className="cc-sub" style={{ marginTop: 4 }}>참가비 {c.price.toLocaleString()}원</div>}
            </div>
          ))}

          {cohorts.filter(c => c.status !== 'ended').length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink3)', fontSize: 13 }}>
              현재 모집 중인 기수가 없어요.<br />곧 새 기수가 열릴 예정이에요!
            </div>
          )}

          <button
            className="ob-btn"
            style={{ marginTop: 16 }}
            onClick={applyCohort}
            disabled={!selectedCohortId || applyingCohort}
          >
            {applyingCohort ? '신청 중...' : '기수 신청하기 →'}
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, color: '#999', padding: '12px 0', cursor: 'pointer', marginTop: 8 }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  )

  // 승인 대기 — 기수 신청했지만 미승인 (관리자 제외)
  if (profile && profile.cohort_id && !profile.is_approved && !profile.is_admin) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center', fontFamily: "'Noto Sans KR', system-ui" }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#0A0A0A', letterSpacing: '-0.5px', marginBottom: 8 }}>승인 대기 중이에요</div>
        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 8 }}>
          <strong>{cohorts.find(c => c.id === profile.cohort_id)?.name}</strong> 신청이 완료됐어요
        </div>
        <div style={{ fontSize: 13, color: '#999', lineHeight: 1.75, marginBottom: 28 }}>
          관리자가 확인 후 승인해드릴게요.<br />보통 24시간 이내에 처리돼요.
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, background: '#F0F0F0', color: '#999', border: '1px solid #E0E0E0', padding: '6px 18px', borderRadius: 20, marginBottom: 12 }}>
          승인되면 이 화면이 자동으로 바뀌어요
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: 'none', fontSize: 13, color: '#999', cursor: 'pointer', padding: '8px 0' }}>로그아웃</button>
      </div>
    </>
  )

  // 환불 정책 페이지
  if (showPolicy) return (
    <>
      <style>{css}</style>
      <div className="policy-page">
        <div className="policy-hdr">
          <button onClick={() => setShowPolicy(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon name="close" size={20} color="white" /></button>
          <span style={{ fontSize: 16, fontWeight: 900, color: 'white' }}>환불 정책 및 이용약관</span>
        </div>
        <div style={{ padding: '20px 18px' }}>
          {[
            { title: '환불 정책', text: '• 챌린지 시작 전(D-1까지): 전액 환불\n• 챌린지 시작 후 3일 이내: 50% 환불\n• 챌린지 시작 4일 이후: 환불 불가\n• 운영자 귀책 사유 발생 시: 전액 환불\n\n환불 문의: contact@oorajoo.kr' },
            { title: '개인정보 처리방침', text: '수집 항목: 이메일, 닉네임, 작성 기록\n보유 기간: 회원 탈퇴 후 30일 이내 삭제\n제3자 제공: 없음' },
            { title: '이용약관', text: '• 타인을 비방하는 내용은 관리자 판단 하에 삭제될 수 있어요.\n• 챌린지 기록은 해당 기수 멤버들과 공유돼요.\n• 서비스 운영 정책은 사전 공지 후 변경될 수 있어요.' },
          ].map(({ title, text }) => (
            <div key={title} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  // ─── 렌더 함수 ─────────────────────────────────────────────

  const renderFeedCard = (item: FeedItem) => {
    const mp = item.profiles as Profile
    const isMe = item.user_id === session.user.id
    if (item.is_private && !isMe) return null
    return (
      <div key={item.id} className="fc">
        <div className="fc-top">
          <div className="av" style={{ width: 36, height: 36, background: mp?.color || '#333' }} onClick={() => setSelectedProfile(mp)}>
            {mp?.nickname?.[0] || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)', cursor: 'pointer' }} onClick={() => setSelectedProfile(mp)}>{mp?.nickname}</span>
            {isMe && <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: 'var(--black)', padding: '2px 6px', borderRadius: 20, marginLeft: 5 }}>나</span>}
            {item.is_private && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--ink3)', background: 'var(--surface)', padding: '2px 7px', borderRadius: 20, marginLeft: 4 }}>나만</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>{formatTime(item.created_at)}</div>
              {isMe && <button onClick={async () => { if (!confirm('삭제할까요?')) return; await supabase.from('feed').delete().eq('id', item.id); setSubmitted(false); loadFeed() }} style={{ fontSize: 10, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>삭제</button>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
          <span className="fc-badge">🙏 감사</span><span className="fc-text">{item.gratitude}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
          <span className="fc-badge">🎯 목표</span><span className="fc-text">{item.goal}</span>
        </div>
        <div className="fc-q">
          <div className="fc-q-lbl">✦ QUESTION</div>
          <div className="fc-q-txt">{item.question_answer}</div>
        </div>
        {!item.is_private && (
          <div className="react-bar">
            {REACT_CONFIG.map(({ key, emoji }) => {
              const rk = `feed-${item.id}-${key}`, on = reactions[rk]
              return (
                <button key={key} className={`r-btn${on ? ' on' : ''}`} onClick={() => handleReact('feed', item.id, key)}>
                  <span style={{ fontSize: 14 }}>{emoji}</span><span className="r-cnt">{reactionCounts[`feed-${item.id}-${key}`] || 0}</span>
                </button>
              )
            })}
            <button className="cmt-btn" onClick={() => setExpandedComments(p => ({ ...p, [item.id]: !p[item.id] }))}>
              <Icon name="chat" size={13} color="var(--ink3)" />
            </button>
            <button className="cmt-btn" style={{ marginLeft: 'auto' }} onClick={() => openShare(item, 'feed')}>
              <Icon name="share" size={13} color="var(--ink3)" /><span>공유</span>
            </button>
          </div>
        )}
        {expandedComments[item.id] && (
          <div className="cmt-area">
            {(item.comments || []).map((c: any, i: number) => (
              <div key={i} className="cmt-item">
                <span className="cmt-author">{c.profiles?.nickname || '알 수 없음'}</span>
                <span className="cmt-text">{c.content}</span>
              </div>
            ))}
            <div className="cmt-row">
              <input className="cmt-input" placeholder="한마디 남기기..." value={commentInput[item.id] || ''} onChange={e => setCommentInput(p => ({ ...p, [item.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submitComment(item.id)} />
              <button className="cmt-send" onClick={() => submitComment(item.id)}><Icon name="send" size={13} color="white" /></button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderToday = () => (
    <>
      {notice && (
        <div className="notice-card">
          <div className="notice-bar">
            <Icon name="bell" size={12} color="white" />
            <span className="notice-bar-txt">관리자 공지</span>
            <span className="notice-bar-date">{formatTime(notice.created_at)}</span>
          </div>
          <div className="notice-body">
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--black)', marginBottom: 6 }}>{notice.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7 }}>{notice.body}</div>
            {notice.link && <a href={notice.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--black)', background: 'var(--surface)', padding: '5px 12px', borderRadius: 20, textDecoration: 'none', border: '1px solid var(--border)' }}>자세히 보기 →</a>}
          </div>
        </div>
      )}

      {isEnded && (
        <div style={{ margin: '12px 16px 0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="lock" size={16} color="var(--ink3)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)' }}>{myCohort?.name} 챌린지가 종료됐어요</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>기록은 계속 볼 수 있어요</div>
          </div>
        </div>
      )}

      <div className="write-section">
        {isEnded ? (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink2)' }}>종료된 챌린지예요</div>
          </div>
        ) : (
          <div className="write-card">
            <div className="wc-bar" />
            <div className="wc-inner">
              {submitted ? (
                <div className="wc-done">
                  <div className="wc-done-icon"><Icon name="check" size={22} color="var(--black)" /></div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--black)', marginBottom: 10 }}>공유 완료!</div>
                  <div className="wc-done-cheer">{cheerMsg}</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.4px' }}>오늘의 기록</span>
                    <span style={{ fontSize: 10, color: 'var(--ink3)' }}>{new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                  </div>
                  {[
                    { key: 'gratitude', dot: '#1A1A1A', label: '오늘의 감사', ph: '작은 것도 충분해요!' },
                    { key: 'goal', dot: '#555', label: '오늘의 목표', ph: '오늘 딱 하나만 이룬다면?' },
                  ].map(({ key, dot, label, ph }) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink2)' }}>{label}</span>
                      </div>
                      <textarea className="wc-ta" rows={2} placeholder={ph} value={(myRecord as any)[key]} onChange={e => setMyRecord(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#999' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink2)' }}>오늘의 질문</span>
                    </div>
                    <div className="wc-q-box">
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>✦ AI DAILY QUESTION</div>
                      {qLoading ? <><div className="wc-shimmer" /><div className="wc-shimmer s" /></> : <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.7 }}>{question}</div>}
                    </div>
                    <textarea className="wc-ta" rows={2} placeholder="자유롭게 한 줄이라도!" value={myRecord.question_answer} onChange={e => setMyRecord(p => ({ ...p, question_answer: e.target.value }))} />
                  </div>
                  <div onClick={() => setMyRecord(p => ({ ...p, is_private: !p.is_private }))} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 13px', background: 'var(--surface)', borderRadius: 10, cursor: 'pointer' }}>
                    <Icon name={myRecord.is_private ? 'eyeOff' : 'eye'} size={16} color="var(--ink2)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink2)', flex: 1 }}>{myRecord.is_private ? '나만 보기 (비공개)' : '그룹과 공유'}</span>
                    <div style={{ width: 36, height: 20, borderRadius: 10, background: myRecord.is_private ? 'var(--black)' : 'var(--border2)', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ position: 'absolute', top: 2, left: myRecord.is_private ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </div>
                  </div>
                  <button className="wc-submit" disabled={!myRecord.gratitude.trim() || !myRecord.goal.trim() || !myRecord.question_answer.trim()} onClick={submitRecord}>공유하기</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sec-label">
        {isEnded ? `${myCohort?.name} 기록 보관함` : '멤버들의 오늘'}
        <span className="sec-sub">{myFeed.length}개</span>
      </div>
      {myFeed.map(item => renderFeedCard(item))}
    </>
  )

  const renderLounge = () => (
    <>
      <div className="lounge-hd">
        <span className="lounge-t">라운지</span>
        <button className="fab" onClick={() => setShowPostInput(p => !p)}>
          {showPostInput ? <><Icon name="close" size={13} color="white" />닫기</> : <><Icon name="plus" size={13} color="white" />남기기</>}
        </button>
      </div>
      {showPostInput && (
        <div className="post-box">
          <textarea className="post-ta" rows={3} placeholder="오늘 하루 어땠어요? ✍️" value={newPost} onChange={e => setNewPost(e.target.value)} autoFocus />
<div className="tag-row">
  {TAGS.map(t => (
    <button key={t}
      className={`tag-chip ${postTags.includes(t) ? 'sel' : 'unsel'}`}
      onClick={() => setPostTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}>
      {t}
    </button>
  ))}
  {postTags.filter(t => !TAGS.includes(t)).map(t => (
    <button key={t} className="tag-chip sel" onClick={() => setPostTags(p => p.filter(x => x !== t))}>{t} ×</button>
  ))}
  {showCustomTag ? (
    <div style={{ display: 'flex', gap: 4 }}>
      <input
        style={{ background: 'var(--bg)', border: '1.5px solid var(--black)', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: 'var(--ink)', width: 90, outline: 'none' }}
        placeholder="#태그" value={customTagInput} onChange={e => setCustomTagInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const t = customTagInput.trim()
            if (t) { const tag = t.startsWith('#') ? t : '#' + t; setPostTags(p => [...p, tag]) }
            setCustomTagInput(''); setShowCustomTag(false)
          }
        }} autoFocus />
      <button onClick={() => {
        const t = customTagInput.trim()
        if (t) { const tag = t.startsWith('#') ? t : '#' + t; setPostTags(p => [...p, tag]) }
        setCustomTagInput(''); setShowCustomTag(false)
      }} style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>추가</button>
    </div>
  ) : (
    <button className="tag-chip unsel" style={{ borderStyle: 'dashed' }} onClick={() => setShowCustomTag(true)}>+ 직접입력</button>
  )}
</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 12, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={submitPost}>공유하기</button>
            <button style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--ink3)', cursor: 'pointer' }} onClick={() => { setShowPostInput(false); setNewPost(''); setPostTags([]); setShowCustomTag(false) }}>취소</button>
          </div>
        </div>
      )}
      {lounge.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink3)', fontSize: 13 }}>아직 글이 없어요. 첫 번째로 남겨봐요!</div>}
      {lounge.map(post => {
        const mp = post.profiles as Profile, isMe = post.user_id === session.user.id
        return (
          <div key={post.id} className="lc">
            {post.image_url && <img src={post.image_url} style={{ width: '100%', height: 164, objectFit: 'cover', display: 'block' }} alt="" />}
            <div className="lc-body">
              <div className="lc-top">
                <div className="av" style={{ width: 30, height: 30, fontSize: 11, background: mp?.color || '#333' }} onClick={() => setSelectedProfile(mp)}>{mp?.nickname?.[0] || '?'}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)', cursor: 'pointer' }} onClick={() => setSelectedProfile(mp)}>{mp?.nickname}</span>
                {isMe && <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: 'var(--black)', padding: '2px 6px', borderRadius: 20, marginLeft: 4 }}>나</span>}
                <span style={{ fontSize: 10, color: 'var(--ink3)', marginLeft: 'auto' }}>{formatTime(post.created_at)}</span>
                {isMe && <>
                  <button onClick={() => startEditPost(post.id, post.content, 'lounge')} style={{ fontSize: 10, color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>수정</button>
                  <button onClick={() => deletePost(post.id, 'lounge')} style={{ fontSize: 10, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>삭제</button>
                </>}
              </div>
              {post.tag && <div className="lc-tag">{post.tag}</div>}
              {editingPostId === post.id ? (
                <div>
                  <textarea style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--black)', borderRadius: 10, padding: '10px 13px', fontSize: 13, color: 'var(--ink)', resize: 'none', lineHeight: 1.65, marginBottom: 8, outline: 'none', fontFamily: 'inherit' }} rows={3} value={editingPostText} onChange={e => setEditingPostText(e.target.value)} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={saveEditPost} style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>저장</button>
                    <button onClick={() => { setEditingPostId(null); setEditingPostText('') }} style={{ flex: 1, background: 'var(--surface)', border: 'none', borderRadius: 10, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--ink2)' }}>취소</button>
                  </div>
                </div>
              ) : (
                <div className="lc-text">{post.content}</div>
              )}
              <div className="react-bar">
                {REACT_CONFIG.map(({ key, emoji }) => {
                  const rk = `lounge-${post.id}-${key}`, on = reactions[rk]
                  return <button key={key} className={`r-btn${on ? ' on' : ''}`} onClick={() => handleReact('lounge', post.id, key)}><span style={{ fontSize: 14 }}>{emoji}</span><span className="r-cnt">{reactionCounts[`lounge-${post.id}-${key}`] || 0}</span></button>
                })}
                <button className="cmt-btn" style={{ marginLeft: 'auto' }} onClick={() => openShare(post, 'lounge')}><Icon name="share" size={13} color="var(--ink3)" /><span>공유</span></button>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )

  const renderRecord = () => (
    <>
      <div className="streak-hero">
        <div className="sh-blob" />
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>STREAK</div>
        <div><span style={{ fontSize: 52, fontWeight: 900, color: 'white', letterSpacing: '-2px' }}>{profile?.streak || 0}</span><span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>일 연속</span></div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5, marginBottom: 14 }}>꾸준히 기록 중이에요</div>
        <div className="sh-bar-bg"><div className="sh-bar-fill" style={{ width: `${Math.min(100, ((profile?.streak || 0) / 31) * 100)}%` }} /></div>
      </div>
      <div className="stats-grid">
        {[['내 기록', `${feed.filter(f => f.user_id === session.user.id).length}개`], ['스트릭', `${profile?.streak || 0}일`], ['이번 기수', myCohort?.name || '-'], ['받은 반응', '0개']].map(([l, v]) => (
          <div key={l} className="stat-card"><div style={{ fontSize: 22, fontWeight: 900, color: 'var(--black)' }}>{v}</div><div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 3 }}>{l}</div></div>
        ))}
      </div>
      <div className="sec-label">나의 기록<span className="sec-sub">최근 순</span></div>
      {feed.filter(f => f.user_id === session.user.id).slice(0, 10).map(item => (
        <div key={item.id} className="hist-card">
          <div className="hist-date">{formatTime(item.created_at)}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}><span className="fc-badge">🙏 감사</span><span className="fc-text">{item.gratitude}</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><span className="fc-badge">🎯 목표</span><span className="fc-text">{item.goal}</span></div>
        </div>
      ))}
    </>
  )

  const renderGroup = () => (
    <>
      <div className="group-hero">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--black)' }}>우라주<br />챌린지</div>
          <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--black)', color: 'white', padding: '4px 11px', borderRadius: 20 }}>{myCohort?.name} {isEnded ? '종료' : '진행중'}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 13 }}>{myCohort?.start_date} — {myCohort?.end_date}</div>
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{ height: '100%', background: 'var(--black)', borderRadius: 3, width: isEnded ? '100%' : '45%' }} />
        </div>
      </div>
      {isAdmin && (
        <div style={{ display: 'flex', gap: 5, padding: '0 16px 8px', overflowX: 'auto' }}>
          {cohorts.map(c => (
            <button key={c.id} onClick={() => setViewingCohortId(c.id)} style={{ flexShrink: 0, padding: '5px 13px', fontSize: 11, fontWeight: 700, borderRadius: 20, border: '1px solid', background: myCohortId === c.id ? 'var(--black)' : 'none', color: myCohortId === c.id ? 'white' : 'var(--ink3)', borderColor: myCohortId === c.id ? 'var(--black)' : 'var(--border)', cursor: 'pointer' }}>
              {c.name} {c.status === 'ended' ? '🔒' : ''}
            </button>
          ))}
        </div>
      )}
      <div className="sec-label">멤버 소개<span className="sec-sub">{cohortMembers.length}명</span></div>
      {cohortMembers.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink3)', fontSize: 13 }}>아직 멤버가 없어요</div>}
      {cohortMembers.map(m => (
        <div key={m.id} className="mc" onClick={() => setSelectedProfile(m)}>
          <div className="mc-top">
            <div className="mc-av" style={{ background: m.color || '#333' }}>{m.nickname?.[0] || '?'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--black)' }}>{m.nickname}</div>
              <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>{m.streak || 0}일 연속 🔥</div>
            </div>
            {m.id === session.user.id && <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: 'var(--black)', padding: '2px 6px', borderRadius: 20 }}>나</span>}
          </div>
          {m.intro && <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 6 }}>{m.intro}</div>}
          {(m.tags || []).length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {m.tags.map((t: string, i: number) => <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink2)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 20 }}>{t}</span>)}
            </div>
          )}
        </div>
      ))}
    </>
  )

  const renderSettings = () => (
    <>
      <div style={{ padding: '18px 16px 0' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, cursor: 'pointer' }} onClick={() => { setSelectedProfile(profile); setEditingProfile(false) }}>
          <div className="mc-av" style={{ background: profile?.color || '#333', width: 52, height: 52, borderRadius: 16, fontSize: 20 }}>{profile?.nickname?.[0] || '나'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--black)' }}>{profile?.nickname || '닉네임'}</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{cohorts.find(c => c.id === profile?.cohort_id)?.name || '?기'} 참가</div>
          </div>
          <Icon name="settings" size={16} color="var(--ink3)" />
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-title">서비스</div>
        <div className="settings-card">
          <div className="settings-row" onClick={() => setShowPolicy(true)}><div><div className="settings-row-label">환불 정책 및 이용약관</div></div><span style={{ fontSize: 12, color: 'var(--ink3)' }}>→</span></div>
          <div className="settings-row"><div><div className="settings-row-label">문의하기</div><div className="settings-row-sub">contact@oorajoo.kr</div></div></div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-title">계정</div>
        <div className="settings-card">
          <div className="settings-row" onClick={() => supabase.auth.signOut()}><div><div className="settings-row-label">로그아웃</div></div></div>
          <div className="settings-row" onClick={() => setShowDeleteConfirm(true)}><div><div className="settings-row-label" style={{ color: '#DC2626' }}>탈퇴하기</div><div className="settings-row-sub">모든 기록이 삭제돼요</div></div></div>
        </div>
      </div>
      <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: 11, color: 'var(--ink3)' }}>우라주 챌린지 v1.0 · © 2025 OorajoO</div>
    </>
  )

  const renderAdmin = () => (
    <div className="admin-overlay">
      <div className="admin-bg" onClick={() => setShowAdmin(false)} />
      <div className="admin-panel">
        <div className="admin-handle" />
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--black)', marginBottom: 14 }}>관리자 패널</div>
        <div className="admin-tabs">
          <button className={`admin-tab${adminTab === 'notice' ? ' on' : ''}`} onClick={() => setAdminTab('notice')}>공지</button>
          <button className={`admin-tab${adminTab === 'pending' ? ' on' : ''}`} onClick={() => setAdminTab('pending')}>
            승인{pendingMembers.length > 0 && ` (${pendingMembers.length})`}
          </button>
          <button className={`admin-tab${adminTab === 'cohorts' ? ' on' : ''}`} onClick={() => setAdminTab('cohorts')}>기수관리</button>
        </div>

        {adminTab === 'notice' && (<>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>제목</div>
          <input className="admin-input" placeholder="공지 제목" value={adminForm.title} onChange={e => setAdminForm(p => ({ ...p, title: e.target.value }))} />
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>내용</div>
          <textarea className="admin-ta" rows={3} placeholder="내용을 입력하세요" value={adminForm.body} onChange={e => setAdminForm(p => ({ ...p, body: e.target.value }))} />
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>링크 (선택)</div>
          <input className="admin-input" placeholder="https://zoom.us/..." value={adminForm.link} onChange={e => setAdminForm(p => ({ ...p, link: e.target.value }))} />
          <div className="admin-toggle">
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)', flex: 1 }}>투표 추가하기</span>
            <button className={`toggle-btn ${adminForm.hasPoll ? 'on' : 'off'}`} onClick={() => setAdminForm(p => ({ ...p, hasPoll: !p.hasPoll }))}><div className="toggle-dot" /></button>
          </div>
          {adminForm.hasPoll && (<>
            <input className="admin-input" placeholder="투표 질문" value={adminForm.pollQ} onChange={e => setAdminForm(p => ({ ...p, pollQ: e.target.value }))} />
            {adminForm.pollOptions.map((opt, i) => (
              <input key={i} className="admin-input" placeholder={`선택지 ${i + 1}`} value={opt} onChange={e => setAdminForm(p => ({ ...p, pollOptions: p.pollOptions.map((o, j) => j === i ? e.target.value : o) }))} />
            ))}
            <button style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 13px', cursor: 'pointer', marginBottom: 8 }} onClick={() => setAdminForm(p => ({ ...p, pollOptions: [...p.pollOptions, ''] }))}>+ 선택지 추가</button>
          </>)}
          <button style={{ width: '100%', background: 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: !adminForm.title || !adminForm.body ? 0.4 : 1 }} disabled={!adminForm.title || !adminForm.body} onClick={submitNotice}>공지 올리기</button>
        </>)}

        {adminTab === 'pending' && (<>
          {pendingMembers.length === 0
            ? <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--ink3)', fontSize: 13 }}>대기 중인 신청자가 없어요</div>
            : pendingMembers.map((m: any) => (
              <div key={m.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                  <div className="mc-av" style={{ width: 34, height: 34, borderRadius: 10, background: '#888', fontSize: 13 }}>{(m.profiles?.nickname || '?')[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)' }}>{m.profiles?.nickname || m.nickname || '?'}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink3)' }}>
                      {cohorts.find(c => c.id === m.cohort_id)?.name} 신청 · {formatTime(m.created_at)}
                    </div>
                  </div>
                  <button onClick={async () => { await supabase.from('pending_members').delete().eq('id', m.id); setPendingMembers(p => p.filter(x => x.id !== m.id)) }} style={{ background: 'var(--surface)', color: 'var(--ink2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>거절</button>
                </div>
                <button onClick={() => approveMember(m.id, m.user_id, m.cohort_id)} style={{ width: '100%', background: 'var(--black)', color: 'white', border: 'none', borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {cohorts.find(c => c.id === m.cohort_id)?.name}에 승인하기 ✓
                </button>
              </div>
            ))
          }
        </>)}

        {adminTab === 'cohorts' && (<>
          {cohorts.map(c => (
            <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 13px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--black)' }}>{c.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: c.status === 'active' ? 'var(--black)' : 'var(--surface)', color: c.status === 'active' ? 'white' : 'var(--ink3)', padding: '3px 9px', borderRadius: 20, border: '1px solid var(--border)' }}>
                  {c.status === 'active' ? '진행중' : c.status === 'ended' ? '종료' : '예정'}
                </span>
              </div>
              {editingCohort?.id === c.id ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 7 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', marginBottom: 3 }}>시작일</div>
                      <input type="date" className="admin-input" style={{ marginBottom: 0, padding: '7px 10px', fontSize: 12 }} value={editingCohort.start_date || ''} onChange={e => setEditingCohort(p => p ? { ...p, start_date: e.target.value } : p)} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', marginBottom: 3 }}>종료일</div>
                      <input type="date" className="admin-input" style={{ marginBottom: 0, padding: '7px 10px', fontSize: 12 }} value={editingCohort.end_date || ''} onChange={e => setEditingCohort(p => p ? { ...p, end_date: e.target.value } : p)} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                    {(['upcoming', 'active', 'ended'] as const).map(s => (
                      <button key={s} onClick={() => setEditingCohort(p => p ? { ...p, status: s } : p)} style={{ flex: 1, padding: '6px 0', fontSize: 11, fontWeight: 700, border: '1px solid var(--border)', borderRadius: 8, background: editingCohort.status === s ? 'var(--black)' : 'none', color: editingCohort.status === s ? 'white' : 'var(--ink3)', cursor: 'pointer' }}>
                        {s === 'upcoming' ? '예정' : s === 'active' ? '진행중' : '종료'}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={saveCohort} style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 9, padding: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>저장</button>
                    <button onClick={() => setEditingCohort(null)} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--ink2)' }}>취소</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{c.start_date || '미설정'} ~ {c.end_date || '미설정'}</span>
                  <button onClick={() => setEditingCohort({ ...c })} style={{ fontSize: 11, fontWeight: 700, background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', color: 'var(--ink2)' }}>설정</button>
                </div>
              )}
            </div>
          ))}
          <button onClick={async () => {
            const n = cohorts.length + 1
            const { data } = await supabase.from('cohorts').insert({ name: `${n}기`, status: 'upcoming', max_slots: 20, price: 0 }).select().single()
            if (data) { loadCohorts(); setEditingCohort(data) }
          }} style={{ width: '100%', background: 'none', border: '1.5px dashed var(--border)', borderRadius: 12, padding: 10, fontSize: 12, fontWeight: 700, color: 'var(--ink3)', cursor: 'pointer', marginTop: 4 }}>+ 새 기수 추가</button>
        </>)}
      </div>
    </div>
  )

  // ─── 메인 리턴 ─────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {!isOnline && <div className="offline">오프라인 상태예요 · 일부 기능이 제한될 수 있어요</div>}

        <div className="hdr">
          <div>
            <div className="hdr-wm">우라주 챌린지</div>
            <div className="hdr-sub">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</div>
          </div>
          <div className="hdr-r">
            {isAdmin
              ? <select value={myCohortId} onChange={e => setViewingCohortId(Number(e.target.value))} style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 20, padding: '5px 11px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                  {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              : <div className="hdr-chip">{myCohort?.name || '?기'}</div>
            }
          </div>
        </div>

        {tab === 'today' && renderToday()}
        {tab === 'lounge' && renderLounge()}
        {tab === 'record' && renderRecord()}
        {tab === 'group' && renderGroup()}
        {tab === 'settings' && renderSettings()}

        <div className="tab-bar">
          {[['today', 'sprout', '오늘'], ['lounge', 'sun', '라운지'], ['record', 'calendar', '기록'], ['group', 'users', '그룹'], ['settings', 'settings', '설정']].map(([k, icon, label]) => (
            <button key={k} className={`tab-btn${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>
              <Icon name={icon} size={17} color={tab === k ? 'white' : 'var(--ink3)'} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {isAdmin && <button className="admin-fab" onClick={() => setShowAdmin(true)}><Icon name="bell" size={18} color="white" /></button>}
        {isAdmin && showAdmin && renderAdmin()}

        {selectedProfile && (
          <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) { setSelectedProfile(null); setEditingProfile(false) } }}>
            <div className="modal">
              <div className="modal-handle" />
              {!editingProfile ? (
                <>
                  <div style={{ width: 70, height: 70, borderRadius: 22, background: selectedProfile.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 900, color: 'white', margin: '0 auto 13px' }}>{selectedProfile.nickname?.[0]}</div>
                  <div style={{ fontSize: 21, fontWeight: 900, color: 'var(--black)', textAlign: 'center', letterSpacing: '-0.5px' }}>{selectedProfile.nickname}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)', textAlign: 'center', marginBottom: 14 }}>{cohorts.find(c => c.id === selectedProfile.cohort_id)?.name || '?기'} · {selectedProfile.streak}일 연속</div>
                  {selectedProfile.intro && <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.75, marginBottom: 14 }}>{selectedProfile.intro}</div>}
                  {(selectedProfile.tags || []).length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 18 }}>
                      {selectedProfile.tags.map((t, i) => <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink2)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 20 }}>{t}</span>)}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {selectedProfile.id === session.user.id && (
                      <button style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
                        onClick={() => { setEditData({ nickname: selectedProfile.nickname || '', intro: selectedProfile.intro || '', tags: (selectedProfile.tags || []).join(' '), threads_id: selectedProfile.threads_id || '', insta_id: selectedProfile.insta_id || '', naver_blog: selectedProfile.naver_blog || '' }); setEditingProfile(true) }}>
                        프로필 수정
                      </button>
                    )}
                    <button style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink2)', border: 'none', borderRadius: 14, padding: 13, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => { setSelectedProfile(null); setEditingProfile(false) }}>닫기</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--black)', marginBottom: 16 }}>프로필 수정</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>닉네임</div>
                  <input style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 13px', fontSize: 13, color: 'var(--ink)', marginBottom: 11, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} value={editData.nickname || ''} onChange={e => setEditData((p: any) => ({ ...p, nickname: e.target.value }))} placeholder="닉네임" maxLength={10} />
                  {[['자기소개', 'intro'], ['태그 (#으로 시작, 띄어쓰기 구분)', 'tags'], ['스레드 아이디', 'threads_id'], ['인스타그램 아이디', 'insta_id'], ['네이버 블로그 ID', 'naver_blog']].map(([label, key]) => (
                    <div key={key}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>{label}</div>
                      {key === 'intro'
                        ? <textarea style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 13px', fontSize: 13, color: 'var(--ink)', resize: 'none', lineHeight: 1.65, marginBottom: 11, outline: 'none', fontFamily: 'inherit' }} rows={3} value={editData[key] || ''} onChange={e => setEditData((p: any) => ({ ...p, [key]: e.target.value }))} />
                        : <input style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 13px', fontSize: 13, color: 'var(--ink)', marginBottom: 11, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} value={editData[key] || ''} onChange={e => setEditData((p: any) => ({ ...p, [key]: e.target.value }))} />
                      }
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, cursor: 'pointer' }} onClick={saveProfileEdit}>저장하기</button>
                    <button style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink2)', border: 'none', borderRadius: 14, padding: 13, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingProfile(false)}>취소</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {shareModal && (
          <div className="share-modal-bg" onClick={e => { if (e.target === e.currentTarget) setShareModal(null) }}>
            <div className="share-modal">
              <div className="modal-handle" />
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--black)', marginBottom: 3 }}>공유하기</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 14 }}>아래 내용을 복사하거나 앱으로 공유해요</div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: 12, color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginBottom: 14, maxHeight: 130, overflowY: 'auto' }}>{shareModal.text}</div>
              <button onClick={doShare} style={{ width: '100%', background: copiedShare ? '#333' : 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, marginBottom: 8, cursor: 'pointer' }}>{copiedShare ? '✓ 복사됐어요!' : '링크 복사하기'}</button>
              <button onClick={doShare} style={{ width: '100%', background: 'var(--surface)', color: 'var(--black)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, fontSize: 13, fontWeight: 700, marginBottom: 8, cursor: 'pointer' }}>📤 앱으로 공유하기</button>
              <button onClick={() => setShareModal(null)} style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, color: 'var(--ink3)', padding: 10, cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="confirm-bg" onClick={e => { if (e.target === e.currentTarget) setShowDeleteConfirm(false) }}>
            <div style={{ background: 'var(--white)', borderRadius: 20, padding: '24px 20px', width: 'calc(100% - 40px)', maxWidth: 360 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#DC2626', marginBottom: 8 }}>정말 탈퇴할까요?</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 20 }}>탈퇴하면 모든 기록이 삭제되고 복구할 수 없어요.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => supabase.auth.signOut()} style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 900, cursor: 'pointer' }}>탈퇴하기</button>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink2)', border: 'none', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
