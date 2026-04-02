import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  nickname: string
  intro: string | null
  color: string
  tags: string[]
  threads_id: string | null
  insta_id: string | null
  naver_blog: string | null
  streak: number
  cohort_id: number | null
  is_admin: boolean
  is_approved: boolean
  created_at: string
  challenge_started_at: string | null
  challenge_round: number
}

export type Cohort = {
  id: number
  name: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'ended'
  max_slots: number
  price: number
}

export type FeedItem = {
  id: number
  user_id: string
  cohort_id: number
  gratitude: string
  goal: string
  question_answer: string
  is_private: boolean
  created_at: string
  profiles?: Profile
  reactions?: Reaction[]
  comments?: Comment[]
}

export type LoungePost = {
  id: number
  user_id: string
  cohort_id: number
  content: string
  tag: string | null
  image_url: string | null
  created_at: string
  profiles?: Profile
  reactions?: Reaction[]
}

export type Reaction = {
  id: number
  user_id: string
  target_type: string
  target_id: number
  emoji: string
}

export type Comment = {
  id: number
  user_id: string
  feed_id: number
  content: string
  created_at: string
  profiles?: Profile
}

export type Notice = {
  id: number
  title: string
  body: string
  link: string | null
  poll: any | null
  cohort_id: number | null
  created_at: string
}
