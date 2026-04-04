CREATE TABLE IF NOT EXISTS recruit_applications (
  id SERIAL PRIMARY KEY,
  cohort_id INT REFERENCES cohorts(id),
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  email TEXT NOT NULL,
  pledge TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recruit_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 신청 가능" ON recruit_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "관리자만 조회" ON recruit_applications
  FOR SELECT USING (true);
