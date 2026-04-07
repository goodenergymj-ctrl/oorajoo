-- push_subscriptions 테이블
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 구독 조회" ON push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 구독 저장" ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 구독 수정" ON push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 구독 삭제" ON push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Service role은 모든 접근 허용 (푸시 발송 서버에서 사용)
CREATE POLICY "서비스 롤 전체 접근" ON push_subscriptions
  FOR ALL USING (auth.role() = 'service_role');
