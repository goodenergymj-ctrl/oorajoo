-- follows 테이블 생성
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 팔로우 목록 조회" ON follows
  FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "팔로우 추가" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "팔로우 취소" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- streak_shield 컬럼 추가 (스트릭 보호권)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_shield BOOLEAN DEFAULT false;
