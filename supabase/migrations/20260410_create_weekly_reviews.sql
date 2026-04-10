CREATE TABLE IF NOT EXISTS weekly_reviews (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  week_number int NOT NULL,
  challenge_round int DEFAULT 1,
  records_count int DEFAULT 0,
  achieved_count int DEFAULT 0,
  pledge text,
  ai_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own weekly reviews"
  ON weekly_reviews FOR ALL USING (auth.uid() = user_id);
