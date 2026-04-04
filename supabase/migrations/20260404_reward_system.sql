-- profiles 테이블에 보상 시스템 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_days INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;

-- 기존 유저 streak 기반으로 total_days 초기화 (streak이 0이면 실제 기록 수로 세팅 불가, 일단 streak 값 사용)
UPDATE profiles SET total_days = COALESCE(streak, 0) WHERE total_days = 0 AND streak > 0;

-- 그룹 달성률을 위한 뷰
CREATE OR REPLACE VIEW today_completion AS
SELECT
  cohort_id,
  COUNT(DISTINCT user_id) as completed_count,
  DATE(created_at AT TIME ZONE 'Asia/Seoul') as date_kst
FROM feed
WHERE DATE(created_at AT TIME ZONE 'Asia/Seoul') = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date
GROUP BY cohort_id, DATE(created_at AT TIME ZONE 'Asia/Seoul');
