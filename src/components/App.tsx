'use client'

import { useState, useEffect } from 'react'
import { supabase, type Profile, type Cohort, type FeedItem, type LoungePost, type Notice } from '@/lib/supabase'
import AdBanner from './AdBanner'

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
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  }
  return icons[name] || null
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
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

const BADGES = [
  { id: 'first_record',   emoji: '🌱', label: '첫 기록',    desc: '처음으로 기록을 남겼어요' },
  { id: 'streak_3',       emoji: '🔥', label: '3일 연속',   desc: '3일 연속 기록 달성' },
  { id: 'streak_7',       emoji: '⚡', label: '7일 연속',   desc: '7일 연속 기록 달성' },
  { id: 'streak_14',      emoji: '💎', label: '14일 연속',  desc: '2주 연속 기록 달성' },
  { id: 'streak_21',      emoji: '👑', label: '21일 연속',  desc: '3주 연속 기록 달성' },
  { id: 'streak_30',      emoji: '🏆', label: '30일 완주',  desc: '30일 챌린지 완주!' },
  { id: 'first_comment',  emoji: '💬', label: '첫 댓글',    desc: '처음으로 댓글을 남겼어요' },
  { id: 'first_reaction', emoji: '❤️', label: '첫 반응',    desc: '처음으로 반응을 남겼어요' },
  { id: 'round_2',        emoji: '🔄', label: '2라운드',    desc: '두 번째 챌린지 도전!' },
]

const POINT_RULES = {
  daily_record: 10,
  streak_3: 30,
  streak_7: 70,
  streak_14: 140,
  streak_21: 210,
  streak_30: 300,
  received_reaction: 2,
}

const getLevel = (points: number) => {
  if (points < 50)  return { level: 1, title: '새싹 🌱',   next: 50 }
  if (points < 150) return { level: 2, title: '새벽러 🌙', next: 150 }
  if (points < 300) return { level: 3, title: '성장러 📈', next: 300 }
  if (points < 500) return { level: 4, title: '꾸준러 💪', next: 500 }
  if (points < 800) return { level: 5, title: '챌린저 ⚡', next: 800 }
  return { level: 6, title: '레전드 👑', next: null }
}

const TAGS = ['#새벽기상', '#공부중', '#오늘의책', '#소확행', '#힘들다', '#운동', '#감사']
const cohortColors = ['#2D4A7A', '#5C3D7A', '#7A3D3D', '#2D6B4A', '#6B4A2D', '#3D5C7A']
const REACT_CONFIG = [
  { key: '❤️', emoji: '❤️' },
  { key: '👍', emoji: '👍' },
  { key: '😭', emoji: '😭' },
  { key: '🔥', emoji: '🔥' },
]

// ─── KST 날짜 헬퍼 ──────────────────────────────────────────────
const getKSTDateString = () => {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  return kst.toISOString().split('T')[0]
}

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
  const [cohortCounts, setCohortCounts] = useState<Record<number, number>>({})
  const [tab, setTab] = useState('today')

  // 온보딩
  const [obNickname, setObNickname] = useState('')
  const [obIntro, setObIntro] = useState('')
  const [obThreads, setObThreads] = useState('')
  const [obInsta, setObInsta] = useState('')
  const [obNaver, setObNaver] = useState('')
  const [obSaving, setObSaving] = useState(false)

  // 기록
  const [myRecord, setMyRecord] = useState({ gratitude: '', goal: '', question_answer: '', is_private: false })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cheerMsg] = useState(() => CHEERS[Math.floor(Math.random() * CHEERS.length)])

  // 라운지
  const [newPost, setNewPost] = useState('')
  const [postTags, setPostTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')
  const [showCustomTag, setShowCustomTag] = useState(false)
  const [postImage, setPostImage] = useState<File | null>(null)
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null)
  const [showPostInput, setShowPostInput] = useState(false)
  const [cheerInput, setCheerInput] = useState('')
  const [cheerPosting, setCheerPosting] = useState(false)

  // UI
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
  const [commentInput, setCommentInput] = useState<Record<number, string>>({})
  const [expandedLoungeComments, setExpandedLoungeComments] = useState<Record<number, boolean>>({})
  const [loungeCommentInput, setLoungeCommentInput] = useState<Record<number, string>>({})
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
  const [toast, setToast] = useState<string | null>(null)
  const [editingFeedItem, setEditingFeedItem] = useState<{ id: number; gratitude: string; goal: string; question_answer: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [posting, setPosting] = useState(false)
  const [aiCheer, setAiCheer] = useState('')
  const [cheerLoading, setCheerLoading] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [pushGranted, setPushGranted] = useState(false)
  const [followings, setFollowings] = useState<Set<string>>(new Set())
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all')
  const [notifTime, setNotifTime] = useState<string>('')
  const [savingNotif, setSavingNotif] = useState(false)
  const [applications, setApplications] = useState<any[]>([])
  const [todayCompletionCount, setTodayCompletionCount] = useState(0)
  const [newBadge, setNewBadge] = useState<typeof BADGES[0] | null>(null)
  const [showBadgePopup, setShowBadgePopup] = useState(false)
  const [weeklyStats, setWeeklyStats] = useState<{ thisWeek: number; lastWeek: number }>({ thisWeek: 0, lastWeek: 0 })

  // ─── 파생값 ────────────────────────────────────────────────
  const isAdmin = profile?.is_admin || false
  const myCohortId = isAdmin
    ? (viewingCohortId || 0)
    : (viewingCohortId || profile?.cohort_id || cohorts.find(c => c.status === 'active')?.id || 0)
  const myCohort = cohorts.find(c => c.id === myCohortId)
  const isEnded = myCohort?.status === 'ended'
  const myFeed = feed.filter(f => f.cohort_id === myCohortId)
  const displayFeed = feedFilter === 'following' && followings.size > 0
    ? myFeed.filter(f => f.user_id === session.user.id || followings.has(f.user_id))
    : myFeed

  const challengeStartDate = new Date(profile?.challenge_started_at || profile?.created_at || new Date())
  const rawChallengeDay = Math.floor((new Date().getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const challengeDay = Math.max(1, Math.min(rawChallengeDay, 30))
  const challengeEnded = rawChallengeDay > 30
  const challengeRound = profile?.challenge_round || 1

  const getCohortLabel = (cohortId: number | null) => {
    if (!cohortId) return null
    const c = cohorts.find(c => c.id === cohortId)
    return c?.title || `${cohortId}기`
  }

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
    const today = getKSTDateString()
    const { data } = await supabase
      .from('feed')
      .select('id')
      .eq('user_id', session.user.id)
      .gte('created_at', today + 'T00:00:00+09:00')
      .limit(1)
    if (data && data.length > 0) {
      setSubmitted(true)
      try {
        const stored = localStorage.getItem('daily_cheer_v1')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.date === today && parsed.cheer) setAiCheer(parsed.cheer)
        }
      } catch {}
    } else {
      setSubmitted(false)
    }
  }
  const loadFeed = async () => {
    if (!myCohortId) return
    const currentCohort = cohorts.find(c => c.id === myCohortId)
    let query = supabase
      .from('feed')
      .select('*, profiles(*), comments(*, profiles(nickname))')
      .order('created_at', { ascending: false })
    if (currentCohort?.is_open) {
      const openIds = cohorts.filter(c => c.is_open).map(c => c.id)
      query = query.in('cohort_id', openIds.length > 0 ? openIds : [myCohortId])
    } else {
      query = query.eq('cohort_id', myCohortId)
    }
    const { data } = await query
    if (data) setFeed(data as FeedItem[])
  }

  const loadLounge = async () => {
    const { data } = await supabase
      .from('lounge')
      .select('*, profiles(*), comments(*, profiles(nickname))')
      .order('created_at', { ascending: false })
    if (data) setLounge(data as LoungePost[])
  }

  const loadNotice = async () => {
    const { data } = await supabase
      .from('notices')
      .select('*')
      .or(`cohort_id.eq.${myCohortId},cohort_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
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
  const loadCohortCounts = async () => {
    const { data } = await supabase.from('profiles').select('cohort_id').eq('is_approved', true)
    if (data) {
      const counts: Record<number, number> = {}
      data.forEach(p => { if (p.cohort_id) counts[p.cohort_id] = (counts[p.cohort_id] || 0) + 1 })
      setCohortCounts(counts)
    }
  }
  const loadCohortMembers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .not('nickname', 'is', null)
      .order('created_at', { ascending: true })
    if (data) setCohortMembers(data as Profile[])
  }
  const loadApplications = async () => {
    const { data } = await supabase
      .from('recruit_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setApplications(data)
  }

  const loadPending = async () => {
    const { data } = await supabase
      .from('pending_members')
      .select('*, profiles(*)')
      .order('created_at')
    if (data) setPendingMembers(data)
  }

  const loadFollowings = async () => {
    const { data } = await supabase.from('follows').select('following_id').eq('follower_id', session.user.id)
    if (data) setFollowings(new Set(data.map((f: any) => f.following_id)))
  }

  const loadTodayCompletion = async () => {
    if (!myCohortId) return
    const today = getKSTDateString()
    const { data } = await supabase
      .from('feed')
      .select('user_id')
      .eq('cohort_id', myCohortId)
      .gte('created_at', today + 'T00:00:00+09:00')
    if (data) setTodayCompletionCount(new Set(data.map((d: any) => d.user_id)).size)
  }

  const loadWeeklyStats = async () => {
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
    const thisMonday = new Date(today)
    thisMonday.setDate(today.getDate() - dayOfWeek + 1)
    thisMonday.setHours(0, 0, 0, 0)
    const lastMonday = new Date(thisMonday)
    lastMonday.setDate(thisMonday.getDate() - 7)
    const [thisWeekRes, lastWeekRes] = await Promise.all([
      supabase.from('feed').select('id').eq('user_id', session.user.id).gte('created_at', thisMonday.toISOString()),
      supabase.from('feed').select('id').eq('user_id', session.user.id).gte('created_at', lastMonday.toISOString()).lt('created_at', thisMonday.toISOString()),
    ])
    setWeeklyStats({ thisWeek: thisWeekRes.data?.length || 0, lastWeek: lastWeekRes.data?.length || 0 })
  }

  const fetchQuestion = async () => {
    const today = getKSTDateString()
    try {
      const stored = localStorage.getItem('daily_question_v1')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.date === today && parsed.question) {
          setQuestion(parsed.question)
          setQLoading(false)
          return
        }
      }
    } catch {}
    setQLoading(true)
    try {
      const res = await fetch('/api/question')
      const data = await res.json()
      const q = data.question
      setQuestion(q)
      try { localStorage.setItem('daily_question_v1', JSON.stringify({ date: today, question: q })) } catch {}
    } catch {
      setQuestion('10년 후의 나는 오늘의 어떤 선택에 가장 감사할까요?')
    }
    setQLoading(false)
  }

  useEffect(() => {
    loadProfile()
    loadCohorts()
    loadCohortCounts()
    loadCohortMembers()
    loadFollowings()
    fetchQuestion()
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTodaySubmitted()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // PWA 설치 감지
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
    if (isStandalone) {
      setIsInstalled(true)
    } else {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
      const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent)
      if (isIOS && isSafari) setShowIOSGuide(true)
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    const onAppInstalled = () => setIsInstalled(true)
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onAppInstalled)

    // 알림 권한 이미 허용된 경우 자동 구독
    if (Notification.permission === 'granted') setPushGranted(true)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  useEffect(() => {
    if (profileLoaded && profile?.nickname) {
      subscribePush().catch(() => {})
      setNotifTime(profile.notification_time || '')
    }
  }, [profileLoaded])

  useEffect(() => {
    if (myCohortId) {
      loadFeed()
      loadLounge()
      loadNotice()
      checkTodaySubmitted()
      loadReactions()
      loadCohortMembers()
      loadFollowings()
      loadTodayCompletion()
      loadWeeklyStats()
    }
  }, [myCohortId])

  useEffect(() => {
    if (isAdmin) { loadPending(); loadApplications() }
  }, [isAdmin])

  useEffect(() => {
    const channel = supabase.channel('realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feed' }, loadFeed)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lounge' }, loadLounge)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload) => {
        const data = payload.new as any
        if (data.user_id !== session.user.id) {
          const myFeedIds = feed.filter((f: any) => f.user_id === session.user.id).map((f: any) => f.id)
          const myLoungeIds = lounge.filter((p: any) => p.user_id === session.user.id).map((p: any) => p.id)
          if (myFeedIds.includes(data.feed_id) || myLoungeIds.includes(data.lounge_id)) showToast('💬 누군가 내 글에 댓글을 남겼어요!')
        }
        if (data.lounge_id) loadLounge()
        else loadFeed()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reactions' }, (payload) => {
        const data = payload.new as any
        if (data.user_id !== session.user.id) {
          const myFeedIds = feed.filter((f: any) => f.user_id === session.user.id).map((f: any) => f.id)
          if (data.target_type === 'feed' && myFeedIds.includes(data.target_id)) showToast(`${data.emoji} 누군가 내 기록에 반응을 남겼어요!`)
        }
        loadReactions()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [myCohortId])

  // ─── 핸들러 ────────────────────────────────────────────────
  const subscribePush = async () => {
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) return
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
      setPushGranted(true)
      const reg = await navigator.serviceWorker.ready
      if (!reg.pushManager) return

      // VAPID 키가 바뀌었으면 기존 구독 해제 후 재구독
      const storedKey = localStorage.getItem('push_vapid_key')
      const existing = await reg.pushManager.getSubscription()
      if (existing && storedKey !== vapidKey) await existing.unsubscribe()

      const sub = (!existing || storedKey !== vapidKey)
        ? await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) })
        : existing

      localStorage.setItem('push_vapid_key', vapidKey)
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, userId: session.user.id }),
      })
    } catch {}
  }

  const sendPush = (targetUserId: string, title: string, body: string) => {
    if (targetUserId === session.user.id) return
    fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, title, body }),
    }).catch(() => {})
  }

  const toggleFollow = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (followings.has(userId)) {
      const { error } = await supabase.from('follows').delete().eq('follower_id', session.user.id).eq('following_id', userId)
      if (!error) setFollowings(prev => { const s = new Set(prev); s.delete(userId); return s })
    } else {
      const { error } = await supabase.from('follows').insert({ follower_id: session.user.id, following_id: userId })
      if (!error) setFollowings(prev => new Set([...prev, userId]))
      else await loadFollowings()
    }
  }

  const saveNotifTime = async (time: string) => {
    setSavingNotif(true)
    setNotifTime(time)
    await supabase.from('profiles').update({ notification_time: time || null }).eq('id', session.user.id)
    if (time) await subscribePush().catch(() => {})
    setSavingNotif(false)
    showToast(time ? `⏰ ${time}에 기록 알림을 보내드릴게요!` : '알림 시간이 해제됐어요')
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  const saveProfile = async () => {
    if (!obNickname.trim()) return
    setObSaving(true)
    const activeCohort = cohorts.find(c => c.status === 'active') || cohorts[0] || null
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
        is_approved: true,
        cohort_id: activeCohort?.id || null,
        notification_time: notifTime || null,
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
        is_approved: true,
        cohort_id: activeCohort?.id || null,
        color: ['#1A1A1A', '#2D4A7A', '#5C3D7A', '#7A3D3D', '#2D6B4A', '#6B4A2D', '#3D5C7A', '#7A5C2D'][Math.floor(Math.random() * 8)],
        tags: [],
        notification_time: notifTime || null,
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

  const submitRecord = async () => {
    if (!myRecord.gratitude.trim() || !myRecord.goal.trim()) return
    setSubmitting(true)
    const { error } = await supabase.from('feed').insert({
      user_id: session.user.id,
      cohort_id: myCohortId,
      gratitude: myRecord.gratitude,
      goal: myRecord.goal,
      question: question || null,
      question_answer: myRecord.question_answer,
      is_private: myRecord.is_private,
    })
    if (!error) {
      setSubmitted(true)
      loadFeed()
      // 개인 맞춤 격려 문구 생성
      setCheerLoading(true)
      fetch('/api/cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gratitude: myRecord.gratitude,
          goal: myRecord.goal,
          answer: myRecord.question_answer,
        }),
      }).then(r => r.json()).then(d => {
        const cheer = d.cheer || ''
        setAiCheer(cheer)
        if (cheer) {
          try { localStorage.setItem('daily_cheer_v1', JSON.stringify({ date: getKSTDateString(), cheer })) } catch {}
        }
      }).catch(() => {}).finally(() => setCheerLoading(false))
      // streak 업데이트
      const today = getKSTDateString()
      const todayKST = new Date(today + 'T00:00:00+09:00')
      const yesterdayKST = new Date(todayKST.getTime() - 24 * 60 * 60 * 1000)
      const yesterdayStr = yesterdayKST.toISOString().split('T')[0]
      const { data: yesterdayFeed } = await supabase
        .from('feed')
        .select('id')
        .eq('user_id', session.user.id)
        .gte('created_at', yesterdayStr + 'T00:00:00+09:00')
        .lt('created_at', today + 'T00:00:00+09:00')
        .limit(1)
      const newStreak = yesterdayFeed && yesterdayFeed.length > 0 ? (profile?.streak || 0) + 1 : 1

      // 포인트 계산
      let earnedPoints = POINT_RULES.daily_record
      const streakBonusMap: Record<number, number> = {
        3: POINT_RULES.streak_3, 7: POINT_RULES.streak_7,
        14: POINT_RULES.streak_14, 21: POINT_RULES.streak_21, 30: POINT_RULES.streak_30,
      }
      if (streakBonusMap[newStreak]) earnedPoints += streakBonusMap[newStreak]

      // 뱃지 체크
      const currentBadges: string[] = (profile?.badges as string[]) || []
      const earnedBadges: string[] = []
      if (!currentBadges.includes('first_record')) earnedBadges.push('first_record')
      if (newStreak >= 3  && !currentBadges.includes('streak_3'))  earnedBadges.push('streak_3')
      if (newStreak >= 7  && !currentBadges.includes('streak_7'))  earnedBadges.push('streak_7')
      if (newStreak >= 14 && !currentBadges.includes('streak_14')) earnedBadges.push('streak_14')
      if (newStreak >= 21 && !currentBadges.includes('streak_21')) earnedBadges.push('streak_21')
      if (newStreak >= 30 && !currentBadges.includes('streak_30')) earnedBadges.push('streak_30')
      if ((profile?.challenge_round || 1) >= 2 && !currentBadges.includes('round_2')) earnedBadges.push('round_2')
      const newBadgeIds = [...currentBadges, ...earnedBadges]
      const newPoints = (profile?.points || 0) + earnedPoints
      const { level: newLevel } = getLevel(newPoints)

      await supabase.from('profiles').update({
        streak: newStreak,
        points: newPoints,
        level: newLevel,
        total_days: (profile?.total_days || 0) + 1,
        badges: newBadgeIds,
      }).eq('id', session.user.id)

      // 새 뱃지 획득 팝업
      if (earnedBadges.length > 0) {
        const badge = BADGES.find(b => b.id === earnedBadges[0])
        if (badge) {
          setNewBadge(badge)
          setShowBadgePopup(true)
          setTimeout(() => setShowBadgePopup(false), 3500)
        }
      }

      loadProfile()
      loadTodayCompletion()
    }
    setSubmitting(false)
  }

  const handleReact = async (type: 'feed' | 'lounge', targetId: number, emoji: string) => {
    const key = `${type}-${targetId}-${emoji}`, on = reactions[key]
    if (on) {
      const { error } = await supabase.from('reactions').delete()
        .eq('user_id', session.user.id).eq('target_type', type).eq('target_id', targetId).eq('emoji', emoji)
      if (error) return
    } else {
      const { error } = await supabase.from('reactions').insert({ user_id: session.user.id, target_type: type, target_id: targetId, emoji })
      if (error) return
      const owner = type === 'feed'
        ? feed.find(f => f.id === targetId)
        : lounge.find(p => p.id === targetId)
      if (owner) sendPush(owner.user_id, `${emoji} 새 반응`, `${profile?.nickname || '누군가'}님이 반응을 남겼어요`)
      // first_reaction 뱃지
      const rb: string[] = (profile?.badges as string[]) || []
      if (!rb.includes('first_reaction')) {
        const nb = [...rb, 'first_reaction']
        await supabase.from('profiles').update({ badges: nb }).eq('id', session.user.id)
        setNewBadge(BADGES.find(b => b.id === 'first_reaction') || null)
        setShowBadgePopup(true)
        setTimeout(() => setShowBadgePopup(false), 3500)
        loadProfile()
      }
    }
    setReactions(p => ({ ...p, [key]: !on }))
    loadReactions()
  }

  const submitComment = async (feedId: number) => {
    const text = (commentInput[feedId] || '').trim()
    if (!text) return
    await supabase.from('comments').insert({ user_id: session.user.id, feed_id: feedId, content: text })
    setCommentInput(p => ({ ...p, [feedId]: '' }))
    const owner = feed.find(f => f.id === feedId)
    if (owner) sendPush(owner.user_id, '💬 새 댓글', `${profile?.nickname || '누군가'}님이 댓글을 남겼어요`)
    // first_comment 뱃지
    const cb: string[] = (profile?.badges as string[]) || []
    if (!cb.includes('first_comment')) {
      const nb = [...cb, 'first_comment']
      await supabase.from('profiles').update({ badges: nb }).eq('id', session.user.id)
      setNewBadge(BADGES.find(b => b.id === 'first_comment') || null)
      setShowBadgePopup(true)
      setTimeout(() => setShowBadgePopup(false), 3500)
      loadProfile()
    }
    loadFeed()
  }

  const submitLoungeComment = async (loungeId: number) => {
    const text = (loungeCommentInput[loungeId] || '').trim()
    if (!text) return
    await supabase.from('comments').insert({ user_id: session.user.id, lounge_id: loungeId, content: text })
    const owner = lounge.find(p => p.id === loungeId)
    if (owner) sendPush(owner.user_id, '💬 새 댓글', `${profile?.nickname || '누군가'}님이 댓글을 남겼어요`)
    setLoungeCommentInput(p => ({ ...p, [loungeId]: '' }))
    loadLounge()
  }

  const submitPost = async () => {
    if (!newPost.trim() || posting) return
    setPosting(true)
    let imageUrl = null
    if (postImage) {
      const ext = postImage.name.split('.').pop() || 'jpg'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('images').upload(filename, postImage, { contentType: postImage.type })
      if (uploadError) { alert('이미지 업로드 실패: ' + uploadError.message); return }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filename)
      imageUrl = publicUrl
    }
    await supabase.from('lounge').insert({
      user_id: session.user.id, cohort_id: null,
      content: newPost, tag: postTags.join(' ') || null, image_url: imageUrl,
    })
    setNewPost(''); setPostTags([]); setPostImage(null); setPostImagePreview(null); setShowPostInput(false)
    setPosting(false)
    loadLounge()
  }

  const submitCheer = async () => {
    if (!cheerInput.trim() || !profile?.cohort_id) return
    setCheerPosting(true)
    await supabase.from('lounge').insert({
      user_id: session.user.id,
      cohort_id: profile.cohort_id,
      content: cheerInput.trim(),
      tag: '#기수응원',
      image_url: null,
    })
    setCheerInput('')
    setCheerPosting(false)
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

  const doCopyShare = async () => {
    if (!shareModal) return
    try { await navigator.clipboard.writeText(shareModal.text) } catch {}
    setCopiedShare(true)
    setTimeout(() => { setCopiedShare(false); setShareModal(null) }, 2000)
  }

  const doAppShare = async () => {
    if (!shareModal) return
    if (navigator.share) {
      try { await navigator.share({ title: '우라주 챌린지', text: shareModal.text, url: shareModal.url }); setShareModal(null); return } catch {}
    }
    await doCopyShare()
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
  }

  const startNewRound = async () => {
    const newRound = (profile?.challenge_round || 1) + 1
    await supabase.from('profiles').update({
      challenge_started_at: new Date().toISOString(),
      challenge_round: newRound,
    }).eq('id', session.user.id)
    await loadProfile()
  }

  const saveCohort = async () => {
    if (!editingCohort) return
    await supabase.from('cohorts').update({ start_date: editingCohort.start_date, end_date: editingCohort.end_date, status: editingCohort.status, max_slots: editingCohort.max_slots }).eq('id', editingCohort.id)
    setEditingCohort(null); loadCohorts()
  }

  const saveProfileEdit = async () => {
    setSavingProfile(true)
    const tags = typeof editData.tags === 'string'
      ? editData.tags.split(' ').filter((t: string) => t.startsWith('#'))
      : editData.tags
    const updates = { nickname: editData.nickname, intro: editData.intro, tags, threads_id: editData.threads_id || null, insta_id: editData.insta_id || null, naver_blog: editData.naver_blog || null }
    const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id)
    setSavingProfile(false)
    if (error) { alert('저장 실패: ' + error.message); return }
    setProfile(p => p ? { ...p, ...updates } : p)
    setCohortMembers(prev => prev.map(m => m.id === session.user.id ? { ...m, ...updates } : m))
    setEditingProfile(false)
    setSelectedProfile(null)
    showToast('프로필이 수정됐어요 ✓')
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
      const post = lounge.find(p => p.id === editingPostId)
      await supabase.from('lounge').update({ content: editingPostText, tag: post?.tag || null }).eq('id', editingPostId)
      loadLounge()
    }
    setEditingPostId(null); setEditingPostText(''); setEditingPostType(null)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // FIX 6b: Save feed item edits
  const saveFeedEdit = async () => {
    if (!editingFeedItem) return
    await supabase.from('feed').update({
      gratitude: editingFeedItem.gratitude,
      goal: editingFeedItem.goal,
      question_answer: editingFeedItem.question_answer,
    }).eq('id', editingFeedItem.id)
    loadFeed()
    setEditingFeedItem(null)
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
    .install-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--black);gap:10px;}
    .install-bar-txt{font-size:12px;font-weight:700;color:white;line-height:1.4;}
    .install-bar-sub{font-size:10px;font-weight:400;color:rgba(255,255,255,0.55);display:block;margin-top:1px;}
    .install-bar-btn{flex-shrink:0;background:white;color:var(--black);border:none;border-radius:20px;padding:7px 14px;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap;}
    .install-bar-close{flex-shrink:0;background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:4px;line-height:1;font-size:16px;}
    .ios-guide{background:var(--black);padding:12px 16px 14px;position:relative;}
    .ios-guide-title{font-size:12px;font-weight:700;color:white;margin-bottom:8px;}
    .ios-guide-steps{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
    .ios-guide-step{display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,0.75);font-weight:500;}
    .ios-guide-step-icon{font-size:15px;line-height:1;}
    .ios-guide-arrow{color:rgba(255,255,255,0.3);font-size:10px;}
    .ios-guide-close{position:absolute;top:10px;right:12px;background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:16px;line-height:1;padding:2px;}
    .hdr{padding:14px 18px 12px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;background:rgba(247,247,247,0.92);backdrop-filter:blur(18px);border-bottom:1px solid var(--border);}
    .hdr-wm{font-size:17px;font-weight:900;letter-spacing:-0.8px;color:var(--black);}
    .hdr-sub{font-size:10px;color:var(--ink3);margin-top:2px;}
    .hdr-r{display:flex;align-items:center;gap:8px;}
    .hdr-chip{background:var(--black);color:white;font-size:10px;font-weight:700;padding:5px 12px;border-radius:40px;}
    .tab-bar{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:358px;background:var(--white);border:1px solid var(--border2);border-radius:32px;display:flex;z-index:20;padding:5px;gap:2px;box-shadow:0 4px 20px rgba(0,0,0,0.08);}
    .tab-btn{flex:1;padding:9px 0 8px;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;font-size:9px;font-weight:700;letter-spacing:0.3px;border-radius:26px;transition:all 0.2s;color:var(--ink3);}
    .tab-btn.on{background:var(--black);color:white;}
    .write-section{padding:16px 16px 0;}
    .write-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);overflow:visible;box-shadow:var(--sh);}
    .wc-bar{height:3px;background:var(--black);border-radius:var(--r2) var(--r2) 0 0;}
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
    .grid-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:16px;margin:0 16px 12px;box-shadow:var(--sh);}
    .grid-wrap{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:12px;}
    .grid-cell{aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:9px;font-weight:700;position:relative;}
    .grid-cell.done{background:var(--black);color:white;}
    .grid-cell.today{background:var(--black);color:white;box-shadow:0 0 0 2.5px white,0 0 0 4px var(--black);}
    .grid-cell.today-empty{background:none;border:2px solid var(--black);color:var(--black);}
    .grid-cell.missed{background:var(--surface);color:var(--border2);}
    .grid-cell.future{background:var(--surface);color:var(--border);}
    .grid-cell-num{font-size:10px;font-weight:900;line-height:1;}
    .grid-cell-check{font-size:8px;margin-top:1px;opacity:0.7;}
    .round-complete{margin:16px 16px 0;background:var(--black);border-radius:var(--r2);padding:22px 20px;text-align:center;}
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
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: 12 }}>시작하기</div>
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

          <div style={{ fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 7 }}>매일 기록 알림 시간</div>
          <div style={{ fontSize: 11, color: '#bbb', marginBottom: 12 }}>선택한 시간부터 기록 안 하면 최대 4번 리마인더가 와요</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 28 }}>
            {[
              { time: '07:00', label: '🌅 오전 7시' },
              { time: '11:30', label: '☀️ 오전 11시 반' },
              { time: '18:30', label: '🌆 오후 6시 반' },
              { time: '21:00', label: '🌙 밤 9시' },
            ].map(({ time, label }) => (
              <button
                key={time}
                type="button"
                onClick={() => setNotifTime(t => t === time ? '' : time)}
                style={{ flex: '1 0 calc(50% - 4px)', padding: '12px 8px', borderRadius: 14, border: notifTime === time ? '2px solid #0A0A0A' : '1.5px solid #E0E0E0', background: notifTime === time ? '#0A0A0A' : 'white', color: notifTime === time ? 'white' : '#666', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setNotifTime('')}
              style={{ flex: '1 0 100%', padding: '10px', borderRadius: 14, border: notifTime === '' ? '2px solid #0A0A0A' : '1.5px solid #E0E0E0', background: notifTime === '' ? '#0A0A0A' : 'white', color: notifTime === '' ? 'white' : '#999', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              알림 없음
            </button>
          </div>

          <button className="ob-btn" onClick={saveProfile} disabled={!obNickname.trim() || obSaving}>
            {obSaving ? '저장 중...' : '챌린지 시작하기 🌿'}
          </button>
        </div>
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
            { title: '이용약관', text: '• 타인을 비방하는 내용은 관리자 판단 하에 삭제될 수 있어요.\n• 챌린지 기록은 커뮤니티 멤버들과 공유돼요.\n• 서비스 운영 정책은 사전 공지 후 변경될 수 있어요.' },
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
            {(mp?.challenge_round || 1) >= 2 && <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: '#2D4A7A', padding: '2px 6px', borderRadius: 20, marginLeft: 4 }}>{mp.challenge_round}R</span>}
            {item.is_private && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--ink3)', background: 'var(--surface)', padding: '2px 7px', borderRadius: 20, marginLeft: 4 }}>나만</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>{formatTime(item.created_at)}</div>
              {isMe && <>
                <button onClick={() => setEditingFeedItem({ id: item.id, gratitude: item.gratitude, goal: item.goal, question_answer: item.question_answer })} style={{ fontSize: 10, color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>수정</button>
                <button onClick={async () => { if (!confirm('삭제할까요?')) return; await supabase.from('feed').delete().eq('id', item.id); setSubmitted(false); loadFeed() }} style={{ fontSize: 10, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>삭제</button>
              </>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
          <span className="fc-badge">🙏 오늘의 감사</span><span className="fc-text">{item.gratitude}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
          <span className="fc-badge">🎯 오늘의 목표</span><span className="fc-text">{item.goal}</span>
        </div>
        <div className="fc-q">
          <div className="fc-q-lbl">✦ QUESTION</div>
          {item.question && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 5 }}>{item.question}</div>}
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
              {(item.comments || []).length > 0 && <span>{(item.comments || []).length}</span>}
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

  const renderToday = () => {
    const myCohortMemberCount = cohortMembers.filter(m => m.cohort_id === myCohortId).length
    const todayStr = getKSTDateString()
    const cheerMessages = lounge.filter(p =>
      p.tag === '#기수응원' && p.cohort_id === myCohortId
    ).slice(0, 5)

    return (
    <>
      {todayCompletionCount > 0 && (
        <div style={{ margin: '14px 16px 0', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <div style={{ flex: 1 }}>
            {profile?.cohort_id ? (
              <>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)' }}>우리 기수 {todayCompletionCount}/{myCohortMemberCount}명</span>
                <span style={{ fontSize: 13, color: 'var(--ink2)' }}> 완료!</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)' }}>오늘 {todayCompletionCount}명</span>
                <span style={{ fontSize: 13, color: 'var(--ink2)' }}>이 이미 기록했어요</span>
              </>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', background: 'var(--surface)', padding: '3px 9px', borderRadius: 20, border: '1px solid var(--border)', whiteSpace: 'nowrap' as const }}>나도 하기!</span>
        </div>
      )}
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
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)' }}>30일 챌린지가 종료됐어요 🎉</div>
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
                  <div className="wc-done-cheer">
                    {cheerLoading ? (
                      <span style={{ color: 'var(--ink3)' }}>응원 문구 생성 중...</span>
                    ) : (aiCheer || cheerMsg)}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.4px' }}>오늘의 기록</span>
                    <span style={{ fontSize: 10, color: 'var(--ink3)', background: 'var(--surface)', padding: '3px 9px', borderRadius: 20, border: '1px solid var(--border)' }}>Day {challengeDay} / 30</span>
                  </div>
                  {[
                    { key: 'gratitude', dot: '#1A1A1A', label: '오늘의 감사', ph: '오늘 감사한 것, 작은 것도 충분해요!' },
                    { key: 'goal', dot: '#555', label: '오늘의 목표', ph: '오늘 딱 하나만 이룬다면? (작게 써도 좋아요)' },
                  ].map(({ key, dot, label, ph }) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink2)' }}>{label}</span>
                      </div>
                      <textarea className="wc-ta" rows={2} placeholder={ph} value={(myRecord as any)[key]} onChange={e => setMyRecord(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div onClick={() => setMyRecord(p => ({ ...p, is_private: !p.is_private }))} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 13px', background: 'var(--surface)', borderRadius: 10, cursor: 'pointer' }}>
                    <Icon name={myRecord.is_private ? 'eyeOff' : 'eye'} size={16} color="var(--ink2)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink2)', flex: 1 }}>{myRecord.is_private ? '나만 보기 (비공개)' : '그룹과 공유'}</span>
                    <div style={{ width: 36, height: 20, borderRadius: 10, background: myRecord.is_private ? 'var(--black)' : 'var(--border2)', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ position: 'absolute', top: 2, left: myRecord.is_private ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#999' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink2)' }}>오늘의 질문</span>
                      <span style={{ fontSize: 10, color: 'var(--ink3)' }}>(선택)</span>
                    </div>
                    <div className="wc-q-box">
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>✦ AI DAILY QUESTION</div>
                      {qLoading ? <><div className="wc-shimmer" /><div className="wc-shimmer s" /></> : <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.7 }}>{question}</div>}
                    </div>
                    <textarea className="wc-ta" rows={2} placeholder="자유롭게 한 줄이라도!" value={myRecord.question_answer} onChange={e => setMyRecord(p => ({ ...p, question_answer: e.target.value }))} />
                  </div>
                  <button className="wc-submit" disabled={!myRecord.gratitude.trim() || !myRecord.goal.trim() || submitting} onClick={submitRecord}>{submitting ? '공유 중...' : '공유하기'}</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 기수 응원 한마디 — 기수 멤버 전용 */}
      {profile?.cohort_id && !isEnded && (
        <div style={{ margin: '12px 16px 0', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--sh)' }}>
          <div style={{ padding: '11px 14px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink2)', marginBottom: 8 }}>💬 기수 응원 한마디</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit' }}
                placeholder="기수 멤버들에게 한마디!"
                value={cheerInput}
                onChange={e => setCheerInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitCheer()}
                maxLength={60}
              />
              <button
                onClick={submitCheer}
                disabled={!cheerInput.trim() || cheerPosting}
                style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 10, padding: '0 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: !cheerInput.trim() ? 0.4 : 1, flexShrink: 0 }}>
                전송
              </button>
            </div>
          </div>
          {cheerMessages.length > 0 && (
            <div style={{ padding: '8px 14px 11px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cheerMessages.map(post => {
                const poster = post.profiles as Profile
                return (
                  <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: poster?.color || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'white', flexShrink: 0 }}>
                      {poster?.nickname?.[0] || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink2)', marginRight: 5 }}>{poster?.nickname}</span>
                      <span style={{ fontSize: 12, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{post.content}</span>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--ink3)', flexShrink: 0 }}>{formatTime(post.created_at)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="sec-label">
        {isEnded ? '지난 기록 보관함' : '멤버들의 오늘'}
        <span className="sec-sub">{displayFeed.length}개</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {(['all', 'following'] as const).map(f => (
            <button key={f} onClick={() => setFeedFilter(f)} style={{ fontSize: 10, fontWeight: 700, border: '1.5px solid', borderColor: feedFilter === f ? 'var(--black)' : 'var(--border)', borderRadius: 20, padding: '3px 9px', background: feedFilter === f ? 'var(--black)' : 'transparent', color: feedFilter === f ? 'white' : 'var(--ink3)', cursor: 'pointer' }}>
              {f === 'all' ? '전체' : '팔로잉'}
            </button>
          ))}
        </div>
      </div>
      {feedFilter === 'following' && followings.size === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--ink3)', fontSize: 13 }}>팔로우한 멤버가 없어요. 그룹 탭에서 팔로우해보세요!</div>
      )}
      {displayFeed.map((item, index) => (
        <div key={item.id}>
          {renderFeedCard(item)}
          {(index + 1) % 3 === 0 && index !== displayFeed.length - 1 && (
            <AdBanner adUnitId="DAN-XXXXXXXXXX" width={320} height={50} />
          )}
        </div>
      ))}
    </>
    )
  }

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
          {postImagePreview && (
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <img src={postImagePreview} style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 10 }} alt="preview" />
              <button onClick={() => { setPostImage(null); setPostImagePreview(null) }} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 12 }}>✕</button>
            </div>
          )}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--ink3)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 11px', marginBottom: 10, cursor: 'pointer' }}>
            📷 사진 추가
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              setPostImage(file)
              const reader = new FileReader()
              reader.onload = ev => setPostImagePreview(ev.target?.result as string)
              reader.readAsDataURL(file)
            }} />
          </label>
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
            <button style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 12, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: posting ? 0.6 : 1 }} disabled={posting} onClick={submitPost}>{posting ? '올리는 중...' : '공유하기'}</button>
            <button style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--ink3)', cursor: 'pointer' }} onClick={() => { setShowPostInput(false); setNewPost(''); setPostTags([]); setShowCustomTag(false) }}>취소</button>
          </div>
        </div>
      )}
      {lounge.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink3)', fontSize: 13 }}>아직 글이 없어요. 첫 번째로 남겨봐요!</div>}
      {lounge.map((post, index) => {
        const mp = post.profiles as Profile, isMe = post.user_id === session.user.id
        return (
          <div key={post.id}>
          {(index > 0 && index % 4 === 0) && <AdBanner adUnitId="DAN-XXXXXXXXXX" width={320} height={100} />}
          <div className="lc">
            {post.image_url && <img src={post.image_url} style={{ width: '100%', height: 164, objectFit: 'cover', display: 'block' }} alt="" />}
            <div className="lc-body">
              <div className="lc-top">
                <div className="av" style={{ width: 30, height: 30, fontSize: 11, background: mp?.color || '#333' }} onClick={() => setSelectedProfile(mp)}>{mp?.nickname?.[0] || '?'}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)', cursor: 'pointer' }} onClick={() => setSelectedProfile(mp)}>{mp?.nickname}</span>
                {mp?.cohort_id && getCohortLabel(mp.cohort_id) && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: cohortColors[(mp.cohort_id - 1) % cohortColors.length], padding: '2px 6px', borderRadius: 20, flexShrink: 0 }}>
                    {getCohortLabel(mp.cohort_id)}
                  </span>
                )}
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
                <button className="cmt-btn" onClick={() => setExpandedLoungeComments(p => ({ ...p, [post.id]: !p[post.id] }))}>
                  <Icon name="chat" size={13} color="var(--ink3)" />
                  {((post as any).comments || []).length > 0 && <span>{((post as any).comments || []).length}</span>}
                </button>
                <button className="cmt-btn" style={{ marginLeft: 'auto' }} onClick={() => openShare(post, 'lounge')}><Icon name="share" size={13} color="var(--ink3)" /><span>공유</span></button>
              </div>
              {expandedLoungeComments[post.id] && (
                <div className="cmt-area">
                  {((post as any).comments || []).map((c: any, i: number) => (
                    <div key={i} className="cmt-item">
                      <span className="cmt-author">{c.profiles?.nickname || '알 수 없음'}</span>
                      <span className="cmt-text">{c.content}</span>
                    </div>
                  ))}
                  <div className="cmt-row">
                    <input className="cmt-input" placeholder="한마디 남기기..." value={loungeCommentInput[post.id] || ''} onChange={e => setLoungeCommentInput(p => ({ ...p, [post.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submitLoungeComment(post.id)} />
                    <button className="cmt-send" onClick={() => submitLoungeComment(post.id)}><Icon name="send" size={13} color="white" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        )
      })}
    </>
  )

  const renderRecord = () => {
    const todayKST = getKSTDateString()
    const myFeedDateSet = new Set(
      feed
        .filter(f => f.user_id === session.user.id)
        .map(f => {
          const kst = new Date(new Date(f.created_at).getTime() + 9 * 60 * 60 * 1000)
          return kst.toISOString().split('T')[0]
        })
    )
    const yesterdayKST = new Date(new Date(todayKST + 'T00:00:00+09:00').getTime() - 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]
    const streakAtRisk = !submitted && !myFeedDateSet.has(yesterdayKST) && (profile?.streak || 0) > 1
    const gridCells = Array.from({ length: 30 }, (_, i) => {
      const dayDate = new Date(challengeStartDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dayKST = new Date(dayDate.getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
      const isToday = dayKST === todayKST
      const isFuture = dayKST > todayKST
      const done = myFeedDateSet.has(dayKST)
      let cellClass = 'grid-cell '
      if (isToday) cellClass += done ? 'today' : 'today-empty'
      else if (isFuture) cellClass += 'future'
      else cellClass += done ? 'done' : 'missed'
      return { dayNum: i + 1, cellClass, done, isFuture }
    })

    return (
      <>
        {challengeEnded && (
          <div className="round-complete">
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 6 }}>
              {challengeRound}라운드 완료!
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 18, lineHeight: 1.6 }}>
              30일을 모두 해냈어요.<br />다음 라운드를 이어가볼까요?
            </div>
            <button
              onClick={startNewRound}
              style={{ background: 'white', color: 'var(--black)', border: 'none', borderRadius: 14, padding: '12px 28px', fontSize: 14, fontWeight: 900, cursor: 'pointer' }}
            >
              {challengeRound + 1}라운드 시작하기 →
            </button>
          </div>
        )}

        <div className="streak-hero" style={{ marginTop: challengeEnded ? 12 : 16 }}>
          <div className="sh-blob" />
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>
            ROUND {challengeRound} · STREAK
          </div>
          <div>
            <span style={{ fontSize: 52, fontWeight: 900, color: 'white', letterSpacing: '-2px' }}>{profile?.streak || 0}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>일 연속</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5, marginBottom: 14 }}>
            {challengeEnded ? '챌린지 완료! 🎉' : `Day ${challengeDay} / 30 · ${30 - challengeDay}일 남았어요`}
          </div>
          <div className="sh-bar-bg">
            <div className="sh-bar-fill" style={{ width: `${Math.min(100, (challengeDay / 30) * 100)}%` }} />
          </div>
          {/* 스트릭 보호권: 어제 기록 없고 오늘 아직 미제출 상태일 때 표시 */}
          {streakAtRisk && (
            <button
              onClick={() => {
                // TODO: streak_shield 필드를 true로 업데이트하고 streak 유지 처리
                // await supabase.from('profiles').update({ streak_shield: true }).eq('id', session.user.id)
                alert('스트릭 보호권 기능은 준비 중이에요!')
              }}
              style={{ marginTop: 12, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '9px 16px', fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
              🛡️ 스트릭 보호권 사용하기 ({profile?.streak || 0}일 스트릭 보호)
            </button>
          )}
        </div>

        <div className="grid-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)' }}>30일 챌린지 현황</span>
            <span style={{ fontSize: 11, color: 'var(--ink3)' }}>
              {gridCells.filter(c => c.done).length} / 30 완료
            </span>
          </div>
          <div className="grid-wrap">
            {gridCells.map(({ dayNum, cellClass, done, isFuture }) => (
              <div key={dayNum} className={cellClass}>
                <span className="grid-cell-num">{dayNum}</span>
                {!isFuture && <span className="grid-cell-check">{done ? '✓' : '✗'}</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 10, color: 'var(--ink3)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--black)', borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} />완료</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--surface)', borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} />미완료</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid var(--black)', borderRadius: 3, marginRight: 4, verticalAlign: 'middle' }} />오늘</span>
          </div>
        </div>

        <div className="stats-grid">
          {[
            ['내 기록', `${feed.filter(f => f.user_id === session.user.id).length}개`],
            ['연속 스트릭', `${profile?.streak || 0}일`],
            ['이번 라운드', `${gridCells.filter(c => c.done).length}일`],
            ['받은 반응', `${Object.entries(reactionCounts).filter(([k]) => feed.filter(f => f.user_id === session.user.id).some(f => k.startsWith(`feed-${f.id}-`))).reduce((a, [, v]) => a + v, 0)}개`],
          ].map(([l, v]) => (
            <div key={l} className="stat-card">
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--black)' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="grid-card" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)' }}>📊 주간 리포트</span>
            {weeklyStats.thisWeek > weeklyStats.lastWeek
              ? <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '3px 9px', borderRadius: 20 }}>↑ 지난주보다 {weeklyStats.thisWeek - weeklyStats.lastWeek}일 더!</span>
              : weeklyStats.thisWeek < weeklyStats.lastWeek
              ? <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '3px 9px', borderRadius: 20 }}>↓ {weeklyStats.lastWeek - weeklyStats.thisWeek}일 적어요</span>
              : <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', background: 'var(--surface)', padding: '3px 9px', borderRadius: 20 }}>지난주와 동일</span>
            }
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ label: '이번 주', value: weeklyStats.thisWeek }, { label: '지난 주', value: weeklyStats.lastWeek }].map(({ label, value }) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'var(--ink3)', marginBottom: 5 }}>{label}</div>
                <div style={{ height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--black)', borderRadius: 3, width: `${Math.min(100, (value / 7) * 100)}%`, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)', marginTop: 4 }}>{value}일 <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--ink3)' }}>/ 7</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-card" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)' }}>🎮 성장 레벨</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--black)' }}>{getLevel(profile?.points || 0).title}</span>
          </div>
          {(() => {
            const lv = getLevel(profile?.points || 0)
            const pct = lv.next ? Math.min(100, ((profile?.points || 0) / lv.next) * 100) : 100
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>Lv.{lv.level}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--black)' }}>{profile?.points || 0}P {lv.next ? `/ ${lv.next}P` : '(MAX)'}</span>
                </div>
                <div style={{ height: 8, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--black)', borderRadius: 4, width: `${pct}%`, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 6 }}>기록 +10P · 스트릭 달성 보너스 최대 +300P</div>
              </>
            )
          })()}
        </div>

        <div className="grid-card" style={{ marginTop: 8, marginBottom: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)', marginBottom: 12 }}>🏅 뱃지 컬렉션</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {BADGES.map(badge => {
              const earned = ((profile?.badges as string[]) || []).includes(badge.id)
              return (
                <div key={badge.id} style={{ background: earned ? 'var(--black)' : 'var(--surface)', borderRadius: 12, padding: '10px 8px', textAlign: 'center', border: `1px solid ${earned ? 'var(--black)' : 'var(--border)'}`, opacity: earned ? 1 : 0.45 }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{badge.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: earned ? 'white' : 'var(--ink3)', lineHeight: 1.3 }}>{badge.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="sec-label">나의 기록<span className="sec-sub">최근 순</span></div>
        {feed.filter(f => f.user_id === session.user.id).slice(0, 10).map(item => (
          <div key={item.id} className="hist-card">
            <div className="hist-date">{formatTime(item.created_at)}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}><span className="fc-badge">🙏 오늘의 감사</span><span className="fc-text">{item.gratitude}</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><span className="fc-badge">🎯 오늘의 목표</span><span className="fc-text">{item.goal}</span></div>
          </div>
        ))}
      </>
    )
  }

  const renderPlaza = () => {
    const byCohort: Record<string, Profile[]> = {}
    cohortMembers.forEach(m => {
      if (!m.cohort_id) return
      const key = String(m.cohort_id)
      if (!byCohort[key]) byCohort[key] = []
      byCohort[key].push(m)
    })
    const standaloneMembers = cohortMembers.filter(m => !m.cohort_id)
    const todayStr = getKSTDateString()
    const recruitingCohort = cohorts.find(c => c.is_recruiting)
    const showCTA = !isAdmin && !profile?.cohort_id && !!recruitingCohort

    const renderMemberCard = (m: Profile, accentColor: string) => {
      const doneToday = feed.some(f => f.user_id === m.id && f.created_at >= todayStr + 'T00:00:00+09:00')
      return (
        <div key={m.id} onClick={() => setSelectedProfile(m)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: m.color || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: 'white', border: doneToday ? `2.5px solid ${accentColor}` : '2px solid transparent' }}>
              {m.nickname?.[0] || '?'}
            </div>
            {doneToday && <span style={{ position: 'absolute', bottom: -3, right: -3, fontSize: 10, lineHeight: 1 }}>✅</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)' }}>{m.nickname}</div>
            {m.intro
              ? <div style={{ fontSize: 11, color: 'var(--ink3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{m.intro}</div>
              : <div style={{ fontSize: 11, color: 'var(--border2)' }}>소개 없음</div>
            }
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', flexShrink: 0 }}>{m.streak || 0}일 🔥</div>
        </div>
      )
    }

    return (
      <>
        {/* 히어로 배너 */}
        <div style={{ margin: '16px 16px 0', background: 'var(--black)', borderRadius: 'var(--r2)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: 4 }}>OORAJOO CHALLENGE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>우라주 광장 🌍</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            모든 멤버들이 모여있어요.<br />총 {cohortMembers.length}명이 함께 성장 중이에요.
          </div>
        </div>

        {/* 스트릭 TOP5 */}
        <div style={{ margin: '12px 16px 0', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '15px', boxShadow: 'var(--sh)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)', marginBottom: 12 }}>🏆 스트릭 TOP 5</div>
          {[...cohortMembers].sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5).map((m, i) => (
            <div key={m.id} onClick={() => setSelectedProfile(m)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 4 ? 10 : 0, cursor: 'pointer' }}>
              <div style={{ width: 22, textAlign: 'center', fontSize: 14, flexShrink: 0 }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--ink3)' }}>{i + 1}</span>}
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: m.color || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: 'white', flexShrink: 0 }}>
                {m.nickname?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)' }}>{m.nickname}</span>
                  {m.cohort_id && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: cohortColors[(m.cohort_id - 1) % cohortColors.length], padding: '1px 6px', borderRadius: 20 }}>
                      {getCohortLabel(m.cohort_id)}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)' }}>{m.streak || 0}일 🔥</div>
            </div>
          ))}
        </div>

        {/* 기수 미참여 유저 신청 CTA */}
        {showCTA && (
          <div style={{ margin: '12px 16px 0', background: 'var(--black)', borderRadius: 'var(--r2)', padding: '18px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(74,222,128,0.10) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.25)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>모집 중</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: 'white', marginBottom: 4 }}>다음 기수에 함께해요</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
              {recruitingCohort!.title || '다음 기수'} · 소수 정예 · 30일 챌린지
            </div>
            {recruitingCohort!.recruit_link ? (
              <a href={recruitingCohort!.recruit_link} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#4ADE80', color: '#0A0A0A', borderRadius: 20, padding: '8px 18px', fontSize: 12, fontWeight: 900, textDecoration: 'none' }}>
                신청하기 →
              </a>
            ) : (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>관리자에게 문의해주세요 · oorajoo@naver.com</div>
            )}
          </div>
        )}

        {/* 기수별 멤버 카드 */}
        {cohorts.map(cohort => {
          const members = byCohort[String(cohort.id)] || []
          if (members.length === 0) return null
          const color = cohortColors[(cohort.id - 1) % cohortColors.length]
          const completedToday = members.filter(m =>
            feed.some(f => f.user_id === m.id && f.created_at >= todayStr + 'T00:00:00+09:00')
          ).length
          return (
            <div key={cohort.id} style={{ margin: '12px 16px 0', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', boxShadow: 'var(--sh)' }}>
              <div style={{ background: color, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>{cohort.title || `${cohort.id}기`}</span>
                    {cohort.is_open && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 7px', borderRadius: 20 }}>상시</span>}
                  </div>
                  {cohort.description && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{cohort.description}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>{members.length}명</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>오늘 {completedToday}명 완료</div>
                </div>
              </div>
              <div style={{ height: 3, background: 'rgba(0,0,0,0.06)' }}>
                <div style={{ height: '100%', background: color, transition: 'width 0.5s', width: members.length > 0 ? `${(completedToday / members.length) * 100}%` : '0%' }} />
              </div>
              <div style={{ padding: '0 14px' }}>
                {members.map(m => renderMemberCard(m, color))}
                {cohort.is_recruiting && (
                  <div style={{ margin: '10px 0', background: 'var(--surface)', borderRadius: 10, padding: '10px 13px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--black)' }}>🎉 지금 모집 중이에요!</div>
                      <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>함께 30일 챌린지 도전해봐요</div>
                    </div>
                    {cohort.recruit_link && (
                      <a href={cohort.recruit_link} target="_blank" rel="noreferrer" style={{ background: color, color: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 900, textDecoration: 'none', flexShrink: 0 }}>신청하기</a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* 상시 멤버 섹션 */}
        {standaloneMembers.length > 0 && (
          <div style={{ margin: '12px 16px 0', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', boxShadow: 'var(--sh)' }}>
            <div style={{ background: '#4A4A4A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>상시 멤버</span>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>기수 없이 자유롭게 참여 중</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>{standaloneMembers.length}명</div>
            </div>
            <div style={{ padding: '0 14px' }}>
              {standaloneMembers.map(m => renderMemberCard(m, '#4A4A4A'))}
            </div>
          </div>
        )}

        <div style={{ height: 20 }} />
      </>
    )
  }

  const renderGroup = () => (
    <>
      <div className="group-hero">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--black)' }}>우라주<br />챌린지</div>
          <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--black)', color: 'white', padding: '4px 11px', borderRadius: 20 }}>{isEnded ? '챌린지 완료 🎉' : `Day ${challengeDay} / 30`}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 13 }}>
          {`${challengeStartDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 시작`}
          {' — '}
          {`${new Date(challengeStartDate.getTime() + 29 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 완료`}
        </div>
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{ height: '100%', background: 'var(--black)', borderRadius: 3, width: `${Math.min(100, (challengeDay / 30) * 100)}%` }} />
        </div>
      </div>
      <div className="sec-label">멤버 소개<span className="sec-sub">{cohortMembers.length}명</span></div>
      {cohortMembers.length === 0 && <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink3)', fontSize: 13 }}>아직 멤버가 없어요</div>}
      {cohortMembers.map(m => (
        <div key={m.id} className="mc" onClick={() => setSelectedProfile(m)}>
          <div className="mc-top">
            <div className="mc-av" style={{ background: m.color || '#333' }}>{m.nickname?.[0] || '?'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--black)' }}>{m.nickname}</span>
                {(m.challenge_round || 1) >= 2 && <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: '#2D4A7A', padding: '2px 7px', borderRadius: 20 }}>{m.challenge_round}R</span>}
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>{m.streak || 0}일 연속 🔥 · {getLevel(m.points || 0).title}</div>
            </div>
            {m.id === session.user.id
              ? <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: 'var(--black)', padding: '2px 6px', borderRadius: 20 }}>나</span>
              : <button onClick={e => toggleFollow(m.id, e)} style={{ fontSize: 11, fontWeight: 700, border: followings.has(m.id) ? '1.5px solid var(--border)' : '1.5px solid var(--black)', borderRadius: 20, padding: '4px 11px', background: followings.has(m.id) ? 'var(--surface)' : 'var(--black)', color: followings.has(m.id) ? 'var(--ink2)' : 'white', cursor: 'pointer', flexShrink: 0 }}>{followings.has(m.id) ? '팔로잉' : '+ 팔로우'}</button>
            }
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
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>30일 챌린지 Day {challengeDay}</div>
          </div>
          <Icon name="settings" size={16} color="var(--ink3)" />
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-title">알림</div>
        <div className="settings-card">
          <div className="settings-row" onClick={!pushGranted ? subscribePush : undefined} style={{ cursor: pushGranted ? 'default' : 'pointer' }}>
            <div>
              <div className="settings-row-label">푸시 알림</div>
              <div className="settings-row-sub">{pushGranted ? '댓글·반응 알림이 켜져 있어요' : '탭해서 알림 허용하기'}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: pushGranted ? '#16A34A' : 'var(--ink3)' }}>
              {pushGranted ? '켜짐' : '꺼짐'}
            </div>
          </div>
          <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <div className="settings-row-label">매일 기록 알림</div>
              <div className="settings-row-sub">{notifTime ? `매일 ${notifTime}에 기록 리마인더가 와요` : '원하는 시간에 리마인더를 받아보세요'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
              {[
                { time: '07:00', label: '🌅 7시' },
                { time: '11:30', label: '☀️ 11:30' },
                { time: '18:30', label: '🌆 18:30' },
                { time: '21:00', label: '🌙 9시' },
              ].map(({ time, label }) => (
                <button key={time} onClick={() => saveNotifTime(notifTime === time ? '' : time)} disabled={savingNotif}
                  style={{ flex: 1, padding: '8px 4px', borderRadius: 10, border: notifTime === time ? '2px solid var(--black)' : '1.5px solid var(--border)', background: notifTime === time ? 'var(--black)' : 'transparent', color: notifTime === time ? 'white' : 'var(--ink2)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-title">서비스</div>
        <div className="settings-card">
          <div className="settings-row"><div><div className="settings-row-label">문의하기</div><div className="settings-row-sub">oorajoo@naver.com</div></div></div>
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
          <button className={`admin-tab${adminTab === 'cohort' ? ' on' : ''}`} onClick={() => setAdminTab('cohort')}>기수관리</button>
          <button className={`admin-tab${adminTab === 'apply' ? ' on' : ''}`} onClick={() => { setAdminTab('apply'); loadApplications() }}>신청자</button>
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
          {notice && (
            <button onClick={async () => { if (!confirm('공지를 삭제할까요?')) return; await supabase.from('notices').delete().eq('id', notice.id); setNotice(null) }} style={{ width: '100%', background: 'none', border: '1px solid #DC2626', borderRadius: 14, padding: 12, fontSize: 13, fontWeight: 700, color: '#DC2626', cursor: 'pointer', marginTop: 8 }}>현재 공지 삭제</button>
          )}
        </>)}

        {adminTab === 'cohort' && (
          <>
            {cohorts.map(cohort => (
              <div key={cohort.id} style={{ background: 'var(--surface)', borderRadius: 12, padding: 13, marginBottom: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 900 }}>{cohort.title || `${cohort.id}기`}</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: cohort.is_open ? '#DCFCE7' : '#DBEAFE', color: cohort.is_open ? '#16A34A' : '#1D4ED8' }}>{cohort.is_open ? '상시' : '정식기수'}</span>
                    <span style={{ fontSize: 10, color: 'var(--ink3)' }}>{cohortCounts[cohort.id] || 0}명</span>
                  </div>
                </div>
                <input className="admin-input" style={{ marginBottom: 6 }} placeholder="기수 이름 (예: 1기, 봄기수)" defaultValue={cohort.title || ''} id={`ct-${cohort.id}`} />
                <input className="admin-input" style={{ marginBottom: 6 }} placeholder="기수 소개" defaultValue={cohort.description || ''} id={`cd-${cohort.id}`} />
                <input className="admin-input" style={{ marginBottom: 8 }} placeholder="모집 링크" defaultValue={cohort.recruit_link || ''} id={`cl-${cohort.id}`} />
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>상시 운영</span>
                    <button className={`toggle-btn ${cohort.is_open ? 'on' : 'off'}`} onClick={async () => { await supabase.from('cohorts').update({ is_open: !cohort.is_open }).eq('id', cohort.id); loadCohorts() }}><div className="toggle-dot" /></button>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>모집 중</span>
                    <button className={`toggle-btn ${cohort.is_recruiting ? 'on' : 'off'}`} onClick={async () => { await supabase.from('cohorts').update({ is_recruiting: !cohort.is_recruiting }).eq('id', cohort.id); loadCohorts() }}><div className="toggle-dot" /></button>
                  </div>
                </div>
                <button onClick={async () => {
                  const title = (document.getElementById(`ct-${cohort.id}`) as HTMLInputElement)?.value
                  const desc = (document.getElementById(`cd-${cohort.id}`) as HTMLInputElement)?.value
                  const link = (document.getElementById(`cl-${cohort.id}`) as HTMLInputElement)?.value
                  await supabase.from('cohorts').update({ title, description: desc, recruit_link: link || null }).eq('id', cohort.id)
                  loadCohorts(); showToast('저장됐어요 ✓')
                }} style={{ width: '100%', background: 'var(--black)', color: 'white', border: 'none', borderRadius: 10, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>저장</button>
              </div>
            ))}
            <button onClick={async () => {
              const maxId = cohorts.reduce((max, c) => Math.max(max, c.id), 0)
              await supabase.from('cohorts').insert({ start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'active', max_slots: 20, title: `${maxId + 1}기`, is_open: false })
              loadCohorts(); showToast(`${maxId + 1}기 생성됐어요!`)
            }} style={{ width: '100%', background: 'none', border: '2px dashed var(--border)', borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 700, color: 'var(--ink3)', cursor: 'pointer' }}>
              + 새 기수 만들기
            </button>
          </>
        )}

        {adminTab === 'apply' && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 10 }}>
              신청자 목록 ({applications.length}명)
            </div>
            {applications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink3)', fontSize: 13 }}>아직 신청자가 없어요</div>
            )}
            {applications.map(app => (
              <div key={app.id} style={{ background: 'var(--surface)', borderRadius: 12, padding: 13, marginBottom: 8, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--black)' }}>{app.nickname}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink3)', marginLeft: 6 }}>{app.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: app.status === 'approved' ? '#DCFCE7' : app.status === 'rejected' ? '#FEE2E2' : 'var(--border)', color: app.status === 'approved' ? '#16A34A' : app.status === 'rejected' ? '#DC2626' : 'var(--ink3)' }}>
                    {app.status === 'approved' ? '승인' : app.status === 'rejected' ? '거절' : '대기중'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 4 }}>{app.email}</div>
                <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, marginBottom: app.status === 'pending' ? 10 : 0, background: 'var(--white)', borderRadius: 8, padding: '8px 10px', border: '1px solid var(--border)' }}>
                  "{app.pledge}"
                </div>
                {app.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button onClick={async () => {
                      await supabase.from('recruit_applications').update({ status: 'approved' }).eq('id', app.id)
                      loadApplications()
                      showToast(`${app.nickname}님 승인됐어요 ✓`)
                    }} style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 10, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      승인
                    </button>
                    <button onClick={async () => {
                      await supabase.from('recruit_applications').update({ status: 'rejected' }).eq('id', app.id)
                      loadApplications()
                    }} style={{ flex: 1, background: 'none', border: '1px solid #DC2626', borderRadius: 10, padding: '8px', fontSize: 12, fontWeight: 700, color: '#DC2626', cursor: 'pointer' }}>
                      거절
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

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
            <div className="hdr-chip">Day {challengeDay} / 30</div>
          </div>
        </div>

        {!isInstalled && installPrompt && (
          <div className="install-bar">
            <div style={{ flex: 1 }}>
              <span className="install-bar-txt">앱으로 설치하기</span>
              <span className="install-bar-sub">홈화면에 추가하면 더 빠르게 접속돼요</span>
            </div>
            <button className="install-bar-btn" onClick={handleInstall}>설치</button>
            <button className="install-bar-close" onClick={() => setInstallPrompt(null)}>✕</button>
          </div>
        )}

        {!isInstalled && showIOSGuide && (
          <div className="ios-guide">
            <button className="ios-guide-close" onClick={() => setShowIOSGuide(false)}>✕</button>
            <div className="ios-guide-title">홈화면에 앱으로 추가하기</div>
            <div className="ios-guide-steps">
              <div className="ios-guide-step">
                <span className="ios-guide-step-icon">⬆️</span>
                <span>하단 공유 버튼 탭</span>
              </div>
              <span className="ios-guide-arrow">›</span>
              <div className="ios-guide-step">
                <span className="ios-guide-step-icon">➕</span>
                <span>홈 화면에 추가</span>
              </div>
              <span className="ios-guide-arrow">›</span>
              <div className="ios-guide-step">
                <span className="ios-guide-step-icon">추가</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'today' && renderToday()}
        {tab === 'lounge' && renderLounge()}
        {tab === 'record' && renderRecord()}
        {tab === 'plaza' && renderPlaza()}
        {tab === 'group' && renderGroup()}
        {tab === 'settings' && renderSettings()}

        <div className="tab-bar">
          {[['today', 'sprout', '오늘'], ['lounge', 'sun', '라운지'], ['record', 'calendar', '기록'], ['plaza', 'globe', '광장'], ['settings', 'settings', '설정']].map(([k, icon, label]) => (
            <button key={k} className={`tab-btn${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>
              <Icon name={icon} size={17} color={tab === k ? 'white' : 'var(--ink3)'} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {isAdmin && <button className="admin-fab" onClick={() => setShowAdmin(true)}><Icon name="bell" size={18} color="white" /></button>}
        {isAdmin && showAdmin && renderAdmin()}

        {toast && (
          <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', background: 'var(--black)', color: 'white', padding: '10px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700, zIndex: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 32px)', textAlign: 'center' }}>
            {toast}
          </div>
        )}

        {editingFeedItem && (
          <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setEditingFeedItem(null) }}>
            <div className="modal">
              <div className="modal-handle" />
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--black)', marginBottom: 16 }}>기록 수정</div>
              {[
                { key: 'gratitude' as const, label: '오늘의 감사' },
                { key: 'goal' as const, label: '오늘의 목표' },
                { key: 'question_answer' as const, label: '오늘의 질문 답변' },
              ].map(({ key, label }) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>{label}</div>
                  <textarea style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 13px', fontSize: 13, color: 'var(--ink)', resize: 'none', lineHeight: 1.65, outline: 'none', fontFamily: 'inherit' }} rows={2} value={editingFeedItem[key]} onChange={e => setEditingFeedItem(p => p ? { ...p, [key]: e.target.value } : p)} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, cursor: 'pointer' }} onClick={saveFeedEdit}>저장하기</button>
                <button style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink2)', border: 'none', borderRadius: 14, padding: 13, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingFeedItem(null)}>취소</button>
              </div>
            </div>
          </div>
        )}

        {selectedProfile && (
          <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) { setSelectedProfile(null); setEditingProfile(false) } }}>
            <div className="modal">
              <div className="modal-handle" />
              {!editingProfile ? (
                <>
                  <div style={{ width: 70, height: 70, borderRadius: 22, background: selectedProfile.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 900, color: 'white', margin: '0 auto 13px' }}>{selectedProfile.nickname?.[0]}</div>
                  <div style={{ fontSize: 21, fontWeight: 900, color: 'var(--black)', textAlign: 'center', letterSpacing: '-0.5px' }}>{selectedProfile.nickname}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{selectedProfile.streak}일 연속 🔥</span>
                    {(selectedProfile.challenge_round || 1) >= 2 && <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: '#2D4A7A', padding: '2px 9px', borderRadius: 20 }}>{selectedProfile.challenge_round}라운드 도전중</span>}
                  </div>
                  {selectedProfile.intro && <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.75, marginBottom: 14 }}>{selectedProfile.intro}</div>}
                  {(selectedProfile.tags || []).length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                      {selectedProfile.tags.map((t, i) => <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink2)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 20 }}>{t}</span>)}
                    </div>
                  )}
                  {(selectedProfile.threads_id || selectedProfile.insta_id || selectedProfile.naver_blog) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, background: 'var(--surface)', borderRadius: 12, padding: '12px 14px' }}>
                      {selectedProfile.threads_id && (
                        <a href={`https://www.threads.net/@${selectedProfile.threads_id}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'white', flexShrink: 0 }}>T</div>
                          <span style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 600 }}>@{selectedProfile.threads_id}</span>
                        </a>
                      )}
                      {selectedProfile.insta_id && (
                        <a href={`https://www.instagram.com/${selectedProfile.insta_id}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'white', flexShrink: 0 }}>I</div>
                          <span style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 600 }}>@{selectedProfile.insta_id}</span>
                        </a>
                      )}
                      {selectedProfile.naver_blog && (
                        <a href={`https://blog.naver.com/${selectedProfile.naver_blog}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'white', flexShrink: 0 }}>N</div>
                          <span style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 600 }}>{selectedProfile.naver_blog}</span>
                        </a>
                      )}
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
                    <button style={{ flex: 1, background: 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, cursor: 'pointer', opacity: savingProfile ? 0.6 : 1 }} disabled={savingProfile} onClick={saveProfileEdit}>{savingProfile ? '저장 중...' : '저장하기'}</button>
                    <button style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink2)', border: 'none', borderRadius: 14, padding: 13, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingProfile(false)}>취소</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showBadgePopup && newBadge && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 400, animation: 'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <style>{`@keyframes badgePop { from { opacity:0; transform:translate(-50%,-50%) scale(0.5) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }`}</style>
            <div style={{ background: 'var(--black)', borderRadius: 24, padding: '28px 32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', minWidth: 220 }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>{newBadge.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', marginBottom: 5 }}>NEW BADGE</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 5 }}>{newBadge.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{newBadge.desc}</div>
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
              <button onClick={doCopyShare} style={{ width: '100%', background: copiedShare ? '#333' : 'var(--black)', color: 'white', border: 'none', borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 900, marginBottom: 8, cursor: 'pointer' }}>{copiedShare ? '✓ 복사됐어요!' : '링크 복사하기'}</button>
              <button onClick={doAppShare} style={{ width: '100%', background: 'var(--surface)', color: 'var(--black)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, fontSize: 13, fontWeight: 700, marginBottom: 8, cursor: 'pointer' }}>📤 앱으로 공유하기</button>
              <button onClick={() => setShareModal(null)} style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, color: 'var(--ink3)', padding: 10, cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="confirm-bg" onClick={e => { if (e.target === e.currentTarget) setShowDeleteConfirm(false) }}>
            <div style={{ background: 'var(--white)', borderRadius: 20, padding: '24px 20px', width: 'calc(100% - 40px)', maxWidth: 360 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#DC2626', marginBottom: 8 }}>정말 탈퇴할까요?</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 20 }}>모든 기록, 댓글, 반응이 <strong>즉시 삭제</strong>되며 복구할 수 없어요.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink2)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>취소</button>
                <button onClick={async () => {
                  const res = await fetch('/api/delete-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: session.user.id }),
                  })
                  if (res.ok) {
                    await supabase.auth.signOut()
                  } else {
                    const d = await res.json()
                    alert('탈퇴 실패: ' + d.error)
                  }
                }} style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>탈퇴하기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
